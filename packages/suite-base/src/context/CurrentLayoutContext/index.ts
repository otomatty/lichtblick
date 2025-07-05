// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { createContext, useCallback, useLayoutEffect, useReducer, useRef, useState } from "react";
import { getLeaves } from "react-mosaic-component";

import {
  selectWithUnstableIdentityWarning,
  useGuaranteedContext,
  useShallowMemo,
} from "@lichtblick/hooks";
import Logger from "@lichtblick/log";
import { RenderState, VariableValue } from "@lichtblick/suite";
import useShouldNotChangeOften from "@lichtblick/suite-base/hooks/useShouldNotChangeOften";
import toggleSelectedPanel from "@lichtblick/suite-base/providers/CurrentLayoutProvider/toggleSelectedPanel";
import { PanelConfig, PlaybackConfig, UserScripts } from "@lichtblick/suite-base/types/panels";

import {
  AddPanelPayload,
  ChangePanelLayoutPayload,
  ClosePanelPayload,
  CreateTabPanelPayload,
  DropPanelPayload,
  EndDragPayload,
  LayoutData,
  MoveTabPayload,
  SaveConfigsPayload,
  SplitPanelPayload,
  StartDragPayload,
  SwapPanelPayload,
} from "./actions";

/**
 * パネルタイプの型定義
 *
 * パネルの種類を識別するための文字列型。
 * 例: "Plot", "Image", "3D", "Table" など
 */
type PanelType = string;

export type { LayoutData };

/**
 * パネル間で共有される状態の型定義
 *
 * 複数のパネル間で共有される一時的な状態データ。
 * レンダリング状態から派生した型で、パネル間の連携に使用される。
 */
export type SharedPanelState = RenderState["sharedPanelState"];

/**
 * パネル状態更新関数の型定義
 *
 * 特定のパネルタイプに関連付けられた共有状態を更新するための関数型。
 *
 * @param type 更新対象のパネルタイプ
 * @param data 新しい共有状態データ
 */
export type UpdatePanelState = (type: PanelType, data: SharedPanelState) => void;

/**
 * 選択されたレイアウトの情報
 *
 * レイアウトの基本情報と編集状態を含む構造体。
 * レイアウトの保存、読み込み、編集管理に使用される。
 */
export type SelectedLayout = {
  /** レイアウトデータ（パネル配置、設定、変数など） */
  data: LayoutData | undefined;
  /** レイアウト名（ユーザーが設定可能） */
  name?: string;
  /** 編集済みフラグ（保存が必要かどうかを示す） */
  edited?: boolean;
};

/**
 * レイアウトIDの型定義（ブランド型による型安全性確保）
 *
 * 通常の文字列と区別するためのブランド型。
 * レイアウトIDとその他の文字列を混同することを防ぐ。
 */
export type LayoutID = string & { __brand: "LayoutID" };

/**
 * レイアウト状態の型定義
 *
 * アプリケーション全体のレイアウト状態を表現する不変オブジェクト。
 * 現在のレイアウト情報とパネル間共有状態を管理する。
 */
export type LayoutState = Readonly<{
  /**
   * パネル間で共有される一時的な状態
   *
   * パネルタイプをキーとして、各パネルタイプ固有の
   * 共有状態を保持する。例：選択されたトピック、
   * 時間範囲、フィルター設定など
   */
  sharedPanelState?: Record<PanelType, SharedPanelState>;

  /**
   * 現在選択されているレイアウト
   *
   * レイアウトの読み込み状態、データ、メタデータを含む。
   * undefinedの場合はレイアウトが選択されていない状態。
   */
  selectedLayout:
    | {
        /** レイアウトID（一意識別子） */
        id: LayoutID;
        /** 読み込み中フラグ（非同期読み込み時に使用） */
        loading?: boolean;
        /** レイアウトデータ（パネル配置、設定、変数など） */
        data: LayoutData | undefined;
        /** レイアウト名（表示用） */
        name?: string;
        /** 編集済みフラグ（未保存の変更があるかどうか） */
        edited?: boolean;
      }
    | undefined;
}>;

/**
 * CurrentLayoutContext - 現在のレイアウト状態管理インターフェース
 *
 * このインターフェースは、モザイクレイアウト、ユーザーノード、
 * 再生設定など、保存された「レイアウト」の一部とみなされる
 * すべてを管理します。
 *
 * 主な責任:
 * - レイアウト状態の管理とリスナー登録
 * - パネル選択状態の管理
 * - レイアウト操作アクション（追加、削除、移動など）
 * - パネル設定の保存と更新
 * - グローバル変数とユーザースクリプトの管理
 * - ドラッグ&ドロップによるパネル操作
 *
 * 設計パターン:
 * - Observer Pattern: 状態変更の通知
 * - Command Pattern: アクション実行
 * - Strategy Pattern: パネルタイプ別の処理
 *
 * 使用例:
 * ```typescript
 * function LayoutManager() {
 *   const { actions } = useCurrentLayoutActions();
 *   const layoutName = useCurrentLayoutSelector(
 *     (state) => state.selectedLayout?.name
 *   );
 *
 *   const handleAddPanel = () => {
 *     actions.addPanel({
 *       id: generatePanelId("Plot"),
 *       config: { topics: ["/data"] }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <h1>Current Layout: {layoutName}</h1>
 *       <button onClick={handleAddPanel}>Add Panel</button>
 *     </div>
 *   );
 * }
 * ```
 */
export interface ICurrentLayout {
  /** レイアウト状態変更リスナーの追加 */
  addLayoutStateListener: (listener: (_: LayoutState) => void) => void;
  /** レイアウト状態変更リスナーの削除 */
  removeLayoutStateListener: (listener: (_: LayoutState) => void) => void;
  /** 選択パネルID変更リスナーの追加 */
  addSelectedPanelIdsListener: (listener: (_: readonly string[]) => void) => void;
  /** 選択パネルID変更リスナーの削除 */
  removeSelectedPanelIdsListener: (listener: (_: readonly string[]) => void) => void;

  /**
   * モザイクID
   *
   * すべてのモザイク（トップレベルとタブ内）で同じモザイクIDを使用して、
   * それらの間でのドラッグ&ドロップをサポートします。
   */
  mosaicId: string;

  /** 現在選択されているパネルIDの取得 */
  getSelectedPanelIds: () => readonly string[];
  /** 選択パネルIDの設定 */
  setSelectedPanelIds: (
    _: readonly string[] | ((prevState: readonly string[]) => readonly string[]),
  ) => void;

  /** レイアウト操作アクション */
  actions: {
    /**
     * 現在の状態を返す
     *
     * クリックハンドラーや非同期で状態を読み取るコールバックで有用。
     * 状態が変更されるたびに更新されることを望まない場合に使用。
     */
    getCurrentLayoutState: () => LayoutState;

    /** 選択されたレイアウトIDの設定 */
    setSelectedLayoutId: (id: LayoutID | undefined) => void;

    /**
     * 現在のレイアウトを上書き
     *
     * レイアウト状態をリセットします
     */
    setCurrentLayout: (newLayout: SelectedLayout | undefined) => void;

    /**
     * 特定のパネルタイプに関連付けられた一時的な状態を更新
     */
    updateSharedPanelState: UpdatePanelState;

    /** パネル設定の保存 */
    savePanelConfigs: (payload: SaveConfigsPayload) => void;
    /** パネル設定の更新 */
    updatePanelConfigs: (panelType: string, updater: (config: PanelConfig) => PanelConfig) => void;
    /** タブパネルの作成 */
    createTabPanel: (payload: CreateTabPanelPayload) => void;
    /** パネルレイアウトの変更 */
    changePanelLayout: (payload: ChangePanelLayoutPayload) => void;
    /** グローバル変数の上書き */
    overwriteGlobalVariables: (payload: Record<string, VariableValue>) => void;
    /** グローバル変数の設定 */
    setGlobalVariables: (payload: Record<string, VariableValue>) => void;
    /** ユーザースクリプトの設定 */
    setUserScripts: (payload: Partial<UserScripts>) => void;
    /** 再生設定の設定 */
    setPlaybackConfig: (payload: Partial<PlaybackConfig>) => void;
    /** パネルの閉じる */
    closePanel: (payload: ClosePanelPayload) => void;
    /** パネルの分割 */
    splitPanel: (payload: SplitPanelPayload) => void;
    /** パネルの交換 */
    swapPanel: (payload: SwapPanelPayload) => void;
    /** タブの移動 */
    moveTab: (payload: MoveTabPayload) => void;
    /** パネルの追加 */
    addPanel: (payload: AddPanelPayload) => void;
    /** パネルのドロップ */
    dropPanel: (payload: DropPanelPayload) => void;
    /** ドラッグ開始 */
    startDrag: (payload: StartDragPayload) => void;
    /** ドラッグ終了 */
    endDrag: (payload: EndDragPayload) => void;
  };
}

/**
 * CurrentLayoutのアクション型定義
 *
 * ICurrentLayoutインターフェースからアクション部分を抽出した型。
 * アクションのみを必要とするコンポーネントで使用される。
 */
export type CurrentLayoutActions = ICurrentLayout["actions"];

/**
 * 選択パネル操作アクション
 *
 * パネルの選択状態を管理するためのアクション群。
 * 複数パネルの選択、全選択、選択切り替えなどの操作を提供。
 */
export type SelectedPanelActions = {
  /** 選択パネルIDの取得 */
  getSelectedPanelIds: () => readonly string[];
  /** 現在選択されているパネルIDの配列 */
  selectedPanelIds: readonly string[];
  /** 選択パネルIDの設定 */
  setSelectedPanelIds: (
    _: readonly string[] | ((prevState: readonly string[]) => string[]),
  ) => void;
  /** 全パネルの選択 */
  selectAllPanels: () => void;
  /** パネル選択状態の切り替え */
  togglePanelSelected: (panelId: string, containingTabId: string | undefined) => void;
};

const log = Logger.getLogger(__filename);

/**
 * CurrentLayoutContext - 現在のレイアウト管理コンテキスト
 *
 * レイアウト状態の管理と操作を提供するReactコンテキスト。
 * アプリケーション全体でレイアウト情報を共有するために使用される。
 */
const CurrentLayoutContext = createContext<ICurrentLayout | undefined>(undefined);
CurrentLayoutContext.displayName = "CurrentLayoutContext";

/**
 * usePanelMosaicId - パネルモザイクIDを取得するカスタムフック
 *
 * react-mosaic-componentで使用されるモザイクIDを取得します。
 * 全てのモザイク（トップレベルとタブ内）で同じIDを使用することで、
 * それらの間でのドラッグ&ドロップをサポートします。
 *
 * @returns モザイクID文字列
 *
 * 使用例:
 * ```typescript
 * function PanelMosaic() {
 *   const mosaicId = usePanelMosaicId();
 *
 *   return (
 *     <Mosaic<string>
 *       renderTile={(id) => <Panel id={id} />}
 *       mosaicId={mosaicId}
 *     />
 *   );
 * }
 * ```
 */
export function usePanelMosaicId(): string {
  return useGuaranteedContext(CurrentLayoutContext).mosaicId;
}

/**
 * useCurrentLayoutActions - 現在のレイアウトアクションを取得するカスタムフック
 *
 * レイアウト操作のためのアクション関数群を取得します。
 * パネルの追加、削除、移動、設定変更などの操作を提供します。
 *
 * @returns レイアウト操作アクション
 *
 * 使用例:
 * ```typescript
 * function PanelToolbar() {
 *   const { addPanel, closePanel, savePanelConfigs } = useCurrentLayoutActions();
 *
 *   const handleAddPlot = () => {
 *     addPanel({
 *       id: generatePanelId("Plot"),
 *       config: { topics: ["/sensor_data"] }
 *     });
 *   };
 *
 *   const handleClosePanel = (panelId: string) => {
 *     closePanel({
 *       root: getCurrentLayout(),
 *       path: findPanelPath(panelId)
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleAddPlot}>Add Plot</button>
 *       <button onClick={() => handleClosePanel("panel1")}>Close Panel</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCurrentLayoutActions(): CurrentLayoutActions {
  return useGuaranteedContext(CurrentLayoutContext).actions;
}

/**
 * useCurrentLayoutSelector - レイアウト状態から値を選択するカスタムフック
 *
 * レイアウト状態から特定の値を選択し、その値が変更された時のみ
 * コンポーネントを再レンダリングします。パフォーマンス最適化のために
 * セレクター関数の安定性をチェックします。
 *
 * @param selector レイアウト状態から値を選択するセレクター関数
 * @returns セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * function LayoutInfo() {
 *   // 現在のレイアウト名を取得
 *   const layoutName = useCurrentLayoutSelector(
 *     (state) => state.selectedLayout?.name
 *   );
 *
 *   // 編集状態を取得
 *   const isEdited = useCurrentLayoutSelector(
 *     (state) => state.selectedLayout?.edited ?? false
 *   );
 *
 *   // 特定のパネルタイプの共有状態を取得
 *   const plotSharedState = useCurrentLayoutSelector(
 *     (state) => state.sharedPanelState?.Plot
 *   );
 *
 *   return (
 *     <div>
 *       <h2>{layoutName} {isEdited && "(edited)"}</h2>
 *       <p>Plot shared state: {JSON.stringify(plotSharedState)}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * パフォーマンス注意事項:
 * - セレクター関数は安定している必要があります（useCallback推奨）
 * - 不安定なセレクターは警告が表示されます
 * - 複雑な計算は useMemo で最適化してください
 */
export function useCurrentLayoutSelector<T>(selector: (layoutState: LayoutState) => T): T {
  const currentLayout = useGuaranteedContext(CurrentLayoutContext);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  // 不安定な関数セレクターを使用している場所をキャッチ
  useShouldNotChangeOften(selector, () => {
    log.warn(
      "useCurrentLayoutSelector is changing frequently. Rewrite your selector as a stable function.",
    );
  });

  const state = useRef<{ value: T; selector: typeof selector } | undefined>(undefined);
  if (!state.current || selector !== state.current.selector) {
    state.current = {
      value: selectWithUnstableIdentityWarning(
        currentLayout.actions.getCurrentLayoutState(),
        selector,
      ),
      selector,
    };
  }
  useLayoutEffect(() => {
    let mounted = true;
    const listener = (layoutState: LayoutState) => {
      // 注意: レイアウト状態リスナーが既に呼び出されている場合、
      // removeLayoutStateListenerは遅すぎます。状態リスナーの呼び出し中に
      // コンポーネントがアンマウントされる可能性があります
      if (!mounted) {
        return;
      }
      const newValue = selectWithUnstableIdentityWarning(layoutState, selector);
      if (newValue === state.current?.value) {
        return;
      }
      state.current = {
        value: newValue,
        selector,
      };
      forceUpdate();
    };
    // 必要に応じて更新、つまりレンダリングとこのエフェクトの間に状態が変更された場合
    listener(currentLayout.actions.getCurrentLayoutState());
    currentLayout.addLayoutStateListener(listener);
    return () => {
      mounted = false;
      currentLayout.removeLayoutStateListener(listener);
    };
  }, [currentLayout, selector]);

  return state.current.value;
}

/**
 * useSelectedPanels - 選択されたパネルの管理を行うカスタムフック
 *
 * パネルの選択状態を管理し、選択操作のためのアクション関数を提供します。
 * 複数パネルの選択、全選択、選択切り替えなどの機能を含みます。
 *
 * @returns 選択パネル操作アクション
 *
 * 使用例:
 * ```typescript
 * function PanelSelectionManager() {
 *   const {
 *     selectedPanelIds,
 *     setSelectedPanelIds,
 *     selectAllPanels,
 *     togglePanelSelected
 *   } = useSelectedPanels();
 *
 *   const handleSelectAll = () => {
 *     selectAllPanels();
 *   };
 *
 *   const handleTogglePanel = (panelId: string) => {
 *     togglePanelSelected(panelId, undefined);
 *   };
 *
 *   const handleClearSelection = () => {
 *     setSelectedPanelIds([]);
 *   };
 *
 *   return (
 *     <div>
 *       <p>Selected panels: {selectedPanelIds.length}</p>
 *       <button onClick={handleSelectAll}>Select All</button>
 *       <button onClick={handleClearSelection}>Clear Selection</button>
 *       {selectedPanelIds.map(id => (
 *         <div key={id} onClick={() => handleTogglePanel(id)}>
 *           Panel {id}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * 機能:
 * - 複数パネルの同時選択
 * - Ctrl/Cmd+クリックによる選択切り替え
 * - 全パネル選択
 * - タブ内パネルの選択サポート
 */
export function useSelectedPanels(): SelectedPanelActions {
  const currentLayout = useGuaranteedContext(CurrentLayoutContext);
  const [selectedPanelIds, setSelectedPanelIdsState] = useState(() =>
    currentLayout.getSelectedPanelIds(),
  );
  useLayoutEffect(() => {
    const listener = (newIds: readonly string[]) => {
      setSelectedPanelIdsState(newIds);
    };
    currentLayout.addSelectedPanelIdsListener(listener);
    return () => {
      currentLayout.removeSelectedPanelIdsListener(listener);
    };
  }, [currentLayout]);

  const setSelectedPanelIds = useGuaranteedContext(CurrentLayoutContext).setSelectedPanelIds;
  const getSelectedPanelIds = useGuaranteedContext(CurrentLayoutContext).getSelectedPanelIds;
  const { getCurrentLayoutState: getCurrentLayout } = useCurrentLayoutActions();

  const selectAllPanels = useCallback(() => {
    // eslint-disable-next-line no-restricted-syntax
    const panelIds = getLeaves(getCurrentLayout().selectedLayout?.data?.layout ?? null);
    setSelectedPanelIds(panelIds);
  }, [getCurrentLayout, setSelectedPanelIds]);

  const togglePanelSelected = useCallback(
    (panelId: string, containingTabId: string | undefined) => {
      setSelectedPanelIds((selectedIds) => {
        const { selectedLayout } = getCurrentLayout();
        if (!selectedLayout?.data) {
          return selectedIds;
        }
        return toggleSelectedPanel(
          panelId,
          containingTabId,
          selectedLayout.data.configById,
          selectedIds,
        );
      });
    },
    [setSelectedPanelIds, getCurrentLayout],
  );

  return useShallowMemo({
    getSelectedPanelIds,
    selectedPanelIds,
    setSelectedPanelIds,
    selectAllPanels,
    togglePanelSelected,
  });
}

export default CurrentLayoutContext;

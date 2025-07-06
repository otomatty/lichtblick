// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

/**
 * @fileoverview Panel HOC - Lichtblickパネルシステムの中核高階コンポーネント
 *
 * このファイルは、Lichtblickアプリケーションにおけるパネルシステムの心臓部を担う
 * 高階コンポーネント（HOC）を実装している。全てのパネルコンポーネントは、この
 * Panel HOCでラップされることで、統一された機能と動作を獲得する。
 *
 * ## 主要機能
 *
 * ### 1. 設定管理システム
 * - パネル固有の設定（config）の自動読み込み・保存
 * - デフォルト設定とユーザー設定のマージ処理
 * - 設定の永続化とマイグレーション対応
 *
 * ### 2. レイアウト統合
 * - React Mosaicとの完全統合
 * - パネルの分割、結合、移動、削除
 * - タブ機能とのシームレスな連携
 * - フルスクリーン表示機能
 *
 * ### 3. インタラクション制御
 * - ドラッグ&ドロップによるパネル操作
 * - キーボードショートカット対応
 * - マルチ選択とバッチ操作
 * - クイックアクション（分割、削除等）
 *
 * ### 4. エラーハンドリング
 * - PanelErrorBoundaryによる例外捕捉
 * - パネル単位での障害分離
 * - 復旧機能（リセット、削除）
 *
 * ### 5. パフォーマンス最適化
 * - React.Profilerによる性能監視
 * - React.memoによる不要な再レンダリング防止
 * - 遅延評価とキャッシュ戦略
 *
 * ## 使用方法
 *
 * ```typescript
 * // パネルコンポーネントの定義
 * interface MyPanelConfig extends PanelConfig {
 *   title: string;
 *   showDetails: boolean;
 * }
 *
 * function MyPanelComponent({ config, saveConfig }: PanelProps<MyPanelConfig>) {
 *   return (
 *     <div>
 *       <h1>{config.title}</h1>
 *       <button onClick={() => saveConfig({ ...config, showDetails: !config.showDetails })}>
 *         Toggle Details
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // 必須の静的プロパティ
 * MyPanelComponent.panelType = "MyPanel";
 * MyPanelComponent.defaultConfig = {
 *   title: "Default Title",
 *   showDetails: false,
 * };
 *
 * // Panel HOCでラップしてエクスポート
 * export default Panel(MyPanelComponent);
 * ```
 *
 * ## アーキテクチャ設計
 *
 * このHOCは以下の層構造で動作する：
 *
 * ```
 * Panel HOC
 * ├── React.Profiler (性能監視)
 * ├── PanelContext.Provider (コンテキスト提供)
 * ├── KeyListener (キーボードイベント)
 * ├── Transition (フルスクリーン遷移)
 * └── PanelRoot
 *     ├── PanelOverlay (操作UI)
 *     └── PanelErrorBoundary
 *         └── 実際のパネルコンポーネント
 * ```
 *
 * ## 技術的特徴
 *
 * - **型安全性**: TypeScriptの高度な型システムを活用
 * - **関数型プログラミング**: useCallback、useMemoによる最適化
 * - **宣言的UI**: React Hooksベースの状態管理
 * - **コンポーネント合成**: HOCパターンによる機能拡張
 * - **テスト可能性**: 依存性注入と単体テスト対応
 *
 * @author Lichtblick Team
 * @since 2023
 */

import {
  Delete20Regular,
  TabDesktop20Regular,
  TabDesktopMultiple20Regular,
  SplitVertical20Regular,
  SplitHorizontal20Regular,
} from "@fluentui/react-icons";
import * as _ from "lodash-es";
import {
  ComponentType,
  MouseEventHandler,
  Profiler,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getNodeAtPath,
  getOtherBranch,
  MosaicContext,
  MosaicNode,
  MosaicWindowActions,
  MosaicWindowContext,
} from "react-mosaic-component";
import { Transition } from "react-transition-group";
import { useMountedState } from "react-use";
import { makeStyles } from "tss-react/mui";

import { useShallowMemo } from "@lichtblick/hooks";
import { useConfigById } from "@lichtblick/suite-base/PanelAPI";
import KeyListener from "@lichtblick/suite-base/components/KeyListener";
import { MosaicPathContext } from "@lichtblick/suite-base/components/MosaicPathContext";
import PanelContext from "@lichtblick/suite-base/components/PanelContext";
import PanelErrorBoundary from "@lichtblick/suite-base/components/PanelErrorBoundary";
import { PanelOverlay, PanelOverlayProps } from "@lichtblick/suite-base/components/PanelOverlay";
import { PanelRoot } from "@lichtblick/suite-base/components/PanelRoot";
import { getPanelTypeFromMosaic } from "@lichtblick/suite-base/components/PanelToolbar/utils";
import {
  useCurrentLayoutActions,
  useSelectedPanels,
} from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { usePanelCatalog } from "@lichtblick/suite-base/context/PanelCatalogContext";
import {
  useWorkspaceStore,
  WorkspaceStoreSelectors,
} from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
import usePanelDrag from "@lichtblick/suite-base/hooks/usePanelDrag";
import { useMessagePathDrop } from "@lichtblick/suite-base/services/messagePathDragging";
import { OpenSiblingPanel, PanelConfig, SaveConfig } from "@lichtblick/suite-base/types/panels";
import { TAB_PANEL_TYPE } from "@lichtblick/suite-base/util/globalConstants";
import { getPanelTypeFromId } from "@lichtblick/suite-base/util/layout";

/**
 * Panel HOC用のスタイル定義
 *
 * パフォーマンス情報表示とタブカウント表示のスタイルを定義
 */
const useStyles = makeStyles()((theme) => ({
  /**
   * パフォーマンス情報表示用のスタイル
   * 開発環境でのみ表示され、レンダリング回数と時間を表示
   */
  perfInfo: {
    position: "absolute",
    bottom: 2,
    left: 3,
    whiteSpace: "pre-line",
    fontSize: "0.75em",
    fontFeatureSettings: `${theme.typography.fontFeatureSettings}, 'zero'`,
    opacity: 0.7,
    userSelect: "none",
    mixBlendMode: "difference",
  },
  /**
   * タブ内のパネル数表示用のスタイル
   * マルチ選択時のタブ作成アクションで使用
   */
  tabCount: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    display: "flex",
    inset: 0,
    textAlign: "center",
    letterSpacing: "-0.125em",
    // アイコン内にテキストを配置するための調整値
    paddingTop: 1,
    paddingLeft: 5,
    paddingRight: 11,
    fontSize: `${theme.typography.subtitle2.fontSize} !important`,
    fontWeight: 600,
  },
}));

/**
 * Panel HOCに渡されるプロパティの型定義
 *
 * @template Config - パネル固有の設定型
 */
type Props<Config> = {
  /** パネルの一意識別子（省略時はフォールバック値を使用） */
  childId?: string;
  /** 設定の上書き（テスト・Storybook用） */
  overrideConfig?: Config;
  /** 所属するタブのID（タブ内パネルの場合） */
  tabId?: string;
};

/**
 * パネルコンポーネントが実装すべき静的プロパティ
 *
 * Panel HOCでラップされる全てのコンポーネントは、この
 * インターフェースを実装する必要がある。
 *
 * @template Config - パネル固有の設定型
 */
export interface PanelStatics<Config> {
  /** パネルタイプの一意識別子 */
  panelType: string;
  /** パネルのデフォルト設定 */
  defaultConfig: Config;
}

/**
 * Storybook等でパネルが<PanelLayout/>の外部でレンダリングされる場合の
 * フォールバック用パネルID
 */
const FALLBACK_PANEL_ID = "$unknown_id";

/**
 * Panel HOC - 全パネルコンポーネントをラップする高階コンポーネント
 *
 * このHOCは、パネルコンポーネントに以下の機能を自動的に提供する：
 * - 設定管理（config/saveConfig）
 * - レイアウト統合（分割、移動、削除）
 * - エラーハンドリング
 * - ドラッグ&ドロップ
 * - キーボードショートカット
 * - フルスクリーン表示
 * - パフォーマンス監視
 *
 * ## 使用方法
 *
 * ```typescript
 * // パネルコンポーネントの定義
 * function MyPanel({ config, saveConfig }: PanelProps<MyPanelConfig>) {
 *   return <div>{config.title}</div>;
 * }
 *
 * // 必須の静的プロパティ
 * MyPanel.panelType = "MyPanel";
 * MyPanel.defaultConfig = { title: "Default" };
 *
 * // Panel HOCでラップ
 * export default Panel(MyPanel);
 * ```
 *
 * ## 型パラメータ
 *
 * @template Config - パネル固有の設定型（PanelConfigを継承）
 * @template PanelProps - パネルコンポーネントのProps型
 *
 * @param PanelComponent - ラップするパネルコンポーネント
 * @returns ラップされたパネルコンポーネント（静的プロパティ付き）
 *
 * ## 技術的詳細
 *
 * - **HOCパターン**: 横断的関心事の分離
 * - **型安全性**: TypeScriptの高度な型システム活用
 * - **パフォーマンス**: React.memoによる最適化
 * - **テスト可能性**: 依存性注入とモック対応
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default function Panel<
  Config extends PanelConfig,
  PanelProps extends { config: Config; saveConfig: SaveConfig<Config> },
>(
  PanelComponent: ComponentType<PanelProps> & PanelStatics<Config>,
): ComponentType<Props<Config> & Omit<PanelProps, "config" | "saveConfig">> & PanelStatics<Config> {
  /**
   * 実際のパネルコンポーネントをラップする内部コンポーネント
   *
   * このコンポーネントは、Panel HOCの中核となる機能を実装している：
   * - 設定の読み込み・保存・マージ
   * - レイアウト操作（分割、移動、削除）
   * - インタラクション処理（ドラッグ、キーボード）
   * - 状態管理（選択、フルスクリーン）
   * - エラーハンドリング
   *
   * @param props - Panel HOCに渡されたプロパティ
   */
  function ConnectedPanel(props: Props<Config>) {
    const { childId = FALLBACK_PANEL_ID, overrideConfig, tabId, ...otherProps } = props;
    const { classes, cx, theme } = useStyles();
    const isMounted = useMountedState();

    // === React Mosaic統合 ===
    // レイアウトシステムとの統合のためのコンテキスト取得
    const { mosaicActions } = useContext(MosaicContext);
    const { mosaicWindowActions }: { mosaicWindowActions: MosaicWindowActions } =
      useContext(MosaicWindowContext);

    // === パネル選択状態管理 ===
    // マルチ選択機能のための状態管理
    const {
      selectedPanelIds,
      setSelectedPanelIds,
      selectAllPanels,
      togglePanelSelected,
      getSelectedPanelIds,
    } = useSelectedPanels();

    /** 現在のパネルが選択されているかどうか */
    const isSelected = useMemo(
      () => selectedPanelIds.includes(childId),
      [childId, selectedPanelIds],
    );

    /** 選択されている場合の選択パネル数（バッチ操作用） */
    const numSelectedPanelsIfSelected = useMemo(
      () => (isSelected ? selectedPanelIds.length : 0),
      [isSelected, selectedPanelIds],
    );

    // === レイアウト操作アクション ===
    // パネルの操作（保存、更新、作成、削除、分割、交換）のためのアクション
    const {
      savePanelConfigs,
      updatePanelConfigs,
      createTabPanel,
      closePanel,
      splitPanel,
      swapPanel,
      getCurrentLayoutState,
    } = useCurrentLayoutActions();

    // === ローカル状態管理 ===
    /** クイックアクションキー（`キー）が押されているかどうか */
    const [quickActionsKeyPressed, setQuickActionsKeyPressed] = useState(false);
    /** パネルがフルスクリーン表示されているかどうか */
    const [fullscreen, setFullscreen] = useState(false);
    /** フルスクリーン化前の元の位置・サイズ情報 */
    const [fullscreenSourceRect, setFullscreenSourceRect] = useState<DOMRect | undefined>(
      undefined,
    );
    /** 子パネルがフルスクリーン表示されているかどうか（タブ用） */
    const [hasFullscreenDescendant, _setHasFullscreenDescendant] = useState(false);

    // === 参照管理 ===
    /** パネルルート要素への参照 */
    const panelRootRef = useRef<HTMLDivElement>(ReactNull);
    /** パネルカタログへの参照 */
    const panelCatalog = usePanelCatalog();

    // === パネル位置・階層情報 ===
    /** Mosaicレイアウト内でのパネルの位置パス */
    const mosaicPath = useContext(MosaicPathContext);
    /** トップレベルパネル（ルート直下）かどうか */
    const isTopLevelPanel =
      mosaicPath != undefined && mosaicPath.length === 0 && tabId == undefined;

    /** 親パネルのコンテキスト（タブ内パネルの場合） */
    const parentPanelContext = useContext(PanelContext);

    // === パネル基本情報 ===
    /** パネルタイプ */
    const type = PanelComponent.panelType;
    /** パネルタイトル（カタログから取得） */
    const title = useMemo(
      () => panelCatalog.getPanelByType(type)?.title ?? "",
      [panelCatalog, type],
    );

    // === 設定管理 ===
    /** パネルのデフォルト設定 */
    const defaultConfig = PanelComponent.defaultConfig;
    /** 保存済み設定の読み込みと保存関数 */
    const [savedConfig, saveConfig] = useConfigById<Config>(childId);

    /**
     * パネルを初期状態にリセットする関数
     * エラー復旧時に使用される
     */
    const resetPanel = useCallback(() => {
      saveConfig(defaultConfig);
    }, [defaultConfig, saveConfig]);

    // === 設定の初期化処理 ===
    /**
     * デフォルト設定の自動保存処理
     *
     * 以下の場合にデフォルト設定を自動保存する：
     * 1. 保存済み設定が存在しない場合
     * 2. 保存済み設定が空オブジェクトの場合
     * 3. デフォルト設定に新しいキーが追加された場合
     *
     * これにより、PanelSettingsが完全な設定を受け取ることができる
     */
    const savedDefaultConfig = useRef(false);
    useLayoutEffect(() => {
      if (savedDefaultConfig.current) {
        return;
      }

      if (!savedConfig || Object.keys(savedConfig).length === 0) {
        // 保存済み設定がない場合：デフォルト設定を保存
        savedDefaultConfig.current = true;
        saveConfig(defaultConfig);
      } else if (
        Object.entries(defaultConfig).some(
          ([key, value]) => value != undefined && !(key in savedConfig),
        )
      ) {
        // デフォルト設定に新しいキーが追加された場合：マージして保存
        savedDefaultConfig.current = true;
        saveConfig({ ...defaultConfig, ...savedConfig });
      }
    }, [defaultConfig, saveConfig, savedConfig]);

    /**
     * 最終的なパネル設定
     * デフォルト設定 + 保存済み設定 + 上書き設定の順でマージ
     */
    const panelComponentConfig = useMemo(
      () => ({ ...defaultConfig, ...savedConfig, ...overrideConfig }),
      [savedConfig, defaultConfig, overrideConfig],
    );

    /**
     * 隣接パネルを開く関数
     *
     * 現在のパネルの隣に新しいパネルを開く。既に同じタイプのパネルが
     * 隣接している場合は、そのパネルを更新することも可能。
     *
     * @param options - パネル開設オプション
     * @param options.panelType - 開くパネルのタイプ
     * @param options.siblingConfigCreator - 隣接パネルの設定作成関数
     * @param options.updateIfExists - 既存パネルを更新するかどうか
     */
    const openSiblingPanel = useCallback<OpenSiblingPanel>(
      async ({ panelType, siblingConfigCreator, updateIfExists }) => {
        const panelsState = getCurrentLayoutState().selectedLayout?.data;
        if (!panelsState) {
          return;
        }

        let siblingDefaultConfig: PanelConfig = {};

        // 隣接パネルタイプのデフォルト設定を取得
        const siblingPanelInfo = panelCatalog.getPanelByType(panelType);
        if (siblingPanelInfo) {
          const siblingModule = await siblingPanelInfo.module();
          if (!isMounted()) {
            return;
          }

          siblingDefaultConfig = siblingModule.default.defaultConfig;
        }

        const ownPath = mosaicWindowActions.getPath();

        // 既存の隣接パネルを更新する場合
        if (updateIfExists) {
          const lastNode = _.last(ownPath);
          const siblingPathEnd = lastNode != undefined ? getOtherBranch(lastNode) : "second";
          const siblingPath = ownPath.slice(0, -1).concat(siblingPathEnd);
          const siblingId = getNodeAtPath(mosaicActions.getRoot(), siblingPath);
          if (typeof siblingId === "string" && getPanelTypeFromId(siblingId) === panelType) {
            const siblingConfig: PanelConfig = {
              ...siblingDefaultConfig,
              ...panelsState.configById[siblingId],
            };
            savePanelConfigs({
              configs: [
                {
                  id: siblingId,
                  config: siblingConfigCreator(siblingConfig),
                  defaultConfig: siblingDefaultConfig,
                },
              ],
            });
            return;
          }
        }

        // 新しいパネルを開く場合
        const newPanelPath = ownPath.concat("second");
        const newPanelConfig = siblingConfigCreator(siblingDefaultConfig);
        void mosaicWindowActions
          .split({ type: panelType, panelConfig: newPanelConfig })
          .then(() => {
            const newPanelId = getNodeAtPath(mosaicActions.getRoot(), newPanelPath) as string;
            savePanelConfigs({
              configs: [
                {
                  id: newPanelId,
                  config: newPanelConfig,
                  defaultConfig: siblingDefaultConfig,
                },
              ],
            });
          });
      },
      [
        getCurrentLayoutState,
        isMounted,
        mosaicActions,
        mosaicWindowActions,
        panelCatalog,
        savePanelConfigs,
      ],
    );

    /**
     * パネルを別のタイプに置き換える関数
     *
     * @param newPanelType - 新しいパネルタイプ
     * @param config - 新しいパネルの設定
     */
    const replacePanel = useCallback(
      (newPanelType: string, config: Record<string, unknown>) => {
        swapPanel({
          tabId,
          originalId: childId,
          type: newPanelType,
          root: mosaicActions.getRoot() as MosaicNode<string>,
          path: mosaicWindowActions.getPath(),
          config,
        });
      },
      [childId, mosaicActions, mosaicWindowActions, swapPanel, tabId],
    );

    // === ワークスペース状態 ===
    /** パネル設定画面が開いているかどうか */
    const panelSettingsOpen = useWorkspaceStore(WorkspaceStoreSelectors.selectPanelSettingsOpen);

    /**
     * パネルルートクリックハンドラー
     *
     * パネル設定画面が開いている場合やマルチ選択モードの場合の
     * パネル選択処理を行う
     */
    const onPanelRootClick: MouseEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        if (panelSettingsOpen) {
          // パネル設定画面が開いている場合：単一選択
          e.stopPropagation(); // 親タブパネルの選択を防ぐ
          setSelectedPanelIds([childId]);
        } else if (e.metaKey || e.shiftKey || isSelected) {
          // マルチ選択モード：選択状態をトグル
          e.stopPropagation(); // 親タブパネルの選択を防ぐ
          togglePanelSelected(childId, tabId);
        }
      },
      [childId, tabId, togglePanelSelected, isSelected, setSelectedPanelIds, panelSettingsOpen],
    );

    /**
     * 選択されたパネルをタブにグループ化する関数
     * 選択されたパネルを1つのタブパネルにまとめる
     */
    const groupPanels = useCallback(() => {
      const layout = getCurrentLayoutState().selectedLayout?.data?.layout;
      if (layout == undefined) {
        return;
      }
      createTabPanel({
        idToReplace: childId,
        layout,
        idsToRemove: getSelectedPanelIds(),
        singleTab: true,
      });
    }, [getCurrentLayoutState, getSelectedPanelIds, createTabPanel, childId]);

    /**
     * 選択されたパネルを個別のタブとして作成する関数
     * 各選択パネルが独立したタブになる
     */
    const createTabs = useCallback(() => {
      const layout = getCurrentLayoutState().selectedLayout?.data?.layout;
      if (layout == undefined) {
        return;
      }
      createTabPanel({
        idToReplace: childId,
        layout,
        idsToRemove: getSelectedPanelIds(),
        singleTab: false,
      });
    }, [getCurrentLayoutState, getSelectedPanelIds, createTabPanel, childId]);

    /**
     * パネルを削除する関数
     * Mosaicレイアウトからパネルを除去する
     */
    const removePanel = useCallback(() => {
      closePanel({
        path: mosaicWindowActions.getPath(),
        root: mosaicActions.getRoot() as MosaicNode<string>,
        tabId,
      });
    }, [closePanel, mosaicActions, mosaicWindowActions, tabId]);

    /**
     * 現在のパネルタイプを取得する関数
     * Mosaicコンテキストから動的にパネルタイプを取得
     */
    const getPanelType = useCallback(
      () => getPanelTypeFromMosaic(mosaicWindowActions, mosaicActions),
      [mosaicActions, mosaicWindowActions],
    );

    /**
     * パネルを分割する関数
     *
     * @param id - 分割するパネルのID
     * @param direction - 分割方向（"row": 横分割, "column": 縦分割）
     */
    const split = useCallback(
      (id: string | undefined, direction: "row" | "column") => {
        const panelType = getPanelType();
        if (id == undefined || panelType == undefined) {
          throw new Error("Trying to split unknown panel!");
        }

        const config = getCurrentLayoutState().selectedLayout?.data?.configById[id] ?? {};
        splitPanel({
          id,
          tabId,
          direction,
          root: mosaicActions.getRoot() as MosaicNode<string>,
          path: mosaicWindowActions.getPath(),
          config,
        });
      },
      [getCurrentLayoutState, getPanelType, mosaicActions, mosaicWindowActions, splitPanel, tabId],
    );

    // === フルスクリーン機能 ===
    /**
     * フルスクリーン関連の関数群
     * パネルの全画面表示とその解除を管理
     */
    const { enterFullscreen, exitFullscreen } = useMemo(
      () => ({
        /**
         * フルスクリーン表示に入る
         * 元の位置・サイズ情報を保存し、親タブのz-indexを調整
         */
        enterFullscreen: () => {
          setFullscreenSourceRect(panelRootRef.current?.getBoundingClientRect());
          setFullscreen(true);

          // タブ内パネルがフルスクリーン化する場合、
          // 親タブのz-indexを調整して正しくオーバーレイ表示する
          parentPanelContext?.setHasFullscreenDescendant(true);
        },
        /**
         * フルスクリーン表示から抜ける
         * 遷移アニメーション用に状態は遷移完了時にクリア
         */
        exitFullscreen: () => {
          // fullscreenSourceRectとhasFullscreenDescendantは遷移アニメーション中に
          // 必要なため、ここではクリアしない
          setFullscreen(false);
        },
      }),
      [parentPanelContext],
    );

    /**
     * 子パネルのフルスクリーン状態を設定する関数
     * タブパネル内の子パネルがフルスクリーン化した場合に使用
     */
    const setHasFullscreenDescendant = useCallback(
      // eslint-disable-next-line @lichtblick/no-boolean-parameters
      (value: boolean) => {
        _setHasFullscreenDescendant(value);
        parentPanelContext?.setHasFullscreenDescendant(value);
      },
      [parentPanelContext],
    );

    // === ドラッグ&ドロップ機能 ===
    /**
     * メッセージパスのドラッグ&ドロップ機能
     * トピックやメッセージパスをパネルにドロップする機能
     */
    const {
      isDragging,
      isOver,
      isValidTarget,
      connectMessagePathDropTarget,
      dropMessage,
      setMessagePathDropConfig,
    } = useMessagePathDrop();

    // === キーボードショートカット ===
    /**
     * キーボードイベントハンドラー群
     * パネル操作のためのキーボードショートカットを定義
     */
    const { keyUpHandlers, keyDownHandlers } = useMemo(
      () => ({
        /** キーリリース時のハンドラー */
        keyUpHandlers: {
          Backquote: () => {
            setQuickActionsKeyPressed(false);
          },
          "~": () => {
            setQuickActionsKeyPressed(false);
          },
        },
        /** キー押下時のハンドラー */
        keyDownHandlers: {
          /** Cmd+A: 全パネル選択 */
          a: (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.metaKey) {
              selectAllPanels();
            }
          },
          /** バッククォート: クイックアクション表示 */
          Backquote: () => {
            setQuickActionsKeyPressed(true);
          },
          /** チルダ: クイックアクション表示 */
          "~": () => {
            setQuickActionsKeyPressed(true);
          },
          /** Escape: 選択解除 */
          Escape: () => {
            if (numSelectedPanelsIfSelected > 1) {
              setSelectedPanelIds([]);
            }
          },
        },
      }),
      [selectAllPanels, numSelectedPanelsIfSelected, setSelectedPanelIds],
    );

    /**
     * フルスクリーン時専用のキーボードハンドラー
     */
    const fullScreenKeyHandlers = useMemo(
      () => ({
        /** Escape: フルスクリーン解除 */
        Escape: () => {
          exitFullscreen();
        },
      }),
      [exitFullscreen],
    );

    // === プロパティ最適化 ===
    /** その他のプロパティの浅い比較メモ化 */
    const otherPanelProps = useShallowMemo(otherProps);

    /**
     * 子パネルコンポーネントに渡すプロパティ
     * config、saveConfig、その他のプロパティをマージ
     */
    const childProps = useMemo(
      // TypeScriptの制約により"as PanelProps"でキャストが必要
      // PanelPropsの制約により、より具体的な型が要求される可能性があるため
      () => ({ config: panelComponentConfig, saveConfig, ...otherPanelProps }) as PanelProps,
      [otherPanelProps, panelComponentConfig, saveConfig],
    );

    /** 実際の子パネルコンポーネント */
    const child = useMemo(() => <PanelComponent {...childProps} />, [childProps]);

    // === パフォーマンス監視 ===
    /** レンダリング回数のカウンター */
    const renderCount = useRef(0);

    /** パフォーマンス情報表示要素への参照 */
    const perfInfo = useRef<HTMLDivElement>(ReactNull);

    /** クイックアクションオーバーレイ要素への参照 */
    const quickActionsOverlayRef = useRef<HTMLDivElement>(ReactNull);

    /**
     * ドラッグ開始時のハンドラー
     * ドラッグプレビュー画像からオーバーレイを一時的に隠す
     */
    const onDragStart = useCallback(() => {
      // Chromeのバグ対策：ドラッグプレビュー画像にオーバーレイが
      // 含まれないよう、一時的に透明にする
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1203107
      const overlay = quickActionsOverlayRef.current;
      if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => (overlay.style.opacity = "1"), 0);
      }
    }, []);

    // === ドラッグ機能設定 ===
    /** ドラッグ仕様の定義 */
    const dragSpec = { tabId, panelId: childId, onDragStart };
    /** オーバーレイ用のドラッグ機能 */
    const [connectOverlayDragSource, connectOverlayDragPreview] = usePanelDrag(dragSpec);
    /** ツールバー用のドラッグ機能 */
    const [connectToolbarDragHandle, connectToolbarDragPreview] = usePanelDrag(dragSpec);

    /**
     * パネルオーバーレイのプロパティ
     * 状態に応じてオーバーレイの表示・動作を制御
     */
    const panelOverlayProps = useMemo(() => {
      const overlayProps: PanelOverlayProps = {
        open:
          isDragging || quickActionsKeyPressed || (isSelected && numSelectedPanelsIfSelected > 1),
        variant: undefined,
        highlightMode: undefined,
        actions: undefined,
        dropMessage,
      };

      // ドラッグ中の無効なドロップターゲット
      if (isDragging && !isValidTarget) {
        overlayProps.variant = "invalidDropTarget";
      }
      // ドラッグ中の有効なドロップターゲット
      if (isDragging && isOver) {
        overlayProps.variant = "validDropTarget";
      }
      // 複数選択時の表示
      if (isSelected && numSelectedPanelsIfSelected > 1) {
        overlayProps.onClickAway = () => {
          setSelectedPanelIds([]);
        };
        overlayProps.variant = "selected";
        overlayProps.highlightMode = "all";
        overlayProps.actions = [
          {
            key: "group",
            text: "Group in tab",
            icon: <TabDesktop20Regular />,
            onClick: groupPanels,
          },
          {
            key: "create-tabs",
            text: "Create tabs",
            icon: (
              <>
                <span className={classes.tabCount}>
                  {numSelectedPanelsIfSelected <= 99 ? numSelectedPanelsIfSelected : ""}{" "}
                </span>
                <TabDesktopMultiple20Regular />
              </>
            ),
            onClick: createTabs,
          },
        ];
      }
      // クイックアクション表示時（非タブパネル）
      if (type !== TAB_PANEL_TYPE && quickActionsKeyPressed) {
        overlayProps.variant = "selected";
        overlayProps.highlightMode = "active";
      }
      // クイックアクション時のアクション定義
      if (quickActionsKeyPressed) {
        overlayProps.actions = [
          {
            key: "splitDown",
            text: "Split down",
            icon: <SplitHorizontal20Regular />,
            onClick: () => {
              split(childId, "column");
            },
          },
          {
            key: "splitRight",
            text: "Split right",
            icon: <SplitVertical20Regular />,
            onClick: () => {
              split(childId, "row");
            },
          },
          {
            key: "remove",
            text: "Remove",
            icon: <Delete20Regular />,
            color: "error",
            onClick: removePanel,
          },
        ];
      }
      return overlayProps;
    }, [
      childId,
      classes.tabCount,
      createTabs,
      dropMessage,
      groupPanels,
      isDragging,
      isOver,
      isSelected,
      isValidTarget,
      numSelectedPanelsIfSelected,
      quickActionsKeyPressed,
      removePanel,
      setSelectedPanelIds,
      split,
      type,
    ]);

    // === レンダリング ===
    return (
      <Profiler
        id={childId}
        onRender={(_id, _phase, actualDuration, _baseDuration, _startTime, _commitTime) => {
          if (perfInfo.current) {
            perfInfo.current.innerText = `${++renderCount.current}\n${actualDuration.toFixed(1)}ms`;
          }
        }}
      >
        <PanelContext.Provider
          value={{
            type,
            id: childId,
            title,
            config: panelComponentConfig,
            saveConfig: saveConfig as SaveConfig<PanelConfig>,
            updatePanelConfigs,
            openSiblingPanel,
            replacePanel,
            enterFullscreen,
            exitFullscreen,
            setHasFullscreenDescendant,
            isFullscreen: fullscreen,
            tabId,
            // ルートパネルはドラッグ禁止
            connectToolbarDragHandle: isTopLevelPanel ? undefined : connectToolbarDragHandle,
            setMessagePathDropConfig,
          }}
        >
          <KeyListener global keyUpHandlers={keyUpHandlers} keyDownHandlers={keyDownHandlers} />
          {fullscreen && <KeyListener global keyDownHandlers={fullScreenKeyHandlers} />}
          <Transition
            in={fullscreen}
            onExited={() => {
              setHasFullscreenDescendant(false);
            }}
            nodeRef={panelRootRef}
            timeout={{
              // PanelRoot内の遷移時間と一致させる
              exit: theme.transitions.duration.shorter,
            }}
          >
            {(fullscreenState) => (
              <PanelRoot
                onClick={onPanelRootClick}
                hasFullscreenDescendant={hasFullscreenDescendant}
                fullscreenState={fullscreenState}
                sourceRect={fullscreenSourceRect}
                selected={isSelected || (isDragging && isValidTarget && isOver)}
                data-testid={cx("panel-mouseenter-container", childId)}
                ref={(el) => {
                  panelRootRef.current = el;
                  // ルートパネルはドラッグ禁止
                  if (!isTopLevelPanel) {
                    connectOverlayDragPreview(el);
                    connectToolbarDragPreview(el);
                  }
                  connectMessagePathDropTarget(el);
                }}
              >
                {!fullscreen && type !== TAB_PANEL_TYPE && (
                  <PanelOverlay
                    {...panelOverlayProps}
                    ref={(el) => {
                      quickActionsOverlayRef.current = el;
                      // ルートパネルはドラッグ禁止
                      if (!isTopLevelPanel) {
                        connectOverlayDragSource(el);
                      }
                    }}
                  />
                )}
                <PanelErrorBoundary onRemovePanel={removePanel} onResetPanel={resetPanel}>
                  {child}
                </PanelErrorBoundary>
                {process.env.NODE_ENV !== "production" && (
                  <div className={classes.perfInfo} ref={perfInfo} />
                )}
              </PanelRoot>
            )}
          </Transition>
        </PanelContext.Provider>
      </Profiler>
    );
  }

  // === HOC完成 ===
  /**
   * React.memoでラップしたコンポーネントに静的プロパティを追加
   * 元のパネルコンポーネントの静的プロパティを継承
   */
  return Object.assign(React.memo(ConnectedPanel), {
    defaultConfig: PanelComponent.defaultConfig,
    panelType: PanelComponent.panelType,
    displayName: `Panel(${PanelComponent.displayName ?? PanelComponent.name})`,
  });
}

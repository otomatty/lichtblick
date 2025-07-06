// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useCallback, useLayoutEffect, useReducer, useRef, useState } from "react";
import { getLeaves } from "react-mosaic-component";
import { selectWithUnstableIdentityWarning, useGuaranteedContext, useShallowMemo, } from "@lichtblick/hooks";
import Logger from "@lichtblick/log";
import useShouldNotChangeOften from "@lichtblick/suite-base/hooks/useShouldNotChangeOften";
import toggleSelectedPanel from "@lichtblick/suite-base/providers/CurrentLayoutProvider/toggleSelectedPanel";
const log = Logger.getLogger(__filename);
/**
 * CurrentLayoutContext - 現在のレイアウト管理コンテキスト
 *
 * レイアウト状態の管理と操作を提供するReactコンテキスト。
 * アプリケーション全体でレイアウト情報を共有するために使用される。
 */
const CurrentLayoutContext = createContext(undefined);
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
export function usePanelMosaicId() {
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
export function useCurrentLayoutActions() {
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
export function useCurrentLayoutSelector(selector) {
    const currentLayout = useGuaranteedContext(CurrentLayoutContext);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    // 不安定な関数セレクターを使用している場所をキャッチ
    useShouldNotChangeOften(selector, () => {
        log.warn("useCurrentLayoutSelector is changing frequently. Rewrite your selector as a stable function.");
    });
    const state = useRef(undefined);
    if (!state.current || selector !== state.current.selector) {
        state.current = {
            value: selectWithUnstableIdentityWarning(currentLayout.actions.getCurrentLayoutState(), selector),
            selector,
        };
    }
    useLayoutEffect(() => {
        let mounted = true;
        const listener = (layoutState) => {
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
export function useSelectedPanels() {
    const currentLayout = useGuaranteedContext(CurrentLayoutContext);
    const [selectedPanelIds, setSelectedPanelIdsState] = useState(() => currentLayout.getSelectedPanelIds());
    useLayoutEffect(() => {
        const listener = (newIds) => {
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
    const togglePanelSelected = useCallback((panelId, containingTabId) => {
        setSelectedPanelIds((selectedIds) => {
            const { selectedLayout } = getCurrentLayout();
            if (!selectedLayout?.data) {
                return selectedIds;
            }
            return toggleSelectedPanel(panelId, containingTabId, selectedLayout.data.configById, selectedIds);
        });
    }, [setSelectedPanelIds, getCurrentLayout]);
    return useShallowMemo({
        getSelectedPanelIds,
        selectedPanelIds,
        setSelectedPanelIds,
        selectAllPanels,
        togglePanelSelected,
    });
}
export default CurrentLayoutContext;

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import SearchIcon from "@mui/icons-material/Search";
import { List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLatest } from "react-use";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { useDebounce } from "use-debounce";
import { filterMap } from "@lichtblick/den/collection";
import { useDataSourceInfo } from "@lichtblick/suite-base/PanelAPI";
import { DirectTopicStatsUpdater } from "@lichtblick/suite-base/components/DirectTopicStatsUpdater";
import EmptyState from "@lichtblick/suite-base/components/EmptyState";
import { useMessagePipeline, } from "@lichtblick/suite-base/components/MessagePipeline";
import SearchBar from "@lichtblick/suite-base/components/SearchBar/SearchBar";
import { ContextMenu } from "@lichtblick/suite-base/components/TopicList/ContextMenu";
import { getDraggedMessagePath } from "@lichtblick/suite-base/components/TopicList/getDraggedMessagePath";
import { PlayerPresence } from "@lichtblick/suite-base/players/types";
import { MessagePathSelectionProvider } from "@lichtblick/suite-base/services/messagePathDragging/MessagePathSelectionProvider";
import { MessagePathRow } from "./MessagePathRow";
import { useStyles } from "./TopicList.style";
import { TopicRow } from "./TopicRow";
import { useMultiSelection } from "./useMultiSelection";
import { useTopicListSearch } from "./useTopicListSearch";
/**
 * セレクター関数：MessagePipelineからプレイヤーの接続状態を取得
 * @param context - MessagePipelineのコンテキスト
 * @returns プレイヤーの接続状態
 */
const selectPlayerPresence = ({ playerState }) => playerState.presence;
/**
 * TopicList - ROSトピックとメッセージパスの階層表示コンポーネント
 *
 * @description
 * このコンポーネントは、データソースから取得したROSトピックとその内部のメッセージパス（スキーマ）を
 * 階層的に表示する仮想化リストコンポーネントです。以下の主要機能を提供します：
 *
 * **主要機能:**
 * - 📋 トピック一覧の表示（名前、型、統計情報）
 * - 🔍 リアルタイム検索・フィルタリング（50msデバウンス）
 * - 📊 メッセージパスの階層表示（スキーマ構造）
 * - 🎯 複数選択（Ctrl/Cmd + クリック、Shift + クリック）
 * - 🖱️ コンテキストメニュー（右クリックメニュー）
 * - 🚀 仮想化による高パフォーマンス描画
 * - 📱 ドラッグ&ドロップ対応
 *
 * **表示状態:**
 * - NOT_PRESENT: データソース未選択
 * - ERROR: エラー発生
 * - INITIALIZING: 初期化中（スケルトン表示）
 * - PRESENT: 通常表示
 * - RECONNECTING: 再接続中
 *
 * **パフォーマンス最適化:**
 * - react-window による仮想化リスト
 * - 可変行高対応（トピック: 50px, メッセージパス: 28px）
 * - デバウンス検索（50ms）
 * - メモ化による不要な再描画防止
 *
 * **依存関係:**
 * - useTopicListSearch: 検索・フィルタリングロジック
 * - useMultiSelection: 複数選択状態管理
 * - TopicRow: トピック行コンポーネント
 * - MessagePathRow: メッセージパス行コンポーネント
 * - ContextMenu: 右クリックメニュー
 * - DirectTopicStatsUpdater: トピック統計更新（6秒間隔）
 *
 * @returns 仮想化されたトピック一覧UI
 */
export function TopicList() {
    const { t } = useTranslation("topicList");
    const { classes } = useStyles();
    // 検索フィルターの状態管理（デバウンス付き）
    const [undebouncedFilterText, setFilterText] = useState("");
    const [debouncedFilterText] = useDebounce(undebouncedFilterText, 50);
    const onClear = () => {
        setFilterText("");
    };
    // プレイヤー接続状態とデータソース情報の取得
    const playerPresence = useMessagePipeline(selectPlayerPresence);
    const { topics, datatypes } = useDataSourceInfo();
    // 仮想化リストの参照（行高キャッシュリセット用）
    const listRef = useRef(ReactNull);
    // 検索・フィルタリングされたツリーアイテムの取得
    const treeItems = useTopicListSearch({
        topics,
        datatypes,
        filterText: debouncedFilterText,
    });
    // 複数選択機能の状態管理
    const { selectedIndexes, onSelect, getSelectedIndexes } = useMultiSelection(treeItems);
    // コンテキストメニューの状態管理
    const [contextMenuState, setContextMenuState] = useState(undefined);
    // 最新のツリーアイテム参照（コールバック内で使用）
    const latestTreeItems = useLatest(treeItems);
    /**
     * 選択されたアイテムをドラッグ可能なメッセージパスに変換
     * @returns ドラッグ可能なメッセージパスの配列
     */
    const getSelectedItemsAsDraggedMessagePaths = useCallback(() => {
        return filterMap(Array.from(getSelectedIndexes()).sort(), (index) => {
            const item = latestTreeItems.current[index];
            return item ? getDraggedMessagePath(item) : undefined;
        });
    }, [getSelectedIndexes, latestTreeItems]);
    /**
     * コンテキストメニューの表示処理
     * @param event - マウスイベント
     * @param index - クリックされたアイテムのインデックス
     */
    const handleContextMenu = useCallback((event, index) => {
        event.preventDefault();
        const latestSelectedIndexes = getSelectedIndexes();
        // クリックされたアイテムが選択されていない場合は、そのアイテムのみを選択
        if (!latestSelectedIndexes.has(index)) {
            onSelect({ index, modKey: false, shiftKey: false });
        }
        setContextMenuState({
            position: { left: event.clientX, top: event.clientY },
            items: getSelectedItemsAsDraggedMessagePaths(),
        });
    }, [getSelectedIndexes, getSelectedItemsAsDraggedMessagePaths, onSelect]);
    /**
     * コンテキストメニューの閉じる処理
     */
    const handleContextMenuClose = useCallback(() => {
        setContextMenuState(undefined);
    }, []);
    // フィルター結果変更時の行高キャッシュリセット
    useEffect(() => {
        // Discard cached row heights when the filter results change
        listRef.current?.resetAfterIndex(0);
    }, [treeItems]);
    // 仮想化リストに渡すデータ（メモ化）
    const itemData = useMemo(() => ({ treeItems, selectedIndexes }), [selectedIndexes, treeItems]);
    /**
     * 仮想化リストの行レンダリング関数
     * @param props - react-windowから渡されるプロパティ
     * @returns 行コンポーネント（TopicRow または MessagePathRow）
     */
    const renderRow = useCallback(
    // `data` comes from the `itemData` we pass to the VariableSizeList below
    ({ index, style, data }) => {
        const treeItem = data.treeItems[index];
        const selected = data.selectedIndexes.has(index);
        const onClick = (event) => {
            event.preventDefault();
            onSelect({
                index,
                modKey: event.metaKey || event.ctrlKey,
                shiftKey: event.shiftKey,
            });
        };
        // アイテムタイプに応じて適切な行コンポーネントを返す
        switch (treeItem.type) {
            case "topic":
                return (_jsx(TopicRow, { style: style, topicResult: treeItem.item, selected: selected, onClick: onClick, onContextMenu: (event) => {
                        handleContextMenu(event, index);
                    } }));
            case "schema":
                return (_jsx(MessagePathRow, { style: style, messagePathResult: treeItem.item, selected: selected, onClick: onClick, onContextMenu: (event) => {
                        handleContextMenu(event, index);
                    } }));
        }
    }, [handleContextMenu, onSelect]);
    // プレイヤー接続状態に応じた早期リターン処理
    if (playerPresence === PlayerPresence.NOT_PRESENT) {
        return _jsx(EmptyState, { children: t("noDataSourceSelected") });
    }
    if (playerPresence === PlayerPresence.ERROR) {
        return _jsx(EmptyState, { children: t("anErrorOccurred") });
    }
    // 初期化中の場合はスケルトン表示
    if (playerPresence === PlayerPresence.INITIALIZING) {
        return (_jsxs(_Fragment, { children: [_jsx("header", { className: classes.filterBar, children: _jsx(SearchBar, { disabled: true, variant: "filled", fullWidth: true, placeholder: t("waitingForData"), InputProps: {
                            size: "small",
                            startAdornment: _jsx(SearchIcon, { fontSize: "small" }),
                        } }) }), _jsx(List, { dense: true, disablePadding: true, children: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (_jsx(ListItem, { divider: true, children: _jsx(ListItemText, { className: classes.skeletonText, primary: _jsx(Skeleton, { animation: false, width: "20%" }), secondary: _jsx(Skeleton, { animation: "wave", width: "55%" }), secondaryTypographyProps: { variant: "caption" } }) }, i))) })] }));
    }
    // メイン表示：検索バー + 仮想化リスト + コンテキストメニュー
    return (_jsxs(MessagePathSelectionProvider, { getSelectedItems: getSelectedItemsAsDraggedMessagePaths, children: [_jsxs("div", { className: classes.root, children: [_jsx(SearchBar, { id: "topic-filter", placeholder: t("searchBarPlaceholder"), disabled: playerPresence !== PlayerPresence.PRESENT, onChange: (event) => {
                            setFilterText(event.target.value);
                        }, value: undebouncedFilterText, showClearIcon: !!debouncedFilterText, onClear: onClear }), treeItems.length > 0 ? (_jsx("div", { style: { flex: "1 1 100%" }, children: _jsx(AutoSizer, { children: ({ width, height }) => (_jsx(VariableSizeList, { ref: listRef, width: width, height: height, itemCount: treeItems.length, itemSize: (index) => (treeItems[index]?.type === "topic" ? 50 : 28), itemData: itemData, overscanCount: 10, children: renderRow })) }) })) : (_jsxs(EmptyState, { children: [playerPresence === PlayerPresence.PRESENT && undebouncedFilterText
                                ? `${t("noTopicsOrDatatypesMatching")} \n "${undebouncedFilterText}"`
                                : t("noTopicsAvailable"), playerPresence === PlayerPresence.RECONNECTING && t("waitingForConnection")] })), _jsx(DirectTopicStatsUpdater, { interval: 6 })] }), contextMenuState && (_jsx(ContextMenu, { onClose: handleContextMenuClose, anchorPosition: contextMenuState.position, messagePaths: contextMenuState.items }))] }));
}

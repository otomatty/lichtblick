import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { ReOrderDotsVertical16Regular } from "@fluentui/react-icons";
import { Badge, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { HighlightChars } from "@lichtblick/suite-base/components/HighlightChars";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useMessagePathDrag } from "@lichtblick/suite-base/services/messagePathDragging";
import { useTopicListStyles } from "./useTopicListStyles";
/**
 * MessagePathRow - メッセージパス表示行コンポーネント
 *
 * @description
 * このコンポーネントは、TopicListの仮想化リスト内でメッセージパス（スキーマフィールド）を
 * 表示する行コンポーネントです。ROSメッセージの内部構造（フィールド）を階層的に表示します。
 *
 * **主要機能:**
 * - 📋 メッセージパスの表示（検索ハイライト付き）
 * - 🏷️ データ型の表示（string, float64, etc.）
 * - 🖱️ ドラッグ&ドロップ対応
 * - 🎯 選択状態の視覚的表示
 * - 📱 複数選択時のバッジ表示
 * - 🌿 リーフノード（末端フィールド）の識別
 *
 * **表示例:**
 * ```
 * position.x          float64
 * position.y          float64
 * orientation.z       float64
 * header.stamp        builtin_interfaces/Time
 * ```
 *
 * **ドラッグ機能:**
 * - useMessagePathDrag フックによるドラッグ対応
 * - パネルへのドロップでチャート追加
 * - 複数選択時のアイテム数表示
 * - リーフノードのみチャート化可能
 *
 * **表示要素:**
 * - パスサフィックス（フィールド名、ハイライト付き）
 * - データ型（セカンダリテキスト）
 * - ドラッグハンドル（⋮アイコン）
 * - 複数選択バッジ
 *
 * **依存関係:**
 * - HighlightChars: 検索文字列のハイライト表示
 * - useMessagePathDrag: ドラッグ&ドロップ機能
 * - useTopicListStyles: スタイリング
 * - MessagePathSearchItem: 検索アイテム型定義
 *
 * @param props - コンポーネントのプロパティ
 * @param props.messagePathResult - FZF検索結果（メッセージパス情報 + ハイライト位置）
 * @param props.style - react-windowから渡されるスタイル
 * @param props.selected - 選択状態
 * @param props.onClick - クリックイベントハンドラー
 * @param props.onContextMenu - コンテキストメニューイベントハンドラー
 * @returns メッセージパス行のJSX要素
 */
export function MessagePathRow({ messagePathResult, style, selected, onClick, onContextMenu, }) {
    const { cx, classes } = useTopicListStyles();
    // メッセージパス情報の展開
    const { fullPath, suffix: { pathSuffix, type, isLeaf }, topic, } = messagePathResult.item;
    // ドラッグ可能なメッセージパスアイテムの作成
    const item = useMemo(() => ({
        path: fullPath,
        rootSchemaName: topic.schemaName,
        isTopic: false,
        isLeaf,
        topicName: topic.name,
    }), [fullPath, isLeaf, topic.name, topic.schemaName]);
    // ドラッグ&ドロップ機能の初期化
    const { connectDragSource, connectDragPreview, cursor, isDragging, draggedItemCount } = useMessagePathDrag({
        item,
        selected,
    });
    // ドラッグソースとプレビューの両方を同じ要素に接続
    const combinedRef = useCallback((el) => {
        connectDragSource(el);
        connectDragPreview(el);
    }, [connectDragPreview, connectDragSource]);
    return (_jsxs("div", { ref: combinedRef, className: cx(classes.row, classes.fieldRow, {
            [classes.isDragging]: isDragging,
            [classes.selected]: selected,
        }), style: { ...style, cursor }, onClick: onClick, onContextMenu: onContextMenu, children: [draggedItemCount > 1 && (_jsx(Badge, { color: "primary", className: classes.countBadge, badgeContent: draggedItemCount })), _jsxs(Stack, { flex: "auto", direction: "row", gap: 2, overflow: "hidden", children: [_jsx(Typography, { variant: "body2", noWrap: true, children: _jsx(HighlightChars, { str: pathSuffix, indices: messagePathResult.positions, offset: messagePathResult.item.offset }) }), _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, children: type })] }), _jsx("div", { "data-testid": "TopicListDragHandle", style: { cursor }, className: classes.dragHandle, children: _jsx(ReOrderDotsVertical16Regular, {}) })] }));
}

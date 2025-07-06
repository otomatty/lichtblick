import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview SettingsTreeEditor用のノードアクションメニューコンポーネント
 *
 * 設定ツリーのノードに対するアクション（削除、複製、移動等）を
 * ドロップダウンメニュー形式で提供するコンポーネントです。
 *
 * 主な機能：
 * - 複数のアクション項目を縦並びメニューで表示
 * - アイコン付きメニュー項目のサポート
 * - 区切り線（divider）による項目グループ化
 * - アクセシビリティ対応（ARIA属性、キーボード操作）
 * - 動的なインデント調整（アイコンの有無に応じて）
 *
 * 使用例：
 * ```tsx
 * <NodeActionsMenu
 *   actions={[
 *     { type: "action", id: "delete", label: "削除", icon: "delete" },
 *     { type: "divider" },
 *     { type: "action", id: "duplicate", label: "複製", icon: "copy" }
 *   ]}
 *   onSelectAction={(actionId) => handleAction(actionId)}
 * />
 * ```
 */
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { nanoid } from "nanoid";
import { useCallback, useMemo, useState } from "react";
import { icons } from "./icons";
/**
 * ノードアクションメニューコンポーネント
 *
 * 設定ツリーのノードに対する各種アクションを提供するドロップダウンメニューです。
 * "More actions"ボタンをクリックすると、利用可能なアクションのリストが表示されます。
 *
 * @param actions - 表示するアクション項目の配列
 * @param onSelectAction - アクション選択時のコールバック関数
 * @returns ノードアクションメニューコンポーネント
 */
export function NodeActionsMenu({ actions, onSelectAction, }) {
    /** メニューのアンカー要素（メニューボタン） */
    const [anchorEl, setAnchorEl] = useState(undefined);
    /** メニューの開閉状態 */
    const open = Boolean(anchorEl);
    /**
     * メニューボタンクリック時のハンドラー
     *
     * @param event - マウスクリックイベント
     */
    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);
    /**
     * メニュー項目選択時のハンドラー
     *
     * 選択されたアクションを実行し、メニューを閉じます。
     *
     * @param id - 選択されたアクションのID
     */
    const handleClose = useCallback((id) => {
        onSelectAction(id);
        setAnchorEl(undefined);
    }, [onSelectAction]);
    /**
     * アクション項目の中にアイコンを持つものがあるかどうかを判定
     *
     * インデント調整のために使用されます。
     * アイコンがあるアクションが一つでもある場合、アイコンのないアクションにもインデントが適用されます。
     */
    const anyItemHasIcon = useMemo(() => actions.some((action) => action.type === "action" && action.icon != undefined), [actions]);
    /**
     * 区切り線（divider）にユニークIDを付与したアクション配列
     *
     * 区切り線はIDを持たないため、Reactのkey propとして使用するために
     * nanoidでユニークIDを生成します。
     */
    const actionsWithUniqueIds = useMemo(() => {
        return actions.map((action) => ({
            ...action,
            uniqueId: action.type === "divider" ? nanoid() : undefined,
        }));
    }, [actions]);
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { title: "More actions", "aria-controls": open ? "node-actions-menu" : undefined, "aria-haspopup": "true", "aria-expanded": open ? "true" : undefined, onClick: handleClick, "data-testid": "node-actions-menu-button", size: "small", children: _jsx(MoreVertIcon, { fontSize: "small" }) }), _jsx(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: () => {
                    setAnchorEl(undefined);
                }, MenuListProps: {
                    "aria-label": "node actions button",
                    dense: true, // コンパクトな表示
                }, children: actionsWithUniqueIds.map((action) => {
                    // 区切り線の場合
                    if (action.type === "divider") {
                        return (_jsx(Divider, { "data-testid": "node-actions-menu-divider", variant: anyItemHasIcon ? "inset" : "fullWidth" }, `${action.uniqueId}`));
                    }
                    // アクション項目の場合
                    const Icon = action.icon ? icons[action.icon] : undefined;
                    return (_jsxs(MenuItem, { "data-testid": `node-actions-menu-item-${action.id}`, onClick: () => {
                            handleClose(action.id);
                        }, children: [Icon && (_jsx(ListItemIcon, { "data-testid": `node-actions-menu-item-icon-${action.id}`, children: _jsx(Icon, { fontSize: "small" }) })), _jsx(ListItemText, { inset: !Icon && anyItemHasIcon, disableTypography: true, children: action.label })] }, action.id));
                }) })] }));
}

import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Menu, MenuItem } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard } from "react-use";
/**
 * ContextMenu - TopicList用右クリックコンテキストメニュー
 *
 * @description
 * このコンポーネントは、TopicListで右クリックした際に表示されるコンテキストメニューです。
 * 選択されたトピックやメッセージパスに応じて、適切なコピー機能を提供します。
 *
 * **主要機能:**
 * - 📋 トピック名のクリップボードコピー
 * - 📋 メッセージパスのクリップボードコピー
 * - 📋 スキーマ名のクリップボードコピー
 * - 🔢 複数選択時の一括コピー
 * - 🌐 多言語対応（i18n）
 *
 * **メニュー項目の動的生成:**
 * 選択されたアイテムの種類と数に応じて、メニュー項目が動的に決定されます：
 *
 * **単一トピック選択時:**
 * - "Copy Topic Name" - トピック名をコピー
 * - "Copy Schema Name" - スキーマ名をコピー
 *
 * **複数トピック選択時:**
 * - "Copy Topic Names" - 複数のトピック名を改行区切りでコピー
 *
 * **単一メッセージパス選択時:**
 * - "Copy Message Path" - メッセージパスをコピー
 *
 * **複数メッセージパス選択時:**
 * - "Copy Message Paths" - 複数のメッセージパスを改行区切りでコピー
 *
 * **混合選択時:**
 * - トピックとメッセージパスが混在している場合、メッセージパス扱いとなる
 *
 * **使用例:**
 * ```typescript
 * <ContextMenu
 *   messagePaths={[
 *     { path: "/odom", isTopic: true, rootSchemaName: "nav_msgs/Odometry" },
 *     { path: "/odom.pose.position.x", isTopic: false, isLeaf: true }
 *   ]}
 *   anchorPosition={{ left: 100, top: 200 }}
 *   onClose={() => setContextMenuOpen(false)}
 * />
 * ```
 *
 * **依存関係:**
 * - useCopyToClipboard: クリップボードコピー機能
 * - useTranslation: 多言語対応
 * - Material-UI Menu: メニューUI
 *
 * @param props - コンポーネントのプロパティ
 * @param props.messagePaths - 選択されたメッセージパスの配列
 * @param props.anchorPosition - メニュー表示位置（マウス座標）
 * @param props.onClose - メニューを閉じる際のコールバック
 * @returns コンテキストメニューのJSX要素
 */
export function ContextMenu(props) {
    const { messagePaths, anchorPosition, onClose } = props;
    const [, copyToClipboard] = useCopyToClipboard();
    const { t } = useTranslation("topicList");
    // 選択されたアイテムに応じたメニュー項目の動的生成
    const menuItems = useMemo(() => {
        const hasNonTopicItems = messagePaths.some((item) => !item.isTopic);
        const items = [
            {
                // メニューラベルの動的決定
                children: hasNonTopicItems
                    ? messagePaths.length === 1
                        ? t("copyMessagePath")
                        : t("copyMessagePaths")
                    : messagePaths.length === 1
                        ? t("copyTopicName")
                        : t("copyTopicNames"),
                // パスまたはトピック名のコピー処理
                onClick: () => {
                    onClose();
                    copyToClipboard(messagePaths.map((item) => item.path).join("\n"));
                },
            },
        ];
        // 単一トピック選択時のみスキーマ名コピーを追加
        if (messagePaths.length === 1 && messagePaths[0]?.isTopic === true) {
            items.push({
                children: t("copySchemaName"),
                onClick: () => {
                    const schemaName = messagePaths[0]?.rootSchemaName;
                    if (schemaName != undefined) {
                        onClose();
                        copyToClipboard(schemaName);
                    }
                },
            });
        }
        return items;
    }, [t, onClose, copyToClipboard, messagePaths]);
    return (_jsx(Menu, { open: true, onClose: onClose, anchorReference: "anchorPosition", anchorPosition: anchorPosition, MenuListProps: {
            dense: true,
        }, children: menuItems.map((item, index) => (_jsx(MenuItem, { ...item }, index))) }));
}

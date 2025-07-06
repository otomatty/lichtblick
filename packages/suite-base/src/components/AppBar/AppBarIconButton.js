import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * AppBarIconButton - アプリケーションバー用アイコンボタンコンポーネント
 *
 * AppBar内で使用される統一されたアイコンボタンを提供します。
 * Material-UIのIconButtonをベースとし、以下の機能を追加：
 * - 統一されたスタイリング（ホバー、選択状態、無効状態）
 * - ツールチップ機能の統合
 * - AppBarテーマとの連動
 * - 無効化ボタンでのツールチップ問題の解決
 *
 * @example
 * ```typescript
 * <AppBarIconButton title="設定を開く" onClick={handleSettingsClick}>
 *   <SettingsIcon />
 * </AppBarIconButton>
 * ```
 */
import { IconButton, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import tinycolor from "tinycolor2";
import { makeStyles } from "tss-react/mui";
/**
 * AppBarIconButtonスタイル定義
 *
 * AppBarテーマに最適化されたアイコンボタンのスタイル：
 * - ホバー効果: 半透明の白色オーバーレイ
 * - 選択状態: プライマリカラーの背景
 * - 無効状態: 透明度による視覚的フィードバック
 */
const useStyles = makeStyles()((theme) => ({
    /** ツールチップの位置調整 */
    tooltip: {
        marginTop: `${theme.spacing(0.5)} !important`,
    },
    /** アイコンボタンのメインスタイル */
    iconButton: {
        /** 角丸を無効化してシャープな外観 */
        borderRadius: 0,
        /** アイコンサイズの統一 */
        fontSize: 24,
        /** 内部パディングの調整 */
        padding: theme.spacing(1.25),
        /**
         * SVGアイコンのサイズ調整
         * Material-UIのSvgIconコンポーネント以外のSVGに適用
         */
        "svg:not(.MuiSvgIcon-root)": {
            fontSize: "1em",
        },
        /** ホバー状態のスタイル */
        "&:hover": {
            backgroundColor: tinycolor(theme.palette.common.white).setAlpha(0.08).toRgbString(),
        },
        /** 選択状態のスタイル */
        "&.Mui-selected": {
            backgroundColor: theme.palette.appBar.primary,
        },
        /** 無効状態のスタイル */
        "&.Mui-disabled": {
            color: "currentColor",
            opacity: theme.palette.action.disabledOpacity,
        },
    },
}));
/**
 * AppBarIconButton - アプリケーションバー用アイコンボタン
 *
 * AppBar内で統一されたアイコンボタンを提供するコンポーネント。
 * ツールチップ機能を内蔵し、無効化されたボタンでも適切に動作します。
 *
 * 主な特徴：
 * - 統一されたAppBarテーマのスタイリング
 * - ツールチップの自動統合（遅延表示対応）
 * - 無効化ボタンでのツールチップ問題の解決（divラッパー使用）
 * - forwardRefによるref転送サポート
 *
 * @param props - コンポーネントのプロパティ
 * @param ref - ボタン要素への参照
 * @returns AppBarアイコンボタンのJSX要素
 */
export const AppBarIconButton = forwardRef((props, ref) => {
    const { title, className, children, color = "inherit", ...rest } = props;
    const { classes, cx } = useStyles();
    return (_jsx(Tooltip, { disableInteractive: true, classes: { tooltip: classes.tooltip }, title: title, arrow: false, enterDelay: 200, children: _jsx("div", { children: _jsx(IconButton, { color: color, ref: ref, className: cx(classes.iconButton, className), ...rest, children: children }) }) }));
});
AppBarIconButton.displayName = "AppBarIconButton";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview AppSettingsDialog - アプリケーション設定ダイアログメインコンポーネント
 *
 * 【概要】
 * Lichtblickアプリケーションの設定を管理するメインダイアログコンポーネント。
 * タブベースのインターフェースで、一般設定、拡張機能、実験的機能、
 * アプリケーション情報の管理を提供します。
 *
 * 【主な機能】
 * - タブベースの設定UI（一般、拡張機能、実験的機能、About）
 * - レスポンシブデザイン（モバイル/デスクトップ対応）
 * - 国際化対応（i18n）
 * - ワークスペース状態との連携
 * - プラットフォーム固有機能の条件分岐
 *
 * 【設定カテゴリ】
 * - **General**: テーマ、言語、タイムゾーン、メッセージレートなど
 * - **Extensions**: 拡張機能の管理とマーケットプレイス
 * - **Experimental Features**: 実験的機能の有効/無効切り替え
 * - **About**: アプリケーション情報とリンク
 *
 * 【アーキテクチャ】
 * - Material-UIのDialogコンポーネントベース
 * - Zustandによるワークスペース状態管理
 * - 設定値の永続化（useAppConfigurationValue）
 * - 条件付きレンダリング（プラットフォーム固有機能）
 */
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogTitle, FormControlLabel, FormLabel, IconButton, Link, Tab, Tabs, Typography, useMediaQuery, } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { useStyles } from "@lichtblick/suite-base/components/AppSettingsDialog/AppSettingsDialog.style";
import { APP_SETTINGS_ABOUT_ITEMS } from "@lichtblick/suite-base/components/AppSettingsDialog/constants";
import CopyButton from "@lichtblick/suite-base/components/CopyButton";
import { ExperimentalFeatureSettings } from "@lichtblick/suite-base/components/ExperimentalFeatureSettings";
import ExtensionsSettings from "@lichtblick/suite-base/components/ExtensionsSettings";
import LichtblickLogoText from "@lichtblick/suite-base/components/LichtblickLogoText";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppContext } from "@lichtblick/suite-base/context/AppContext";
import { useWorkspaceStore, } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks/useAppConfigurationValue";
import isDesktopApp from "@lichtblick/suite-base/util/isDesktopApp";
import { AutoUpdate, ColorSchemeSettings, LanguageSettings, LaunchDefault, MessageFramerate, RosPackagePath, TimeFormat, TimezoneSettings, } from "./settings";
/**
 * ワークスペースストアからの初期アクティブタブ選択
 *
 * ワークスペースの状態から、設定ダイアログで最初に表示すべきタブを取得します。
 * これにより、特定のタブを指定して設定ダイアログを開くことが可能になります。
 *
 * @param store - ワークスペースストア
 * @returns 初期表示タブ | undefined
 */
const selectWorkspaceInitialActiveTab = (store) => store.dialogs.preferences.initialTab;
/**
 * AppSettingsDialog - アプリケーション設定ダイアログ
 *
 * アプリケーション全体の設定を管理するメインダイアログコンポーネント。
 * タブベースのインターフェースで、カテゴリ別に設定項目を整理して表示します。
 *
 * 【主な特徴】
 * - **レスポンシブデザイン**: モバイル/デスクトップに対応
 * - **国際化対応**: react-i18nextによる多言語サポート
 * - **プラットフォーム対応**: Web/Desktop固有機能の条件分岐
 * - **状態管理**: Zustandによるワークスペース状態連携
 * - **設定永続化**: 設定値の自動保存と復元
 *
 * 【タブ構成】
 * - **General**: 基本設定（テーマ、言語、タイムゾーンなど）
 * - **Extensions**: 拡張機能の管理
 * - **Experimental Features**: 実験的機能の制御
 * - **About**: アプリケーション情報とリンク
 *
 * 【使用例】
 * ```typescript
 * // 基本的な使用
 * <AppSettingsDialog
 *   open={isSettingsOpen}
 *   onClose={handleSettingsClose}
 * />
 *
 * // 特定のタブを指定して開く
 * <AppSettingsDialog
 *   open={true}
 *   activeTab="extensions"
 *   onClose={handleClose}
 * />
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @returns AppSettingsDialogのJSX要素
 */
export function AppSettingsDialog(props) {
    // 国際化フック
    const { t } = useTranslation("appSettings");
    // プロパティからのactiveTab取得
    const { activeTab: _activeTab } = props;
    // ワークスペースストアから初期タブを取得
    const initialActiveTab = useWorkspaceStore(selectWorkspaceInitialActiveTab);
    // アクティブタブの状態管理
    // 優先順位: props.activeTab > workspace.initialTab > "general"
    const [activeTab, setActiveTab] = useState(_activeTab ?? initialActiveTab ?? "general");
    // デバッグモード設定の状態管理
    const [debugModeEnabled = false, setDebugModeEnabled] = useAppConfigurationValue(AppSetting.SHOW_DEBUG_PANELS);
    // スタイルフックとテーマ取得
    const { classes, cx, theme } = useStyles();
    // レスポンシブデザイン判定（sm以上でデスクトップレイアウト）
    const smUp = useMediaQuery(theme.breakpoints.up("sm"));
    // アプリケーションコンテキスト（拡張機能設定コンポーネント）
    const { extensionSettings } = useAppContext();
    // プラットフォーム判定（自動更新はデスクトップ版のみ）
    const supportsAppUpdates = isDesktopApp();
    /**
     * タブ変更ハンドラー
     *
     * ユーザーがタブをクリックした際の処理。
     * 新しいタブに切り替えて、対応するコンテンツを表示します。
     *
     * @param _event - SyntheticEvent（未使用）
     * @param newValue - 新しいタブ値
     */
    const handleTabChange = (_event, newValue) => {
        setActiveTab(newValue);
    };
    /**
     * ダイアログクローズハンドラー
     *
     * ダイアログの閉じる処理。
     * 親コンポーネントのonCloseプロパティが存在する場合に呼び出します。
     *
     * @param event - マウスイベント
     */
    const handleClose = (event) => {
        if (props.onClose != undefined) {
            props.onClose(event, "backdropClick");
        }
    };
    // 拡張機能設定コンポーネント（カスタムまたはデフォルト）
    const extensionSettingsComponent = extensionSettings ?? _jsx(ExtensionsSettings, {});
    return (_jsxs(Dialog, { ...props, fullWidth: true, maxWidth: "md", "data-testid": `AppSettingsDialog--${activeTab}`, children: [_jsxs(DialogTitle, { className: classes.dialogTitle, children: [t("settings"), _jsx(IconButton, { edge: "end", onClick: handleClose, children: _jsx(CloseIcon, {}) })] }), _jsxs("div", { className: classes.layoutGrid, children: [_jsxs(Tabs, { classes: { indicator: classes.indicator }, value: activeTab, orientation: smUp ? "vertical" : "horizontal", onChange: handleTabChange, children: [_jsx(Tab, { className: classes.tab, label: t("general"), value: "general" }), _jsx(Tab, { className: classes.tab, label: t("extensions"), value: "extensions" }), _jsx(Tab, { className: classes.tab, label: t("experimentalFeatures"), value: "experimental-features" }), _jsx(Tab, { className: classes.tab, label: t("about"), value: "about" })] }), _jsxs(Stack, { direction: "row", fullHeight: true, overflowY: "auto", children: [_jsx("section", { className: cx(classes.tabPanel, {
                                    [classes.tabPanelActive]: activeTab === "general",
                                }), children: _jsxs(Stack, { gap: 2, children: [_jsx(ColorSchemeSettings, {}), _jsx(TimezoneSettings, {}), _jsx(TimeFormat, { orientation: smUp ? "horizontal" : "vertical" }), _jsx(MessageFramerate, {}), _jsx(LanguageSettings, {}), supportsAppUpdates && _jsx(AutoUpdate, {}), !isDesktopApp() && _jsx(LaunchDefault, {}), isDesktopApp() && _jsx(RosPackagePath, {}), _jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("advanced"), ":"] }), _jsx(FormControlLabel, { className: classes.formControlLabel, control: _jsx(Checkbox, { className: classes.checkbox, checked: debugModeEnabled, onChange: (_, checked) => {
                                                            void setDebugModeEnabled(checked);
                                                        } }), label: t("debugModeDescription") })] })] }) }), _jsx("section", { className: cx(classes.tabPanel, {
                                    [classes.tabPanelActive]: activeTab === "extensions",
                                }), children: _jsx(Stack, { gap: 2, children: extensionSettingsComponent }) }), _jsx("section", { className: cx(classes.tabPanel, {
                                    [classes.tabPanelActive]: activeTab === "experimental-features",
                                }), children: _jsxs(Stack, { gap: 2, children: [_jsx(Alert, { color: "warning", icon: _jsx(WarningAmberIcon, {}), children: t("experimentalFeaturesDescription") }), _jsx(Stack, { paddingLeft: 2, children: _jsx(ExperimentalFeatureSettings, {}) })] }) }), _jsx("section", { className: cx(classes.tabPanel, {
                                    [classes.tabPanelActive]: activeTab === "about",
                                }), children: _jsxs(Stack, { gap: 2, alignItems: "flex-start", children: [_jsx("header", { children: _jsx(LichtblickLogoText, { color: "primary", className: classes.logo }) }), _jsxs(Stack, { direction: "row", alignItems: "center", gap: 1, children: [_jsxs(Typography, { variant: "body2", children: ["Lichtblick version ", LICHTBLICK_SUITE_VERSION] }), _jsx(CopyButton, { size: "small", getText: () => LICHTBLICK_SUITE_VERSION?.toString() ?? "" })] }), Array.from(APP_SETTINGS_ABOUT_ITEMS.values()).map((item) => {
                                            return (_jsxs(Stack, { gap: 1, children: [item.subheader && _jsx(Typography, { children: item.subheader }), item.links.map((link) => (_jsx(Link, { variant: "body2", underline: "hover", "data-testid": link.title, href: link.url, target: "_blank", children: link.title }, link.title)))] }, item.subheader));
                                        })] }) })] })] }), _jsx(DialogActions, { className: classes.dialogActions, children: _jsx(Button, { onClick: handleClose, children: "Done" }) })] }));
}

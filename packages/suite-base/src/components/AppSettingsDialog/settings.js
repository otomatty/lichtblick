import { createElement as _createElement } from "react";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview AppSettingsDialog - 個別設定コンポーネント群
 *
 * 【概要】
 * AppSettingsDialogで使用される各種設定項目のコンポーネントを提供します。
 * 一般設定タブで表示される具体的な設定UIを実装しており、
 * それぞれが独立したコンポーネントとして設計されています。
 *
 * 【提供するコンポーネント】
 * - `ColorSchemeSettings` - カラースキーム設定（ダーク/ライト/システム）
 * - `TimezoneSettings` - タイムゾーン設定（オートコンプリート）
 * - `TimeFormat` - 時刻表示形式設定（秒/時刻）
 * - `LaunchDefault` - 起動設定（Web/Desktop/確認）
 * - `MessageFramerate` - メッセージレート設定（Hz）
 * - `AutoUpdate` - 自動更新設定（デスクトップ版のみ）
 * - `RosPackagePath` - ROSパッケージパス設定（デスクトップ版のみ）
 * - `LanguageSettings` - 言語設定
 *
 * 【共通特徴】
 * - Material-UIコンポーネントベース
 * - useAppConfigurationValueによる設定値管理
 * - 国際化対応（react-i18next）
 * - レスポンシブデザイン対応
 * - 型安全な設定値の取り扱い
 */
import Brightness5Icon from "@mui/icons-material/Brightness5";
import ComputerIcon from "@mui/icons-material/Computer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import WebIcon from "@mui/icons-material/Web";
import { Autocomplete, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, } from "@mui/material";
import moment from "moment-timezone";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import { filterMap } from "@lichtblick/den/collection";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import OsContextSingleton from "@lichtblick/suite-base/OsContextSingleton";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppTimeFormat } from "@lichtblick/suite-base/hooks";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks/useAppConfigurationValue";
import { reportError } from "@lichtblick/suite-base/reportError";
import { LaunchPreferenceValue } from "@lichtblick/suite-base/types/LaunchPreferenceValue";
import { formatTime } from "@lichtblick/suite-base/util/formatTime";
import { formatTimeRaw } from "@lichtblick/suite-base/util/time";
/**
 * メッセージレート選択肢
 *
 * メッセージ更新頻度として選択可能なHz値の配列。
 * 低頻度（1Hz）から高頻度（60Hz）まで段階的に提供。
 */
const MESSAGE_RATES = [1, 3, 5, 10, 15, 20, 30, 60];
/**
 * 言語選択肢
 *
 * アプリケーションで利用可能な言語オプション。
 * 現在は英語のみサポート、将来的に多言語対応予定。
 */
const LANGUAGE_OPTIONS = [{ key: "en", value: "English" }];
/**
 * 設定コンポーネント共通スタイル
 *
 * 各設定コンポーネントで使用される共通のスタイル定義。
 * Material-UIコンポーネントのカスタマイズとレイアウト調整を提供。
 */
const useStyles = makeStyles()((theme) => ({
    /** オートコンプリートの入力フィールドスタイル */
    autocompleteInput: {
        "&.MuiOutlinedInput-input": {
            padding: 0, // デフォルトパディングを削除
        },
    },
    /** チェックボックスのスタイル調整 */
    checkbox: {
        "&.MuiCheckbox-root": {
            paddingTop: 0, // 上部パディングを削除して整列改善
        },
    },
    /** フォームコントロールラベルの配置調整 */
    formControlLabel: {
        "&.MuiFormControlLabel-root": {
            alignItems: "start", // 上揃えで長いテキストに対応
        },
    },
    /** トグルボタンのレイアウト */
    toggleButton: {
        display: "flex !important",
        flexDirection: "column", // 縦方向配置
        gap: theme.spacing(0.75),
        lineHeight: "1 !important",
    },
}));
/**
 * タイムゾーン表示フォーマット関数
 *
 * タイムゾーン名を人間が読みやすい形式にフォーマットします。
 * タイムゾーン名、省略形、UTCオフセットを組み合わせて表示。
 *
 * @param name - タイムゾーン名（IANA形式）
 * @returns フォーマットされたタイムゾーン表示文字列
 *
 * @example
 * ```typescript
 * formatTimezone("America/New_York")
 * // => "America/New_York (EST, -05:00)"
 *
 * formatTimezone("UTC")
 * // => "UTC (+00:00)"
 * ```
 */
function formatTimezone(name) {
    const tz = moment.tz(name);
    const zoneAbbr = tz.zoneAbbr();
    const offset = tz.utcOffset();
    const offsetStr = (offset >= 0 ? "+" : "") + moment.duration(offset, "minutes").format("hh:mm", { trim: false });
    if (name === zoneAbbr) {
        return `${zoneAbbr} (${offsetStr})`;
    }
    return `${name} (${zoneAbbr}, ${offsetStr})`;
}
/**
 * ColorSchemeSettings - カラースキーム設定コンポーネント
 *
 * アプリケーションのカラーテーマを選択する設定UI。
 * ダーク、ライト、システム設定の3つのオプションを提供します。
 *
 * 【機能】
 * - ダークモード/ライトモードの切り替え
 * - システム設定（OS設定）に従う自動切り替え
 * - アイコン付きのトグルボタンUI
 * - 設定値の永続化
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションにアイコンとラベル
 * - レスポンシブ対応のレイアウト
 *
 * @returns ColorSchemeSettingsのJSX要素
 */
export function ColorSchemeSettings() {
    const { classes } = useStyles();
    const [colorScheme = "system", setColorScheme] = useAppConfigurationValue(AppSetting.COLOR_SCHEME);
    const { t } = useTranslation("appSettings");
    /**
     * カラースキーム変更ハンドラー
     *
     * ユーザーがカラースキームを変更した際の処理。
     * 選択された値を設定ストレージに保存します。
     *
     * @param _event - マウスイベント（未使用）
     * @param value - 選択されたカラースキーム値
     */
    const handleChange = useCallback((_event, value) => {
        if (value != undefined) {
            void setColorScheme(value);
        }
    }, [setColorScheme]);
    return (_jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("colorScheme"), ":"] }), _jsxs(ToggleButtonGroup, { color: "primary", size: "small", fullWidth: true, exclusive: true, value: colorScheme, onChange: handleChange, children: [_jsxs(ToggleButton, { className: classes.toggleButton, value: "dark", children: [_jsx(DarkModeIcon, {}), " ", t("dark")] }), _jsxs(ToggleButton, { className: classes.toggleButton, value: "light", children: [_jsx(Brightness5Icon, {}), " ", t("light")] }), _jsxs(ToggleButton, { className: classes.toggleButton, value: "system", children: [_jsx(ComputerIcon, {}), " ", t("followSystem")] })] })] }));
}
/**
 * TimezoneSettings - タイムゾーン設定コンポーネント
 *
 * タイムスタンプ表示で使用するタイムゾーンを設定するUI。
 * システム自動検出またはマニュアル選択に対応しています。
 *
 * 【機能】
 * - システムタイムゾーンの自動検出
 * - 全世界のタイムゾーンからの選択
 * - オートコンプリート機能付きの検索
 * - タイムゾーン情報の人間が読みやすい表示
 *
 * 【UI構成】
 * - Autocompleteコンポーネントによる検索可能なドロップダウン
 * - 「システムから検出」オプション
 * - UTCオプション（常に上部に表示）
 * - 区切り線による視覚的なグループ分け
 *
 * @returns TimezoneSettingsのJSX要素
 */
export function TimezoneSettings() {
    const { classes } = useStyles();
    const { t } = useTranslation("appSettings");
    const [timezone, setTimezone] = useAppConfigurationValue(AppSetting.TIMEZONE);
    // システム検出オプション（動的に現在のシステムタイムゾーンを表示）
    const detectItem = useMemo(() => ({
        key: "detect",
        label: `Detect from system: ${formatTimezone(moment.tz.guess())}`,
        data: undefined,
    }), []);
    // 固定表示項目（検出、UTC、区切り線）
    const fixedItems = useMemo(() => [
        detectItem,
        { key: "zone:UTC", label: formatTimezone("UTC"), data: "UTC" },
        {
            key: "sep",
            label: "",
            divider: true,
        },
    ], [detectItem]);
    // 全タイムゾーン項目（UTCを除く）
    const timezoneItems = useMemo(() => filterMap(moment.tz.names(), (name) => {
        // UTCは固定項目で既に表示されているため除外
        if (name === "UTC") {
            return undefined;
        }
        return { key: `zone:${name}`, label: formatTimezone(name), data: name };
    }), []);
    // 全オプション（固定項目 + タイムゾーン項目）
    const allItems = useMemo(() => [...fixedItems, ...timezoneItems], [fixedItems, timezoneItems]);
    // 現在選択されている項目の決定
    const selectedItem = useMemo(() => {
        if (timezone != undefined) {
            return allItems.find((item) => item.data === timezone) ?? detectItem;
        }
        return detectItem;
    }, [allItems, detectItem, timezone]);
    return (_jsxs(FormControl, { fullWidth: true, children: [_jsxs(FormLabel, { children: [t("displayTimestampsIn"), ":"] }), _jsx(Autocomplete, { options: [...fixedItems, ...timezoneItems], value: selectedItem, renderOption: (props, option) => option.divider === true ? (_jsx(Divider, {}, option.key)) : (_createElement("li", { ...props, key: option.key }, option.label)), renderInput: (params) => (_jsx(TextField, { ...params, inputProps: { ...params.inputProps, className: classes.autocompleteInput } })), onChange: (_event, value) => void setTimezone(value?.data) })] }));
}
/**
 * TimeFormat - 時刻表示形式設定コンポーネント
 *
 * タイムスタンプの表示形式を選択する設定UI。
 * 秒形式（SEC）と時刻形式（TOD）の2つのオプションを提供します。
 *
 * 【機能】
 * - 秒形式（Unix時間）表示
 * - 時刻形式（人間が読みやすい形式）表示
 * - 実際の表示例をプレビュー
 * - レスポンシブなレイアウト対応
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションで実際の表示例を表示
 * - 縦/横レイアウトの選択可能
 *
 * @param props - コンポーネントのプロパティ
 * @param props.orientation - ボタンの配置方向（vertical/horizontal）
 * @returns TimeFormatのJSX要素
 */
export function TimeFormat({ orientation = "vertical", }) {
    // 時刻表示形式の状態管理
    const { timeFormat, setTimeFormat } = useAppTimeFormat();
    // 国際化フック
    const { t } = useTranslation("appSettings");
    // 現在のタイムゾーン設定を取得
    const [timezone] = useAppConfigurationValue(AppSetting.TIMEZONE);
    // 表示例用のサンプル時刻（2000年1月1日 12:00:00 UTC）
    const exampleTime = { sec: 946713600, nsec: 0 };
    return (_jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("timestampFormat"), ":"] }), _jsxs(ToggleButtonGroup, { color: "primary", size: "small", orientation: orientation, fullWidth: true, exclusive: true, value: timeFormat, onChange: (_, value) => value != undefined && void setTimeFormat(value), children: [_jsx(ToggleButton, { value: "SEC", "data-testid": "timeformat-seconds", children: formatTimeRaw(exampleTime) }), _jsx(ToggleButton, { value: "TOD", "data-testid": "timeformat-local", children: formatTime(exampleTime, timezone) })] })] }));
}
/**
 * LaunchDefault - 起動設定コンポーネント
 *
 * リンクを開く際のアプリケーション選択設定UI。
 * Web版、デスクトップ版、毎回確認の3つのオプションを提供します。
 *
 * 【機能】
 * - Webアプリケーションでの起動
 * - デスクトップアプリケーションでの起動
 * - 毎回確認する設定
 * - 設定値の検証とサニタイズ
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションにアイコンとラベル
 * - 不正な値の自動補正
 *
 * @returns LaunchDefaultのJSX要素
 */
export function LaunchDefault() {
    const { classes } = useStyles();
    const { t } = useTranslation("appSettings");
    // 起動設定の状態管理
    const [preference, setPreference] = useAppConfigurationValue(AppSetting.LAUNCH_PREFERENCE);
    // 設定値の検証とサニタイズ
    let sanitizedPreference;
    switch (preference) {
        case LaunchPreferenceValue.WEB:
        case LaunchPreferenceValue.DESKTOP:
        case LaunchPreferenceValue.ASK:
            sanitizedPreference = preference;
            break;
        default:
            // 不正な値の場合はWebをデフォルトとする
            sanitizedPreference = LaunchPreferenceValue.WEB;
    }
    return (_jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("openLinksIn"), ":"] }), _jsxs(ToggleButtonGroup, { color: "primary", size: "small", fullWidth: true, exclusive: true, value: sanitizedPreference, onChange: (_, value) => value != undefined && void setPreference(value), children: [_jsxs(ToggleButton, { value: LaunchPreferenceValue.WEB, className: classes.toggleButton, children: [_jsx(WebIcon, {}), " ", t("webApp")] }), _jsxs(ToggleButton, { value: LaunchPreferenceValue.DESKTOP, className: classes.toggleButton, children: [_jsx(ComputerIcon, {}), " ", t("desktopApp")] }), _jsxs(ToggleButton, { value: LaunchPreferenceValue.ASK, className: classes.toggleButton, children: [_jsx(QuestionAnswerOutlinedIcon, {}), " ", t("askEachTime")] })] })] }));
}
/**
 * MessageFramerate - メッセージレート設定コンポーネント
 *
 * メッセージの更新頻度（Hz）を設定するUI。
 * 1Hzから60Hzまでの段階的な選択肢を提供します。
 *
 * 【機能】
 * - メッセージ更新頻度の設定
 * - 1-60Hzの段階的選択肢
 * - デフォルト値60Hzの自動設定
 * - パフォーマンスへの影響を考慮した選択肢
 *
 * 【UI構成】
 * - Selectコンポーネントによるドロップダウン選択
 * - Hz単位での表示
 * - 数値のみのシンプルな表示
 *
 * @returns MessageFramerateのJSX要素
 */
export function MessageFramerate() {
    const { t } = useTranslation("appSettings");
    // メッセージレートの状態管理
    const [messageRate, setMessageRate] = useAppConfigurationValue(AppSetting.MESSAGE_RATE);
    // 選択肢オプションの生成（useMemoでパフォーマンス最適化）
    const options = useMemo(() => MESSAGE_RATES.map((rate) => ({ key: rate, text: `${rate}`, data: rate })), []);
    return (_jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("messageRate"), " (Hz):"] }), _jsx(Select, { value: messageRate ?? 60, fullWidth: true, onChange: (event) => void setMessageRate(event.target.value), children: options.map((option) => (_jsx(MenuItem, { value: option.key, children: option.text }, option.key))) })] }));
}
/**
 * AutoUpdate - 自動更新設定コンポーネント
 *
 * デスクトップ版アプリケーションの自動更新機能を制御するUI。
 * ユーザーが自動更新の有効/無効を選択できます。
 *
 * 【機能】
 * - 自動更新の有効/無効切り替え
 * - デスクトップ版専用機能
 * - デフォルトで有効化
 * - セキュリティアップデートの自動適用
 *
 * 【UI構成】
 * - チェックボックスによる単純なON/OFF
 * - 説明的なラベルテキスト
 * - 他の設定項目との一貫したスタイル
 *
 * @returns AutoUpdateのJSX要素
 */
export function AutoUpdate() {
    // 自動更新設定の状態管理（デフォルト: true）
    const [updatesEnabled = true, setUpdatedEnabled] = useAppConfigurationValue(AppSetting.UPDATES_ENABLED);
    const { classes } = useStyles();
    return (_jsxs(_Fragment, { children: [_jsx(FormLabel, { children: "Updates:" }), _jsx(FormControlLabel, { className: classes.formControlLabel, control: _jsx(Checkbox, { className: classes.checkbox, checked: updatesEnabled, onChange: (_event, checked) => void setUpdatedEnabled(checked) }), label: "Automatically install updates" })] }));
}
/**
 * RosPackagePath - ROSパッケージパス設定コンポーネント
 *
 * デスクトップ版でのROS_PACKAGE_PATH環境変数を設定するUI。
 * ROSパッケージの検索パスをカスタマイズできます。
 *
 * 【機能】
 * - ROS_PACKAGE_PATH環境変数の設定
 * - システム環境変数のプレースホルダー表示
 * - デスクトップ版専用機能
 * - パッケージ検索パスのカスタマイズ
 *
 * 【UI構成】
 * - TextFieldによる自由入力
 * - システム値をプレースホルダーとして表示
 * - フルワイドレイアウト
 *
 * @returns RosPackagePathのJSX要素
 */
export function RosPackagePath() {
    // ROSパッケージパスの状態管理
    const [rosPackagePath, setRosPackagePath] = useAppConfigurationValue(AppSetting.ROS_PACKAGE_PATH);
    // システム環境変数からプレースホルダー値を取得
    const rosPackagePathPlaceholder = useMemo(() => OsContextSingleton?.getEnvVar("ROS_PACKAGE_PATH"), []);
    return (_jsx(TextField, { fullWidth: true, label: "ROS_PACKAGE_PATH", placeholder: rosPackagePathPlaceholder, value: rosPackagePath ?? "", onChange: (event) => void setRosPackagePath(event.target.value) }));
}
/**
 * LanguageSettings - 言語設定コンポーネント
 *
 * アプリケーションの表示言語を選択するUI。
 * 現在は英語のみサポート、将来的に多言語対応予定です。
 *
 * 【機能】
 * - アプリケーション言語の選択
 * - リアルタイムな言語切り替え
 * - 設定値の永続化
 * - エラーハンドリング付きの言語変更
 *
 * 【UI構成】
 * - Selectコンポーネントによるドロップダウン選択
 * - 言語名の表示
 * - デフォルト英語設定
 *
 * 【将来の拡張】
 * - 日本語、中国語、フランス語等の追加予定
 * - 地域固有の設定（日付形式、数値形式等）
 *
 * @returns LanguageSettingsのJSX要素
 */
export function LanguageSettings() {
    const { t, i18n } = useTranslation("appSettings");
    // 選択言語の状態管理（デフォルト: 英語）
    const [selectedLanguage = "en", setSelectedLanguage] = useAppConfigurationValue(AppSetting.LANGUAGE);
    /**
     * 言語変更ハンドラー
     *
     * ユーザーが言語を変更した際の処理。
     * 設定値の保存とi18nライブラリの言語切り替えを実行します。
     *
     * @param event - 選択変更イベント
     */
    const onChangeLanguage = useCallback((event) => {
        const lang = event.target.value;
        void setSelectedLanguage(lang);
        // i18nライブラリの言語を変更（エラーハンドリング付き）
        i18n.changeLanguage(lang).catch((error) => {
            console.error("Failed to switch languages", error);
            reportError(error);
        });
    }, [i18n, setSelectedLanguage]);
    // 言語選択肢の生成（useMemoでパフォーマンス最適化）
    const options = useMemo(() => LANGUAGE_OPTIONS.map((language) => ({
        key: language.key,
        text: language.value,
        data: language.key,
    })), []);
    return (_jsxs(Stack, { children: [_jsxs(FormLabel, { children: [t("language"), ":"] }), _jsx(Select, { value: selectedLanguage, fullWidth: true, onChange: onChangeLanguage, children: options.map((option) => (_jsx(MenuItem, { value: option.key, children: option.text }, option.key))) })] }));
}

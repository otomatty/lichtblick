import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview SettingsTreeEditor用のフィールドエディターコンポーネント
 *
 * 設定ツリーの個別フィールド（設定項目）を編集するためのコンポーネント群です。
 * 様々な入力タイプ（文字列、数値、選択、色、ベクトル等）に対応し、
 * 統一されたUIでフィールドの編集機能を提供します。
 *
 * 主な機能：
 * - 12種類の入力タイプサポート（string, number, boolean, select, autocomplete, rgb, rgba, messagepath, gradient, vec2, vec3, toggle）
 * - エラー表示とバリデーション
 * - 読み取り専用モードと無効化状態
 * - カスタムステータスボタン対応
 * - 階層に応じたインデント表示
 * - パフォーマンス最適化（React.memo）
 *
 * 使用例：
 * ```tsx
 * <FieldEditor
 *   field={{
 *     input: "string",
 *     label: "名前",
 *     value: "デフォルト値",
 *     placeholder: "名前を入力してください"
 *   }}
 *   path={["settings", "general", "name"]}
 *   actionHandler={handleAction}
 * />
 * ```
 */
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import { Autocomplete, MenuItem, MenuList, Select, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, } from "@mui/material";
import { v4 as uuid } from "uuid";
import MessagePathInput from "@lichtblick/suite-base/components/MessagePathSyntax/MessagePathInput";
import { useStyles } from "@lichtblick/suite-base/components/SettingsTreeEditor/FieldEditor.style";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppContext } from "@lichtblick/suite-base/context/AppContext";
import { ColorGradientInput, ColorPickerInput, NumberInput, Vec2Input, Vec3Input } from "./inputs";
/**
 * select入力でundefinedと空文字列を区別するためのセンチネル値
 * UUIDを使用してユニークな値を保証します
 */
const UNDEFINED_SENTINEL_VALUE = uuid();
/**
 * select入力で無効なオプションが選択された際のMUIエラーを回避するためのセンチネル値
 * UUIDを使用してユニークな値を保証します
 */
const INVALID_SENTINEL_VALUE = uuid();
/**
 * フィールドの入力コンポーネントを生成する関数
 *
 * フィールドの入力タイプに応じて適切な入力コンポーネントを返します。
 * 12種類の入力タイプをサポートし、それぞれに特化した設定とイベントハンドリングを提供します。
 *
 * サポートする入力タイプ：
 * - autocomplete: 自動補完付きテキスト入力
 * - number: 数値入力（範囲、精度、ステップ指定可能）
 * - toggle: 複数選択肢のトグルボタン
 * - string: 文字列入力
 * - boolean: ON/OFF切り替え
 * - rgb: RGB色選択
 * - rgba: RGBA色選択（透明度付き）
 * - messagepath: メッセージパス入力
 * - select: ドロップダウン選択
 * - gradient: グラデーション色設定
 * - vec3: 3次元ベクトル入力
 * - vec2: 2次元ベクトル入力
 *
 * @param actionHandler - アクション実行ハンドラー
 * @param field - フィールド定義
 * @param path - フィールドのパス
 * @returns 入力コンポーネント
 */
function FieldInput({ actionHandler, field, path, }) {
    const { classes, cx } = useStyles();
    switch (field.input) {
        case "autocomplete":
            // 自動補完付きテキスト入力
            return (_jsx(Autocomplete, { className: classes.autocomplete, size: "small", freeSolo: true, value: field.value, disabled: field.disabled, readOnly: field.readonly, ListboxComponent: MenuList, ListboxProps: { dense: true }, renderOption: (props, option, { selected }) => (_jsx(MenuItem, { selected: selected, ...props, children: option })), componentsProps: {
                    clearIndicator: {
                        size: "small",
                        className: classes.clearIndicator,
                    },
                }, clearIcon: _jsx(CancelIcon, { fontSize: "small" }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "filled", size: "small", placeholder: field.placeholder })), onInputChange: (_event, value, reason) => {
                    // 入力による変更のみ処理（選択による変更は除外）
                    if (reason === "input") {
                        actionHandler({ action: "update", payload: { path, input: "autocomplete", value } });
                    }
                }, onChange: (_event, value) => {
                    // 選択による変更を処理
                    actionHandler({
                        action: "update",
                        payload: { path, input: "autocomplete", value: value ?? undefined },
                    });
                }, options: field.items }));
        case "number":
            // 数値入力（範囲、精度、ステップ指定可能）
            return (_jsx(NumberInput, { size: "small", variant: "filled", value: field.value, disabled: field.disabled, readOnly: field.readonly, placeholder: field.placeholder, fullWidth: true, max: field.max, min: field.min, precision: field.precision, step: field.step, onChange: (value) => {
                    actionHandler({ action: "update", payload: { path, input: "number", value } });
                } }));
        case "toggle":
            // 複数選択肢のトグルボタン
            return (_jsx(ToggleButtonGroup, { className: classes.styledToggleButtonGroup, fullWidth: true, value: field.value ?? UNDEFINED_SENTINEL_VALUE, exclusive // 単一選択モード
                : true, disabled: field.disabled, size: "small", onChange: (_event, value) => {
                    if (value != undefined && field.readonly !== true) {
                        actionHandler({
                            action: "update",
                            payload: {
                                path,
                                input: "toggle",
                                value: value === UNDEFINED_SENTINEL_VALUE ? undefined : value,
                            },
                        });
                    }
                }, children: field.options.map((opt) => (_jsx(ToggleButton, { value: (typeof opt === "object" ? opt.value : opt) ?? UNDEFINED_SENTINEL_VALUE, children: typeof opt === "object" ? opt.label : opt }, (typeof opt === "object" ? opt.value : opt) ?? UNDEFINED_SENTINEL_VALUE))) }));
        case "string":
            // 文字列入力
            return (_jsx(TextField, { variant: "filled", size: "small", fullWidth: true, disabled: field.disabled, value: field.value ?? "", placeholder: field.placeholder, InputProps: {
                    readOnly: field.readonly,
                }, onChange: (event) => {
                    actionHandler({
                        action: "update",
                        payload: { path, input: "string", value: event.target.value },
                    });
                } }));
        case "boolean":
            // ON/OFF切り替え
            return (_jsxs(ToggleButtonGroup, { className: classes.styledToggleButtonGroup, fullWidth: true, value: field.value ?? false, exclusive: true, disabled: field.disabled, size: "small", onChange: (_event, value) => {
                    if (value != undefined && field.readonly !== true) {
                        actionHandler({
                            action: "update",
                            payload: { path, input: "boolean", value },
                        });
                    }
                }, children: [_jsx(ToggleButton, { value: false, children: "Off" }), _jsx(ToggleButton, { value: true, children: "On" })] }));
        case "rgb":
            // RGB色選択（透明度なし）
            return (_jsx(ColorPickerInput, { alphaType: "none" // 透明度なし
                , disabled: field.disabled, readOnly: field.readonly, placeholder: field.placeholder, value: field.value?.toString(), onChange: (value) => {
                    actionHandler({
                        action: "update",
                        payload: { path, input: "rgb", value },
                    });
                }, hideClearButton: field.hideClearButton }));
        case "rgba":
            // RGBA色選択（透明度付き）
            return (_jsx(ColorPickerInput, { alphaType: "alpha" // 透明度付き
                , disabled: field.disabled, readOnly: field.readonly, placeholder: field.placeholder, value: field.value?.toString(), onChange: (value) => {
                    actionHandler({
                        action: "update",
                        payload: { path, input: "rgba", value },
                    });
                } }));
        case "messagepath":
            // メッセージパス入力（ROSメッセージのパス指定）
            return (_jsx(MessagePathInput, { variant: "filled", path: field.value ?? "", disabled: field.disabled, readOnly: field.readonly, supportsMathModifiers: field.supportsMathModifiers, onChange: (value) => {
                    actionHandler({
                        action: "update",
                        payload: { path, input: "messagepath", value },
                    });
                }, validTypes: field.validTypes }));
        case "select": {
            // ドロップダウン選択
            // findIndexを使用してTypeScriptの配列union型の混乱を回避
            const selectedOptionIndex = field.options.findIndex((option) => option.value === field.value);
            const selectedOption = field.options[selectedOptionIndex];
            const isEmpty = field.options.length === 0;
            let selectValue = field.value;
            if (!selectedOption) {
                selectValue = INVALID_SENTINEL_VALUE;
            }
            else if (selectValue == undefined) {
                // value={undefined}を渡すとReactエラー「コンポーネントが非制御から制御に変更されています」が発生するため、
                // センチネル値を使用
                selectValue = UNDEFINED_SENTINEL_VALUE;
            }
            const hasError = !selectedOption && (!isEmpty || field.value != undefined);
            return (_jsxs(Select, { className: cx({ [classes.error]: hasError }), size: "small", displayEmpty: true, fullWidth: true, disabled: field.disabled, readOnly: field.readonly, variant: "filled", value: selectValue, renderValue: (_value) => {
                    // オプションリストにない値でも表示できるよう、field.valueを直接使用
                    const value = field.value;
                    for (const option of field.options) {
                        if (option.value === value) {
                            return option.label.trim();
                        }
                    }
                    return value;
                }, onChange: (event) => {
                    actionHandler({
                        action: "update",
                        payload: {
                            path,
                            input: "select",
                            value: event.target.value === UNDEFINED_SENTINEL_VALUE
                                ? undefined
                                : event.target.value,
                        },
                    });
                }, MenuProps: { MenuListProps: { dense: true } }, children: [field.options.map(({ label, value = UNDEFINED_SENTINEL_VALUE, disabled }) => (_jsx(MenuItem, { value: value, disabled: disabled, children: label }, value))), isEmpty && _jsx(MenuItem, { disabled: true, children: "No options" }), !selectedOption && (_jsx(MenuItem, { style: { display: "none" }, value: INVALID_SENTINEL_VALUE }))] }));
        }
        case "gradient":
            // グラデーション色設定
            return (_jsx(ColorGradientInput, { colors: field.value, disabled: field.disabled, readOnly: field.readonly, onChange: (value) => {
                    actionHandler({ action: "update", payload: { path, input: "gradient", value } });
                } }));
        case "vec3":
            // 3次元ベクトル入力（X, Y, Z）
            return (_jsx(Vec3Input, { step: field.step, placeholder: field.placeholder, value: field.value, precision: field.precision, disabled: field.disabled, readOnly: field.readonly, min: field.min, max: field.max, onChange: (value) => {
                    actionHandler({ action: "update", payload: { path, input: "vec3", value } });
                } }));
        case "vec2":
            // 2次元ベクトル入力（X, Y）
            return (_jsx(Vec2Input, { step: field.step, value: field.value, placeholder: field.placeholder, precision: field.precision, disabled: field.disabled, readOnly: field.readonly, min: field.min, max: field.max, onChange: (value) => {
                    actionHandler({ action: "update", payload: { path, input: "vec2", value } });
                } }));
    }
}
/**
 * フィールドのラベル表示コンポーネント
 *
 * フィールドの入力タイプに応じて適切なラベル表示を行います。
 * ベクトル入力（vec2, vec3）の場合は、各軸のラベルも表示します。
 *
 * @param field - フィールド定義
 * @returns ラベル表示コンポーネント
 */
function FieldLabel({ field }) {
    const { classes } = useStyles();
    if (field.input === "vec2") {
        // 2次元ベクトル用のマルチラベル表示（X, Y）
        const labels = field.labels ?? ["X", "Y"];
        return (_jsx(_Fragment, { children: _jsxs("div", { className: classes.multiLabelWrapper, children: [_jsx(Typography, { title: field.label, variant: "subtitle2", color: "text.secondary", noWrap: true, flex: "auto", children: field.label }), labels.map((label, index) => (_jsx(Typography, { title: field.label, variant: "subtitle2", color: "text.secondary", noWrap: true, style: { gridColumn: index === 0 ? "span 1" : "2 / span 1" }, flex: "auto", children: label }, label)))] }) }));
    }
    else if (field.input === "vec3") {
        // 3次元ベクトル用のマルチラベル表示（X, Y, Z）
        const labels = field.labels ?? ["X", "Y", "Z"];
        return (_jsx(_Fragment, { children: _jsxs("div", { className: classes.multiLabelWrapper, children: [_jsx(Typography, { title: field.label, variant: "subtitle2", color: "text.secondary", noWrap: true, flex: "auto", children: field.label }), labels.map((label, index) => (_jsx(Typography, { title: field.label, variant: "subtitle2", color: "text.secondary", noWrap: true, style: { gridColumn: index === 0 ? "span 1" : "2 / span 1" }, flex: "auto", children: label }, label)))] }) }));
    }
    else {
        // 通常のシングルラベル表示
        return (_jsx(_Fragment, { children: _jsx(Typography, { className: classes.fieldLabel, title: field.help ?? field.label, variant: "subtitle2", children: field.label }) }));
    }
}
/**
 * フィールドエディターのメインコンポーネント
 *
 * 設定ツリーの個別フィールドを編集するためのコンポーネントです。
 * ラベル、入力コンポーネント、エラー表示、ステータスボタンを統合して表示します。
 *
 * レイアウト構造：
 * - 左側：ラベル、エラーアイコン、ステータスボタン
 * - 右側：入力コンポーネント
 * - 階層に応じたインデント表示
 *
 * @param actionHandler - アクション実行ハンドラー
 * @param field - フィールド定義
 * @param path - フィールドのパス
 * @returns フィールドエディターコンポーネント
 */
function FieldEditorComponent({ actionHandler, field, path, }) {
    // インデント計算（最大4階層まで）
    const indent = Math.min(path.length, 4);
    const paddingLeft = 0.75 + 2 * (indent - 1);
    const { classes, cx } = useStyles();
    // カスタムステータスボタンの取得
    const { renderSettingsStatusButton } = useAppContext();
    const statusButton = renderSettingsStatusButton ? renderSettingsStatusButton(field) : undefined;
    return (_jsxs(_Fragment, { children: [_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "flex-end", gap: 0.5, paddingLeft: paddingLeft, fullHeight: true, children: [statusButton, field.error && (_jsx(Tooltip, { arrow: true, placement: "top", title: _jsx(Typography, { variant: "subtitle2", children: field.error }), children: _jsx(ErrorIcon, { color: "error", fontSize: "small" }) })), _jsx(FieldLabel, { field: field })] }), _jsx("div", { className: cx(classes.fieldWrapper, { [classes.error]: field.error != undefined }), children: _jsx(FieldInput, { actionHandler: actionHandler, field: field, path: path }) }), _jsx(Stack, { paddingBottom: 0.25, style: { gridColumn: "span 2" } })] }));
}
/**
 * パフォーマンス最適化されたFieldEditorコンポーネント
 *
 * React.memoにより、propsが変更されない限り再レンダリングを防ぎます。
 * 大量のフィールドを扱う設定ツリーでのパフォーマンス向上に寄与します。
 */
export const FieldEditor = React.memo(FieldEditorComponent);

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview NodeEditor - 設定ツリーノード編集コンポーネント
 *
 * このファイルは、SettingsTreeEditorの中核となるNodeEditorコンポーネントを提供します。
 * 各設定ノード（フォルダ/グループ）の表示、編集、制御を担当します。
 *
 * 主な機能：
 * - ノードの展開/折りたたみ制御
 * - ノードラベルの編集（リネーム機能）
 * - 表示/非表示の切り替え
 * - 子ノードとフィールドの表示管理
 * - アクションメニューの表示
 * - フォーカス制御とスクロール
 * - 検索フィルターによるハイライト
 * - エラー表示
 *
 * アーキテクチャ：
 * - 再帰的な構造で階層ツリーを構築
 * - useImmerによる状態管理
 * - パフォーマンス最適化のためのメモ化
 * - アクセシビリティ対応
 */
import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import { Button, Divider, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import * as _ from "lodash-es";
import memoizeWeak from "memoize-weak";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { filterMap } from "@lichtblick/den/collection";
import { HighlightedText } from "@lichtblick/suite-base/components/HighlightedText";
import { useStyles } from "@lichtblick/suite-base/components/SettingsTreeEditor/NodeEditor.style";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppContext } from "@lichtblick/suite-base/context/AppContext";
import { FieldEditor } from "./FieldEditor";
import { NodeActionsMenu } from "./NodeActionsMenu";
import { VisibilityToggle } from "./VisibilityToggle";
import { icons } from "./icons";
import { prepareSettingsNodes } from "./utils";
/**
 * 展開/折りたたみ矢印アイコンコンポーネント
 *
 * ノードの展開状態に応じて下向き矢印（展開時）または右向き矢印（折りたたみ時）を表示します。
 *
 * @param props - コンポーネントプロパティ
 * @param props.expanded - 展開状態（true: 展開、false: 折りたたみ）
 * @returns {React.JSX.Element} 矢印アイコンのJSX要素
 */
function ExpansionArrow({ expanded }) {
    const { classes } = useStyles();
    // 展開状態に応じてアイコンを切り替え
    const Component = expanded ? ArrowDownIcon : ArrowRightIcon;
    return (_jsx("div", { className: classes.iconWrapper, children: _jsx(Component, {}) }));
}
/**
 * 安定したパス配列を生成するためのメモ化関数
 *
 * 親パスと子キーを結合して新しいパス配列を生成します。
 * メモ化により、同じ引数に対して常に同じ配列インスタンスを返し、
 * 不要な再レンダリングを防止します。
 *
 * @param path - 親パス配列
 * @param key - 追加する子キー
 * @returns {string[]} 結合されたパス配列
 */
const makeStablePath = memoizeWeak((path, key) => [...path, key]);
/**
 * 表示フィルターの選択肢を生成する関数
 *
 * 国際化対応のラベルと値のペアを生成します。
 *
 * @param t - 翻訳関数
 * @returns {Array} 選択肢配列（label, value のペア）
 */
const SelectVisibilityFilterOptions = (t) => [
    { label: t("listAll"), value: "all" }, // 全て表示
    { label: t("listVisible"), value: "visible" }, // 表示項目のみ
    { label: t("listInvisible"), value: "invisible" }, // 非表示項目のみ
];
/**
 * 表示状態の項目をフィルタリングする関数
 *
 * visible プロパティが false でない項目（true または undefined）を表示対象とします。
 * undefined の場合は表示扱いとなります。
 *
 * @param child - 判定対象の子ノード
 * @returns {boolean} 表示対象の場合 true
 */
function showVisibleFilter(child) {
    // visible が undefined の場合も表示対象とする
    return child.visible !== false;
}
/**
 * 非表示状態の項目をフィルタリングする関数
 *
 * visible プロパティが true でない項目（false または undefined）を表示対象とします。
 * undefined の場合は非表示扱いとなります。
 *
 * @param child - 判定対象の子ノード
 * @returns {boolean} 表示対象の場合 true
 */
function showInvisibleFilter(child) {
    // visible が undefined の場合も表示対象とする
    return child.visible !== true;
}
/**
 * 表示フィルター用のフィールド定義を生成する関数
 *
 * 表示/非表示フィルターのドロップダウン選択フィールドを定義します。
 *
 * @param t - 翻訳関数
 * @returns {SettingsTreeField} フィールド定義オブジェクト
 */
const getSelectVisibilityFilterField = (t) => ({
    input: "select", // 選択入力タイプ
    label: t("filterList"), // フィールドラベル
    help: t("filterListHelp"), // ヘルプテキスト
    options: SelectVisibilityFilterOptions(t), // 選択肢
});
/**
 * ノード編集コンポーネントのメイン実装
 *
 * 設定ツリーの個別ノード（フォルダ/グループ）を表示・編集するコンポーネントです。
 * 階層構造、展開/折りたたみ、編集機能、アクション実行などを提供します。
 *
 * @param props - NodeEditorProps型のプロパティ
 * @returns {React.JSX.Element} ノード編集UIのJSX要素
 *
 * 主な機能：
 * - ノードの展開/折りたたみ制御
 * - ラベルの編集（リネーム）
 * - 表示/非表示切り替え
 * - 子ノードとフィールドの表示
 * - アクションメニュー
 * - フォーカス制御
 * - エラー表示
 */
function NodeEditorComponent(props) {
    // プロパティの分割代入と デフォルト値設定
    const { actionHandler, defaultOpen = true, filter, focusedPath, settings = {} } = props;
    // useImmerによる状態管理（イミュータブルな状態更新）
    const [state, setState] = useImmer({
        editing: false, // ラベル編集モード
        focusedPath: undefined, // フォーカスパス
        open: defaultOpen, // 展開状態
        visibilityFilter: "all", // 表示フィルター
    });
    // コンテキストとフック
    const { renderSettingsStatusButton } = useAppContext(); // カスタムステータスボタン
    const { t } = useTranslation("settingsEditor"); // 国際化
    const { classes, cx, theme } = useStyles(); // スタイル
    // 計算されたプロパティ
    const indent = props.path.length; // インデントレベル（階層の深さ）
    const allowVisibilityToggle = props.settings?.visible != undefined; // 表示切り替え可能かどうか
    const visible = props.settings?.visible !== false; // 現在の表示状態
    const selectVisibilityFilterEnabled = props.settings?.enableVisibilityFilter === true; // フィルター有効化
    /**
     * 表示フィルターの選択値を更新するハンドラー
     *
     * selectタイプのアクションを受け取り、visibilityFilterの状態を更新します。
     *
     * @param action - 設定ツリーアクション
     */
    const selectVisibilityFilter = (action) => {
        if (action.action === "update" && action.payload.input === "select") {
            setState((draft) => {
                draft.visibilityFilter = action.payload.value;
            });
        }
    };
    /**
     * ノードの表示/非表示を切り替えるハンドラー
     *
     * 現在の表示状態を反転させてactionHandlerに送信します。
     * visible プロパティの boolean 値を更新します。
     */
    const toggleVisibility = () => {
        actionHandler({
            action: "update",
            payload: { input: "boolean", path: [...props.path, "visible"], value: !visible },
        });
    };
    /**
     * ノードアクションを実行するハンドラー
     *
     * 指定されたアクションIDを使用してノードアクションを実行します。
     *
     * @param actionId - 実行するアクションのID
     */
    const handleNodeAction = (actionId) => {
        actionHandler({ action: "perform-node-action", payload: { id: actionId, path: props.path } });
    };
    /** 現在のノードがフォーカスされているかどうかを判定 */
    const isFocused = _.isEqual(focusedPath, props.path);
    /**
     * フォーカスパスの変更を監視し、適切な展開とスクロール処理を実行
     *
     * フォーカスパス上のノードは自動的に展開され、
     * 直接フォーカスされたノードはビューにスクロールされます。
     */
    useEffect(() => {
        // フォーカスパス上にあるかどうかを判定
        const isOnFocusedPath = focusedPath != undefined && _.isEqual(props.path, focusedPath.slice(0, props.path.length));
        // フォーカスパス上のノードは自動展開
        if (isOnFocusedPath) {
            setState((draft) => {
                draft.open = true;
            });
        }
        // 直接フォーカスされたノードはスクロール
        if (isFocused) {
            rootRef.current?.scrollIntoView();
        }
    }, [focusedPath, isFocused, props.path, setState]);
    // 設定データの分割代入
    const { fields, children } = settings;
    /** 子ノードが存在するかどうか */
    const hasChildren = children != undefined && Object.keys(children).length > 0;
    /** フィールドまたは子ノードが存在するかどうか（展開矢印の表示判定用） */
    const hasProperties = fields != undefined || hasChildren;
    /** ノードのルート要素への参照（スクロール制御用） */
    const rootRef = useRef(ReactNull);
    /** フィールドのエントリー配列（キーと値のペア） */
    const entries = useMemo(() => Object.entries(fields ?? {}), [fields]);
    /**
     * フィールドエディターをレンダリングするコールバック関数
     *
     * パフォーマンス最適化のためuseCallbackでメモ化されています。
     *
     * @param key - フィールドのキー
     * @param field - フィールド定義
     * @returns FieldEditorコンポーネント
     */
    const renderFieldEditor = useCallback((key, field) => (_jsx(FieldEditor, { field: field, path: makeStablePath(props.path, key), actionHandler: actionHandler }, key)), [props.path, actionHandler]);
    /**
     * レンダリングするフィールドエディターの配列
     *
     * null/undefinedのフィールドは除外され、
     * 有効なフィールドのみがFieldEditorコンポーネントとしてレンダリングされます。
     */
    const fieldEditors = useMemo(() => entries.filter(([, field]) => field).map(([key, field]) => renderFieldEditor(key, field)), [entries, renderFieldEditor]);
    /**
     * 表示フィルターに基づいたフィルター関数
     *
     * visibilityFilterの値に応じて適切なフィルター関数を選択します。
     * "all"の場合はundefinedを返し、全ての項目を表示します。
     */
    const filterFn = useMemo(() => {
        if (state.visibilityFilter === "visible") {
            return showVisibleFilter;
        }
        if (state.visibilityFilter === "invisible") {
            return showInvisibleFilter;
        }
        return undefined; // "all"の場合はフィルターなし
    }, [state.visibilityFilter]);
    /**
     * 準備された子ノードの配列
     *
     * prepareSettingsNodes関数でソートされた子ノードの配列です。
     */
    const preparedNodes = useMemo(() => prepareSettingsNodes(children ?? {}), [children]);
    /**
     * フィルターが適用された子ノードの配列
     *
     * 表示フィルターに基づいて子ノードをフィルタリングします。
     * フィルター関数がundefinedの場合は全ての子ノードを表示します。
     */
    const filteredNodes = useMemo(() => {
        if (!filterFn) {
            return preparedNodes;
        }
        return preparedNodes.filter(([, child]) => filterFn(child));
    }, [preparedNodes, filterFn]);
    /**
     * レンダリングする子ノードエディターの配列
     *
     * フィルターされた子ノードを再帰的にNodeEditorコンポーネントとして生成します。
     * 各子ノードは独自の展開状態、フィルター、フォーカスパスを持ちます。
     */
    const childNodes = useMemo(() => {
        return filterMap(filteredNodes, ([key, child]) => (_jsx(NodeEditor, { actionHandler: actionHandler, defaultOpen: child.defaultExpansionState !== "collapsed", filter: filter, focusedPath: focusedPath, settings: child, path: makeStablePath(props.path, key) }, key)));
    }, [filteredNodes, actionHandler, filter, focusedPath, props.path]);
    /** アイコンコンポーネント（設定にアイコンが指定されている場合） */
    const IconComponent = settings.icon ? icons[settings.icon] : undefined;
    /**
     * ラベル編集時のテキスト変更ハンドラー
     *
     * renamableがtrueの場合のみ、ラベルの更新アクションを実行します。
     *
     * @param event - 入力変更イベント
     */
    const onEditLabel = useCallback((event) => {
        if (settings.renamable === true) {
            actionHandler({
                action: "update",
                payload: { path: [...props.path, "label"], input: "string", value: event.target.value },
            });
        }
    }, [actionHandler, props.path, settings.renamable]);
    /**
     * ラベル編集モードの切り替えハンドラー
     *
     * editing状態をトグルします。
     */
    const toggleEditing = useCallback(() => {
        setState((draft) => {
            draft.editing = !draft.editing;
        });
    }, [setState]);
    /**
     * ノードの展開/折りたたみ切り替えハンドラー
     *
     * 編集モードでない場合のみ、展開状態をトグルします。
     * 編集中は誤操作を防ぐため展開状態を変更しません。
     */
    const toggleOpen = useCallback(() => {
        setState((draft) => {
            if (!draft.editing) {
                draft.open = !draft.open;
            }
        });
    }, [setState]);
    /**
     * ラベル編集時のキーボードイベントハンドラー
     *
     * EnterキーまたはEscapeキーで編集モードを終了します。
     *
     * @param event - キーボードイベント
     */
    const onLabelKeyDown = useCallback((event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            toggleEditing();
        }
    }, [toggleEditing]);
    /**
     * アクションをインライン表示とメニュー表示に分割
     *
     * display が "inline" のアクションは直接ボタンとして表示され、
     * それ以外はメニューに格納されます。
     */
    const [inlineActions, menuActions] = useMemo(() => _.partition(settings.actions, (action) => action.type === "action" && action.display === "inline"), [settings.actions]);
    /**
     * カスタムステータスボタン
     *
     * アプリケーションコンテキストから提供されるカスタムステータスボタンです。
     * 存在しない場合は標準の表示切り替えボタンが使用されます。
     */
    const statusButton = renderSettingsStatusButton
        ? renderSettingsStatusButton(settings)
        : undefined;
    /**
     * アイコンスロットに表示するアイテムを決定
     *
     * 優先順位：
     * 1. エラーがある場合：エラーアイコン（ツールチップ付き）
     * 2. アイコンが設定されている場合：指定されたアイコン
     * 3. それ以外：空要素
     */
    const iconItem = useMemo(() => {
        // エラーがある場合はエラーアイコンを表示
        if (props.settings?.error) {
            return (_jsx(Tooltip, { arrow: true, title: _jsx(Typography, { variant: "subtitle2", className: classes.errorTooltip, children: props.settings.error }), children: _jsx(ErrorIcon, { fontSize: "small", color: "error", style: {
                        marginRight: theme.spacing(0.5),
                    } }) }));
        }
        // 通常のアイコンを表示
        if (IconComponent) {
            return (_jsx(IconComponent, { fontSize: "small", color: "inherit", style: {
                    marginRight: theme.spacing(0.5),
                    opacity: 0.8,
                } }));
        }
        return _jsx(_Fragment, {});
    }, [IconComponent, classes.errorTooltip, props.settings?.error, theme]);
    /**
     * ノードエディターのメインレンダリング
     *
     * 階層構造を持つ設定ノードのUIを構築します。
     * ヘッダー、フィールド、子ノードの表示を管理します。
     */
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: cx(classes.nodeHeader, {
                    [classes.focusedNode]: isFocused,
                    [classes.nodeHeaderVisible]: visible,
                }), ref: rootRef, children: [_jsxs("div", { className: cx(classes.nodeHeaderToggle, {
                            [classes.nodeHeaderToggleHasProperties]: hasProperties,
                            [classes.nodeHeaderToggleVisible]: visible,
                        }), style: {
                            marginLeft: theme.spacing(0.75 + 2 * indent), // 階層に応じたインデント
                        }, onClick: toggleOpen, "data-testid": `settings__nodeHeaderToggle__${props.path.join("-")}`, children: [hasProperties && _jsx(ExpansionArrow, { expanded: state.open }), iconItem, state.editing ? (
                            // 編集モード：テキストフィールド
                            _jsx(TextField, { className: classes.editNameField, autoFocus: true, variant: "filled", onChange: onEditLabel, value: settings.label, onBlur: toggleEditing, onKeyDown: onLabelKeyDown, onFocus: (event) => {
                                    event.target.select(); // フォーカス時に全選択
                                }, InputProps: {
                                    endAdornment: (_jsx(IconButton, { className: classes.actionButton, title: "Rename", "data-node-function": "edit-label", color: "primary", onClick: (event) => {
                                            event.stopPropagation();
                                            toggleEditing();
                                        }, children: _jsx(CheckIcon, { fontSize: "small" }) })),
                                } })) : (
                            // ビューモード：ラベル表示
                            _jsx(Typography, { noWrap: true, flex: "auto", variant: "subtitle2", fontWeight: indent < 2 ? 600 : 400, color: visible ? "text.primary" : "text.disabled", children: _jsx(HighlightedText, { text: settings.label ?? t("general"), highlight: filter }) }))] }), _jsxs(Stack, { alignItems: "center", direction: "row", children: [settings.renamable === true && !state.editing && (_jsx(IconButton, { className: classes.actionButton, title: "Rename", "data-node-function": "edit-label", color: "primary", onClick: (event) => {
                                    event.stopPropagation();
                                    toggleEditing();
                                }, children: _jsx(EditIcon, { fontSize: "small" }) })), statusButton ??
                                (settings.visible != undefined && (_jsx(VisibilityToggle, { size: "small", checked: visible, onChange: toggleVisibility, style: { opacity: allowVisibilityToggle ? 1 : 0 }, disabled: !allowVisibilityToggle }))), inlineActions.map((action) => {
                                const Icon = action.icon ? icons[action.icon] : undefined;
                                const handler = () => {
                                    actionHandler({
                                        action: "perform-node-action",
                                        payload: { id: action.id, path: props.path },
                                    });
                                };
                                // アイコンがある場合はIconButton、ない場合はButton
                                return Icon ? (_jsx(IconButton, { onClick: handler, title: action.label, className: classes.actionButton, children: _jsx(Icon, { fontSize: "small" }) }, action.id)) : (_jsx(Button, { onClick: handler, size: "small", color: "inherit", className: classes.actionButton, children: action.label }, action.id));
                            }), menuActions.length > 0 && (_jsx(NodeActionsMenu, { actions: menuActions, onSelectAction: handleNodeAction }))] })] }), state.open && fieldEditors.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: classes.fieldPadding }), fieldEditors, _jsx("div", { className: classes.fieldPadding })] })), state.open && selectVisibilityFilterEnabled && hasChildren && (_jsxs(_Fragment, { children: [_jsx(Stack, { paddingBottom: 0.5, style: { gridColumn: "span 2" } }), _jsx(FieldEditor, { field: { ...getSelectVisibilityFilterField(t), value: state.visibilityFilter }, path: makeStablePath(props.path, "visibilityFilter"), actionHandler: selectVisibilityFilter }, "visibilityFilter")] })), state.open && childNodes, indent === 1 && _jsx(Divider, { style: { gridColumn: "span 2" } })] }));
}
/**
 * パフォーマンス最適化されたNodeEditorコンポーネント
 *
 * React.memoにより、propsが変更されない限り再レンダリングを防ぎます。
 * 大量のノードを扱う設定ツリーでのパフォーマンス向上に寄与します。
 */
export const NodeEditor = React.memo(NodeEditorComponent);

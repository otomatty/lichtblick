import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * DataSourceOption: データソース選択オプション表示コンポーネント
 *
 * ユーザーが選択可能な個別のデータソースオプション（ローカルファイル、
 * リモート接続等）を表示するためのUIコンポーネントです。
 *
 * ## 主な機能
 *
 * ### 表示要素
 * - **アイコン**: データソースの種類を視覚的に表現
 * - **メインテキスト**: オプションの名称
 * - **セカンダリテキスト**: 詳細説明
 *
 * ### インタラクション
 * - **クリック処理**: オプション選択時のアクション実行
 * - **外部リンク**: 必要に応じて外部URLへの遷移
 *
 * ### レイアウト
 * - **フルワイズボタン**: 親要素の幅に合わせた表示
 * - **アイコン+テキスト**: 左側にアイコン、右側にテキスト情報
 * - **テキスト省略**: 長いテキストの適切な切り詰め
 *
 * ## 使用例
 *
 * ```tsx
 * // 基本的なデータソースオプション
 * <DataSourceOption
 *   icon={<FileIcon />}
 *   text="ローカルファイルを開く"
 *   secondaryText="bag, mcap, foxe形式のファイルを読み込み"
 *   onClick={() => openFileDialog()}
 *   target="_blank"
 * />
 *
 * // 外部リンク付きオプション
 * <DataSourceOption
 *   icon={<HelpIcon />}
 *   text="ヘルプとドキュメント"
 *   secondaryText="使用方法とトラブルシューティング"
 *   href="https://docs.lichtblick.org"
 *   onClick={() => {}}
 *   target="_blank"
 * />
 * ```
 */
import { Button, Link, Typography } from "@mui/material";
import { useStyles } from "@lichtblick/suite-base/components/DataSourceDialog/index.style";
import Stack from "@lichtblick/suite-base/components/Stack";
/**
 * DataSourceOption コンポーネント
 *
 * 個別のデータソース選択オプションを表示するボタンコンポーネントです。
 * アイコン、メインテキスト、サブテキストを組み合わせて、
 * 視覚的に分かりやすいオプション選択UIを提供します。
 *
 * ## レンダリング構造
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │ [Icon] メインテキスト                     │
 * │        セカンダリテキスト                 │
 * └─────────────────────────────────────────┘
 * ```
 *
 * ## 条件付きレンダリング
 *
 * - **href指定あり**: Linkコンポーネントでラップして外部リンクとして機能
 * - **href指定なし**: 通常のButtonコンポーネントとして機能
 *
 * @param props - コンポーネントプロパティ（DataSourceOptionProps型）
 * @returns レンダリングされたデータソースオプションコンポーネント
 */
const DataSourceOption = (props) => {
    const { icon, onClick, text, secondaryText, href, target } = props;
    const { classes } = useStyles();
    /**
     * ボタン要素の定義
     *
     * アイコンとテキスト情報を含むボタンUIを構築します。
     * Material-UIのButtonコンポーネントをベースに、
     * カスタムスタイルとレイアウトを適用します。
     */
    const button = (_jsx(Button, { className: classes.connectionButton, fullWidth // 親要素の幅に合わせて表示
        : true, color: "inherit" // 親要素のテーマカラーを継承
        , variant: "outlined" // アウトライン表示
        , startIcon: icon, onClick: onClick, children: _jsxs(Stack, { flex: "auto", zeroMinWidth: true, children: [_jsx(Typography, { variant: "subtitle1", color: "text.primary", children: text }), _jsx(Typography, { variant: "body2", color: "text.secondary", noWrap: true, children: secondaryText })] }) }));
    // 外部リンクが指定されている場合はLinkでラップ
    if (href) {
        return (_jsx(Link, { href: href, target: target, style: { textDecoration: "none" }, children: button }));
    }
    // 通常のボタンとして返す
    return button;
};
export default DataSourceOption;

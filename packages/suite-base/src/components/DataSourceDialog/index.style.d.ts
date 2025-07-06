/**
 * DataSourceDialog 共通スタイル定義
 *
 * DataSourceDialogコンポーネント群で共有されるスタイル定義を提供します。
 * レスポンシブデザイン、グリッドレイアウト、テーマ統合を実装し、
 * 一貫性のあるUI体験を提供します。
 *
 * 主な機能:
 * - レスポンシブグリッドレイアウト（デスクトップ/モバイル対応）
 * - テーマ統合（ライト/ダークモード対応）
 * - アクセシビリティ対応（画面高さ制限への対応）
 * - 視覚的階層構造（ヘッダー、コンテンツ、サイドバー）
 *
 * @example
 * ```tsx
 * import { useStyles } from './index.style';
 *
 * function MyComponent() {
 *   const { classes } = useStyles();
 *   return <div className={classes.grid}>...</div>;
 * }
 * ```
 */
export declare const useStyles: (params: void, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"button" | "header" | "content" | "grid" | "sidebar" | "logo" | "spacer" | "connectionButton" | "recentListItemButton" | "recentSourceSecondary", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};

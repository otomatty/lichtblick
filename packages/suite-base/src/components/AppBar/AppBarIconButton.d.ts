/// <reference types="react" />
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
import { IconButtonProps } from "@mui/material";
/**
 * AppBarIconButton Props - アイコンボタンコンポーネントのプロパティ
 *
 * Material-UIのIconButtonPropsを拡張し、title属性をReactNodeに変更。
 * これにより、文字列だけでなくJSX要素もツールチップとして表示可能。
 */
type AppBarIconButtonProps = Omit<IconButtonProps, "title"> & {
    /** ツールチップに表示するコンテンツ（文字列またはReactNode） */
    title?: React.ReactNode;
};
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
export declare const AppBarIconButton: import("react").ForwardRefExoticComponent<Omit<AppBarIconButtonProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};

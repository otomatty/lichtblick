/// <reference types="react" />
/**
 * SettingsMenu - 設定メニューコンポーネント
 *
 * AppBarに表示される設定関連のメニューを提供します。
 * アプリケーション設定と拡張機能設定へのアクセスを提供し、
 * 設定ダイアログの開閉を管理します。
 *
 * 主な機能：
 * - 一般設定ダイアログの表示
 * - 拡張機能設定ダイアログの表示
 * - 国際化対応（i18n）
 * - ポップオーバー形式でのメニュー表示
 *
 * @example
 * ```typescript
 * <SettingsMenu
 *   open={isSettingsMenuOpen}
 *   handleClose={handleSettingsMenuClose}
 *   anchorEl={settingsButtonElement}
 * />
 * ```
 */
import { PopoverPosition, PopoverReference } from "@mui/material";
/**
 * SettingsMenu Props - 設定メニューコンポーネントのプロパティ
 *
 * Material-UIのMenuコンポーネントで使用される標準的なプロパティを継承。
 * ポップオーバーの位置決めとイベントハンドリングを制御します。
 */
type SettingsMenuProps = {
    /** メニューを閉じるためのイベントハンドラー */
    handleClose: () => void;
    /** メニューのアンカー要素 */
    anchorEl?: HTMLElement;
    /** アンカーの参照方法 */
    anchorReference?: PopoverReference;
    /** アンカーの位置座標 */
    anchorPosition?: PopoverPosition;
    /** ポータルの無効化フラグ */
    disablePortal?: boolean;
    /** メニューの開閉状態 */
    open: boolean;
};
/**
 * SettingsMenu - 設定メニューコンポーネント
 *
 * アプリケーション設定へのアクセスを提供するメニューコンポーネント。
 * 設定ダイアログの開閉を管理し、特定の設定タブを直接開く機能を提供します。
 *
 * メニュー項目：
 * - 設定: 一般的なアプリケーション設定
 * - 拡張機能: 拡張機能の管理設定
 *
 * 動作仕様：
 * - メニューアイテムクリック時にダイアログを開く
 * - クリック後に自動的にメニューを閉じる
 * - 国際化対応による多言語表示
 *
 * @param props - コンポーネントのプロパティ
 * @returns SettingsMenuのJSX要素
 */
export declare function SettingsMenu({ anchorEl, anchorReference, anchorPosition, disablePortal, handleClose, open, }: SettingsMenuProps): React.JSX.Element;
export {};

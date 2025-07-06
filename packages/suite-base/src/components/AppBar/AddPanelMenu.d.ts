/// <reference types="react" />
/**
 * AddPanelMenu - パネル追加メニューコンポーネント
 *
 * AppBarから利用可能なパネルカタログを表示し、新しいパネルの追加を可能にします。
 * PanelCatalogコンポーネントをメニュー形式でラップし、以下の機能を提供：
 *
 * 主な機能：
 * - 利用可能なパネルタイプの一覧表示
 * - クリックによるパネル追加
 * - ドラッグ&ドロップによるパネル追加
 * - ドラッグ開始時のメニュー自動クローズ
 * - レスポンシブなメニューサイズ
 *
 * 連携コンポーネント：
 * - PanelCatalog: パネル一覧と選択UI
 * - useAddPanel: パネル追加ロジック
 *
 * @example
 * ```typescript
 * <AddPanelMenu
 *   open={isAddPanelMenuOpen}
 *   handleClose={handleAddPanelMenuClose}
 *   anchorEl={addPanelButtonElement}
 * />
 * ```
 */
import { PopoverPosition, PopoverReference } from "@mui/material";
/**
 * AddPanelMenu Props - パネル追加メニューコンポーネントのプロパティ
 *
 * Material-UIのMenuコンポーネントの標準プロパティを継承。
 * ポップオーバーの位置決めとイベントハンドリングを制御します。
 */
type AddPanelProps = {
    /** メニューのアンカー要素 */
    anchorEl?: HTMLElement;
    /** アンカーの位置座標 */
    anchorPosition?: PopoverPosition;
    /** アンカーの参照方法 */
    anchorReference?: PopoverReference;
    /** ポータルの無効化フラグ */
    disablePortal?: boolean;
    /** メニューを閉じるためのイベントハンドラー */
    handleClose: () => void;
    /** メニューの開閉状態 */
    open: boolean;
};
/**
 * AddPanelMenu - パネル追加メニューコンポーネント
 *
 * アプリケーションに新しいパネルを追加するためのメニューインターフェース。
 * PanelCatalogコンポーネントをメニュー形式でラップし、利用可能なパネルタイプの
 * 一覧表示と選択機能を提供します。
 *
 * 動作仕様：
 * - メニューは左下に展開
 * - クリック選択でパネルを追加
 * - ドラッグ&ドロップでパネルを配置
 * - ドラッグ開始時に自動的にメニューを閉じる（ドロップターゲットの妨害を防ぐ）
 *
 * ユーザビリティ：
 * - 密度の高いレイアウト（dense: true）
 * - パディング無効化による最大表示領域の確保
 * - アクセシビリティ対応（aria-labelledby）
 *
 * @param props - コンポーネントのプロパティ
 * @returns AddPanelMenuのJSX要素
 */
export declare function AddPanelMenu(props: AddPanelProps): React.JSX.Element;
export {};

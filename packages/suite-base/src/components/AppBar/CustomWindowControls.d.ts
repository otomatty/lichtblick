/// <reference types="react" />
/**
 * CustomWindowControls Props - カスタムウィンドウ制御コンポーネントのプロパティ
 *
 * デスクトップアプリケーションのウィンドウ制御に必要なプロパティを定義。
 * ズーム機能やプラットフォーム固有の動作をサポートします。
 */
export type CustomWindowControlsProps = {
    /** カスタムウィンドウ制御の表示フラグ */
    showCustomWindowControls?: boolean;
    /** ウィンドウの最大化状態 */
    isMaximized?: boolean;
    /**
     * 初期ズーム倍率
     *
     * ウィンドウの作成/リフレッシュ時に設定される初期ズーム倍率。
     * AppBarのカウンターズーム動作のベースラインとして使用され、
     * ブラウザウィンドウがズームイン/アウトしても
     * AppBarが同じサイズで表示されるようにします。
     */
    initialZoomFactor?: number;
    /** ウィンドウ最小化時のイベントハンドラー */
    onMinimizeWindow?: () => void;
    /** ウィンドウ最大化時のイベントハンドラー */
    onMaximizeWindow?: () => void;
    /** ウィンドウ復元時のイベントハンドラー */
    onUnmaximizeWindow?: () => void;
    /** ウィンドウ閉じる時のイベントハンドラー */
    onCloseWindow?: () => void;
};
/**
 * CustomWindowControls - カスタムウィンドウ制御コンポーネント
 *
 * デスクトップアプリケーション用のウィンドウ制御ボタン群を提供。
 * 標準的なOS ウィンドウ制御機能をアプリケーション内で実装し、
 * 統一されたUI体験を提供します。
 *
 * ボタン構成：
 * 1. 最小化ボタン（MinimizeIcon）
 * 2. 最大化/復元ボタン（CheckBoxOutlineBlank/FilterNoneIcon）
 * 3. 閉じるボタン（CloseIcon、ホバー時赤色）
 *
 * 動作仕様：
 * - 最大化状態に応じてアイコンを切り替え
 * - 各ボタンにテスト用IDを付与
 * - ホバー時の視覚的フィードバック
 * - 継承色の使用によるテーマ対応
 *
 * アクセシビリティ：
 * - data-testid による自動テスト対応
 * - 適切なボタンサイズ（small）
 * - 色のコントラスト確保
 *
 * @param props - コンポーネントのプロパティ
 * @returns CustomWindowControlsのJSX要素
 */
export declare function CustomWindowControls({ isMaximized, onMinimizeWindow, onMaximizeWindow, onUnmaximizeWindow, onCloseWindow, }: Omit<CustomWindowControlsProps, "showCustomWindowControls">): React.JSX.Element;

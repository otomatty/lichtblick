/// <reference types="react" />
import { CustomWindowControlsProps } from "./CustomWindowControls";
/**
 * AppBar Props - AppBarコンポーネントのプロパティ
 *
 * CustomWindowControlsPropsを継承し、AppBar固有のプロパティを追加。
 * デスクトップアプリとWebアプリの両方に対応。
 */
export type AppBarProps = CustomWindowControlsProps & {
    /** 左側のインセット（システムウィンドウ制御用の余白） */
    leftInset?: number;
    /** ダブルクリック時のイベントハンドラー（ウィンドウ最大化/復元） */
    onDoubleClick?: () => void;
    /** ドラッグ領域のデバッグ表示フラグ */
    debugDragRegion?: boolean;
};
/**
 * AppBar - アプリケーションバーメインコンポーネント
 *
 * アプリケーション上部のメインツールバーを提供するコンポーネント。
 * 複数のサブコンポーネントを統合し、統一されたユーザーインターフェースを実現。
 *
 * コンポーネント構成：
 * - AppBarContainer: 最外側コンテナ
 * - AppMenu: アプリケーションメニュー
 * - AddPanelMenu: パネル追加メニュー
 * - DataSource: データソース表示
 * - SettingsMenu: 設定メニュー
 * - CustomWindowControls: ウィンドウ制御（デスクトップ用）
 *
 * 状態管理：
 * - メニューの開閉状態（app, user, panel）
 * - サイドバーの開閉状態（left, right）
 * - レイアウトの存在チェック
 * - メモリ使用量インジケータの表示設定
 *
 * アクセシビリティ：
 * - ARIA属性による適切な状態表示
 * - キーボードショートカットの表示
 * - ツールチップによる機能説明
 * - テスト用IDの付与
 *
 * @param props - コンポーネントのプロパティ
 * @returns AppBarのJSX要素
 */
export declare function AppBar(props: AppBarProps): React.JSX.Element;

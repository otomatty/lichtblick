import { PropsWithChildren } from "react";
/**
 * AppBarContainer Props - コンテナコンポーネントのプロパティ
 *
 * @interface Props
 */
type Props = PropsWithChildren<{
    /** 左側インセット（ピクセル）- システムウィンドウコントロール用の余白 */
    leftInset?: number;
    /** ダブルクリック時のイベントハンドラー（ウィンドウ最大化/復元など） */
    onDoubleClick?: () => void;
}>;
/**
 * AppBarContainer - アプリケーションバーコンテナコンポーネント
 *
 * Material-UIのAppBarをベースとしたカスタムコンテナ。
 * デスクトップアプリケーションでのウィンドウ制御機能を提供し、
 * プラットフォーム固有の動作をサポートします。
 *
 * 主な機能：
 * - ドラッグ可能なタイトルバー（WebkitAppRegion）
 * - システムウィンドウコントロール用の余白調整
 * - ダブルクリックによるウィンドウ操作
 * - 左側インセット対応（macOSのトラフィックライト用）
 *
 * @param props - コンポーネントのプロパティ
 * @returns AppBarコンテナのJSX要素
 */
export declare function AppBarContainer(props: Props): React.JSX.Element;
export {};

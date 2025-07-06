/// <reference types="react" />
import { ButtonBaseProps } from "@mui/material";
/**
 * AppBarDropdownButton Props - ドロップダウンボタンコンポーネントのプロパティ
 *
 * Material-UIのButtonBasePropsを拡張し、ドロップダウン固有のプロパティを追加。
 */
type Props = {
    /** メインタイトル（必須） */
    title: string;
    /** サブヘッダー（オプション、小さく表示される説明文） */
    subheader?: string;
    /** 選択状態（true時は選択状態のスタイルを適用） */
    selected: boolean;
    /** クリック時のイベントハンドラー */
    onClick: () => void;
} & ButtonBaseProps;
/**
 * AppBarDropdownButton - アプリケーションバー用ドロップダウンボタン
 *
 * AppBar内でドロップダウンメニューを開くためのボタンコンポーネント。
 * 階層的な情報表示（サブヘッダー + メインタイトル）と視覚的フィードバックを提供します。
 *
 * 主な特徴：
 * - 2段階の情報表示（サブヘッダー + タイトル）
 * - レスポンシブなテキスト省略（長いタイトルの場合）
 * - 選択状態の視覚的フィードバック
 * - シェブロンアイコンによるドロップダウン表示
 * - AppBarテーマとの統合されたスタイリング
 * - アクセシビリティ対応（aria-haspopup属性）
 *
 * @param props - コンポーネントのプロパティ
 * @param ref - ボタン要素への参照
 * @returns AppBarドロップダウンボタンのJSX要素
 */
declare const AppBarDropdownButton: import("react").ForwardRefExoticComponent<Omit<Props, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export { AppBarDropdownButton };

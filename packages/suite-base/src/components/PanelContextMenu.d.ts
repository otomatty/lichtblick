/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
/**
 * コンテキストメニューアイテムの型定義
 *
 * メニューに表示される項目は、クリック可能なアイテムまたは
 * 区切り線のいずれかの種類を持つ。
 */
export type PanelContextMenuItem = {
    /** クリック可能なメニュー項目の種類 */
    type: "item";
    /** 項目が無効化されているかどうか（表示されるが操作不可） */
    disabled?: boolean;
    /** メニュー項目に表示されるラベルテキスト */
    label: string;
    /** メニュー項目がクリックされた時のコールバック関数 */
    onclick: () => void;
} | {
    /** 区切り線の種類 */
    type: "divider";
};
/**
 * PanelContextMenuコンポーネントのプロパティ型定義
 */
type PanelContextMenuProps = {
    /** メニュー項目の配列を返す関数（実行時に動的に評価される） */
    getItems: () => Immutable<PanelContextMenuItem[]>;
};
/**
 * パネル用コンテキストメニューコンポーネント
 *
 * パネル内で右クリック時に表示されるコンテキストメニューを実装する。
 * Panel HOCの子コンポーネントとして使用される必要がある。
 *
 * ## 主要機能
 *
 * ### 右クリック検出
 * - マウスダウン→アップの正確な検出
 * - マウス移動によるドラッグキャンセル
 * - 誤操作防止のための状態管理
 *
 * ### メニュー表示
 * - クリック位置でのメニュー表示
 * - 動的メニュー項目生成
 * - Material-UIとの統合
 *
 * ### イベント制御
 * - デフォルトコンテキストメニューの無効化
 * - 親パネルへのイベント伝播制御
 * - 適切なクリーンアップ処理
 *
 * ## 実装詳細
 *
 * ### 右クリック状態管理
 * ```
 * "none" → "down" → "none" (正常な右クリック)
 *       ↘ "canceled" (ドラッグ検出時)
 * ```
 *
 * ### イベントフロー
 * 1. mousedown: 右クリック開始検出
 * 2. mousemove: ドラッグ検出でキャンセル
 * 3. mouseup: 右クリック完了でメニュー表示
 * 4. contextmenu: デフォルト動作の無効化
 *
 * @param props - コンポーネントプロパティ
 * @returns レンダリングされたコンテキストメニュー
 */
declare function PanelContextMenuComponent(props: PanelContextMenuProps): React.JSX.Element;
/**
 * React.memoでラップされたPanelContextMenuコンポーネント
 *
 * getItems関数の参照が変わらない限り、不要な再レンダリングを防ぐ。
 * パフォーマンス最適化のため、メモ化を適用している。
 */
export declare const PanelContextMenu: import("react").MemoExoticComponent<typeof PanelContextMenuComponent>;
export {};

/// <reference types="react" />
import { FzfResultItem } from "fzf";
import { MessagePathSearchItem } from "./getMessagePathSearchItems";
/**
 * MessagePathRow - メッセージパス表示行コンポーネント
 *
 * @description
 * このコンポーネントは、TopicListの仮想化リスト内でメッセージパス（スキーマフィールド）を
 * 表示する行コンポーネントです。ROSメッセージの内部構造（フィールド）を階層的に表示します。
 *
 * **主要機能:**
 * - 📋 メッセージパスの表示（検索ハイライト付き）
 * - 🏷️ データ型の表示（string, float64, etc.）
 * - 🖱️ ドラッグ&ドロップ対応
 * - 🎯 選択状態の視覚的表示
 * - 📱 複数選択時のバッジ表示
 * - 🌿 リーフノード（末端フィールド）の識別
 *
 * **表示例:**
 * ```
 * position.x          float64
 * position.y          float64
 * orientation.z       float64
 * header.stamp        builtin_interfaces/Time
 * ```
 *
 * **ドラッグ機能:**
 * - useMessagePathDrag フックによるドラッグ対応
 * - パネルへのドロップでチャート追加
 * - 複数選択時のアイテム数表示
 * - リーフノードのみチャート化可能
 *
 * **表示要素:**
 * - パスサフィックス（フィールド名、ハイライト付き）
 * - データ型（セカンダリテキスト）
 * - ドラッグハンドル（⋮アイコン）
 * - 複数選択バッジ
 *
 * **依存関係:**
 * - HighlightChars: 検索文字列のハイライト表示
 * - useMessagePathDrag: ドラッグ&ドロップ機能
 * - useTopicListStyles: スタイリング
 * - MessagePathSearchItem: 検索アイテム型定義
 *
 * @param props - コンポーネントのプロパティ
 * @param props.messagePathResult - FZF検索結果（メッセージパス情報 + ハイライト位置）
 * @param props.style - react-windowから渡されるスタイル
 * @param props.selected - 選択状態
 * @param props.onClick - クリックイベントハンドラー
 * @param props.onContextMenu - コンテキストメニューイベントハンドラー
 * @returns メッセージパス行のJSX要素
 */
export declare function MessagePathRow({ messagePathResult, style, selected, onClick, onContextMenu, }: {
    messagePathResult: FzfResultItem<MessagePathSearchItem>;
    style: React.CSSProperties;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    onContextMenu: React.MouseEventHandler<HTMLDivElement>;
}): React.JSX.Element;

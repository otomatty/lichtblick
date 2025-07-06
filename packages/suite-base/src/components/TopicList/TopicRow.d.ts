/// <reference types="react" />
import { FzfResultItem } from "fzf";
import { Topic } from "@lichtblick/suite-base/players/types";
/**
 * TopicRow - ROSトピック表示行コンポーネント
 *
 * @description
 * このコンポーネントは、TopicListの仮想化リスト内でROSトピックを表示する行コンポーネントです。
 * 以下の機能を提供します：
 *
 * **主要機能:**
 * - 📋 トピック名の表示（検索ハイライト付き）
 * - 🏷️ スキーマ名の表示（型情報）
 * - 📊 統計情報チップ（メッセージ数、頻度）
 * - 🔄 エイリアス表示（元のトピック名）
 * - 🖱️ ドラッグ&ドロップ対応
 * - 🎯 選択状態の視覚的表示
 * - 📱 複数選択時のバッジ表示
 *
 * **ドラッグ機能:**
 * - useMessagePathDrag フックによるドラッグ対応
 * - パネルへのドロップでチャート追加
 * - 複数選択時のアイテム数表示
 *
 * **表示要素:**
 * - トピック名（ハイライト付き）
 * - スキーマ名（型情報、セカンダリテキスト）
 * - エイリアス情報
 * - 統計チップ（TopicStatsChip）
 * - ドラッグハンドル（⋮アイコン）
 *
 * **依存関係:**
 * - HighlightChars: 検索文字列のハイライト表示
 * - TopicStatsChip: トピック統計情報の表示
 * - useMessagePathDrag: ドラッグ&ドロップ機能
 * - useTopicListStyles: スタイリング
 *
 * @param props - コンポーネントのプロパティ
 * @param props.topicResult - FZF検索結果（トピック情報 + ハイライト位置）
 * @param props.style - react-windowから渡されるスタイル
 * @param props.selected - 選択状態
 * @param props.onClick - クリックイベントハンドラー
 * @param props.onContextMenu - コンテキストメニューイベントハンドラー
 * @returns トピック行のJSX要素
 */
export declare function TopicRow({ topicResult, style, selected, onClick, onContextMenu, }: {
    topicResult: FzfResultItem<Topic>;
    style: React.CSSProperties;
    selected: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    onContextMenu: React.MouseEventHandler<HTMLDivElement>;
}): React.JSX.Element;

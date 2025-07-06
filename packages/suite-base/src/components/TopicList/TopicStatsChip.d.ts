/// <reference types="react" />
/**
 * TopicStatsChip - トピック統計情報表示チップ
 *
 * @description
 * このコンポーネントは、ROSトピックの統計情報（頻度とメッセージ数）を表示する
 * 小さなチップコンポーネントです。実際の統計データは外部の仕組みによって
 * DOM要素に直接更新されます。
 *
 * **主要機能:**
 * - 📊 トピック頻度の表示（Hz）
 * - 📈 メッセージ数の表示
 * - 📱 レスポンシブデザイン（コンテナクエリ対応）
 * - 🎨 選択状態の視覚的表示
 * - 🔢 等幅数字フォントによる整列表示
 *
 * **データ更新の仕組み:**
 * このコンポーネントは表示のみを担当し、実際の統計データは以下の仕組みで更新されます：
 * - DirectTopicStatsUpdater が定期的に統計を収集
 * - data-topic 属性を持つ要素を検索
 * - data-topic-stat 属性に基づいて適切な統計値を設定
 * - DOM操作による直接的な値更新（React外部）
 *
 * **レスポンシブ表示:**
 * - 幅 < 180px: チップ全体を非表示
 * - 幅 < 280px: 頻度のみ表示
 * - 幅 >= 280px: 頻度とメッセージ数の両方を表示
 *
 * **表示例:**
 * ```
 * [10.2 Hz | 1.2K]  // 通常表示
 * [10.2 Hz]         // 狭い幅
 * (非表示)          // 極狭い幅
 * ```
 *
 * **依存関係:**
 * - DirectTopicStatsUpdater: 統計データの定期更新
 * - Material-UI Paper: チップの外観
 * - tss-react: スタイリング
 *
 * @param props - コンポーネントのプロパティ
 * @param props.topicName - 統計を表示するトピック名（data-topic属性に設定）
 * @param props.selected - 選択状態（スタイル変更用）
 * @returns 統計情報チップのJSX要素
 */
export declare function TopicStatsChip({ topicName, selected, }: {
    topicName: string;
    selected: boolean;
}): React.JSX.Element;

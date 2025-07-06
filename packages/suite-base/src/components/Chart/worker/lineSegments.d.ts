import { ScriptableLineSegmentContext } from "chart.js";
/**
 * 線分セグメントのラベルカラーを取得する関数
 *
 * Chart.jsの線分描画時に呼び出され、各セグメントの色を動的に決定します。
 * 主に状態遷移パネルで使用され、単一の線上で異なる色のセグメントを
 * 描画する際に重要な役割を果たします。
 *
 * ## 使用場面
 * - 状態遷移の可視化（各状態で異なる色）
 * - 時系列データの条件別色分け
 * - 動的な線分カラーリング
 *
 * ## 技術的詳細
 * この関数はChart.jsのsegment.borderColor設定で使用され、
 * WebWorker内で実行されるため、関数の直列化が不可能です。
 * そのため、ChartJSManager内で直接定義される必要があります。
 *
 * @param context - Chart.jsの線分セグメントコンテキスト
 * @returns ラベルカラー文字列、または未定義
 *
 * @example
 * ```typescript
 * // Chart.jsデータセット設定での使用例
 * const dataset = {
 *   data: chartData,
 *   segment: {
 *     borderColor: lineSegmentLabelColor // この関数が各セグメントで呼び出される
 *   }
 * };
 * ```
 */
export declare function lineSegmentLabelColor(context: ScriptableLineSegmentContext): undefined | string;

import { ChartData } from "chart.js";
import { TypedChartData } from "../types";
/**
 * 型付きチャートデータを通常のチャートデータにプロキシする関数
 *
 * 型付き配列（TypedArray）形式のチャートデータを、Chart.jsが期待する
 * オブジェクト配列形式にプロキシします。大量のデータを効率的に処理
 * するための主要な変換関数です。
 *
 * ## 使用場面
 * - 大量の時系列データの可視化
 * - リアルタイムデータストリーミング
 * - メモリ効率が重要な環境
 * - WebWorkerでの高速データ処理
 *
 * ## パフォーマンス特性
 * - **メモリ効率**: データ変換を行わずプロキシで動的アクセス
 * - **処理速度**: 型付き配列の高速性を維持
 * - **遅延評価**: 必要な時のみデータポイントを計算
 *
 * ## 技術的背景
 * Chart.jsはオブジェクト配列 `[{x: 1, y: 2}, ...]` を期待しますが、
 * 大量データでは型付き配列 `{x: Float64Array, y: Float64Array}` の方が
 * メモリ効率と処理速度で優れています。この関数はその橋渡しを行います。
 *
 * @param data - 型付きチャートデータ
 * @returns Chart.js互換の通常チャートデータ
 *
 * @example
 * ```typescript
 * const typedChartData: TypedChartData = {
 *   datasets: [{
 *     label: "Sensor Data",
 *     data: [{
 *       x: new Float64Array([1, 2, 3, 4, 5]),
 *       y: new Float64Array([10, 15, 12, 18, 20])
 *     }]
 *   }]
 * };
 *
 * const normalChartData = proxyTyped(typedChartData);
 * // Chart.jsで使用可能
 * const chart = new Chart(canvas, {
 *   type: 'scatter',
 *   data: normalChartData
 * });
 * ```
 */
export declare function proxyTyped(data: TypedChartData): ChartData<"scatter">;

import { RpcScales } from "@lichtblick/suite-base/components/Chart/types";
import { ChartDatasets, PlotViewport } from "./types";
/**
 * UpdateParams - Downsampler更新パラメータ
 *
 * update()メソッドで使用される部分更新パラメータ
 */
type UpdateParams = {
    /** 処理対象のデータセット配列 */
    datasets?: ChartDatasets;
    /** ビューポート境界情報 */
    datasetBounds?: PlotViewport;
    /** 現在のチャートスケール */
    scales?: RpcScales;
};
/**
 * Downsampler - 高性能データダウンサンプリングクラス
 *
 * 大量のデータポイントを効率的にダウンサンプリングし、
 * TimeBasedChartの描画パフォーマンスを最適化します。
 * ビューポートとスケールに基づく適応的サンプリングを提供し、
 * 視覚的品質を保ちながら描画負荷を軽減します。
 *
 * ## 基本的な使用フロー
 * 1. インスタンス作成
 * 2. update()で状態更新
 * 3. downsample()で処理実行
 * 4. 結果をChart.jsに渡す
 *
 * ## 状態管理
 * - 内部状態は部分更新可能
 * - 未指定パラメータは既存値を保持
 * - 状態変更は即座に反映
 */
export declare class Downsampler {
    #private;
    /**
     * update - 内部状態の更新
     *
     * ダウンサンプリングに必要な状態を部分的に更新します。
     * 未指定のパラメータは既存の値を保持します。
     *
     * @param opt - 更新パラメータ
     *
     * ## 更新戦略
     * - **datasets**: 新しいデータセットの設定
     * - **datasetBounds**: ビューポート情報の更新
     * - **scales**: チャートスケールの変更
     *
     * ## 使用例
     * ```typescript
     * // 単一パラメータ更新
     * downsampler.update({ datasets: newData });
     *
     * // 複数パラメータ更新
     * downsampler.update({
     *   datasets: newData,
     *   scales: newScales
     * });
     * ```
     */
    update(opt: UpdateParams): void;
    /**
     * downsample - ダウンサンプリングの実行
     *
     * 現在の内部状態を使用してダウンサンプリングを実行し、
     * 最適化されたデータセットを返します。
     *
     * @returns ダウンサンプル済みデータセット、または処理不可能な場合はundefined
     *
     * ## 処理フロー
     * 1. **前提条件チェック**: 必要な状態の確認
     * 2. **ビューポート構築**: スケールから表示領域を計算
     * 3. **ポイント数計算**: データセット数に基づく分配
     * 4. **状態ベースサンプリング**: 重要ポイントの選択
     * 5. **ポイント解決**: 元データとの関連付け
     * 6. **ギャップ処理**: NaN値による線分割
     *
     * ## 戻り値の特徴
     * - 元データセットと同じ構造
     * - ダウンサンプル済みのdataプロパティ
     * - 省略箇所の明示的マーキング
     * - Chart.js互換の形式
     *
     * ## エラーハンドリング
     * - datasetBoundsが未設定の場合はundefinedを返す
     * - スケールが不完全な場合は元データを返す
     * - 個別ポイントの処理エラーは適切に処理
     */
    downsample(): ChartDatasets | undefined;
}
export {};

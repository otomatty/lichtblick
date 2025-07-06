import { Point } from "@lichtblick/suite-base/components/Chart/datasets";
import type { PlotViewport } from "./types";
/**
 * 状態遷移セグメントに対応するポイントを表現
 *
 * StatePointは状態遷移データの描画において、単一状態の間隔と
 * 複数状態の間隔を区別して表現するために使用されます。
 *
 * ## 使用パターン
 *
 * ### 単一状態間隔
 * ```typescript
 * const singleState: StatePoint = {
 *   x: 10.5,           // 実際のデータポイントのX座標
 *   index: 42,         // 元データセットでのインデックス
 *   states: undefined  // 単一状態なので未定義
 * };
 * ```
 *
 * ### 複数状態間隔
 * ```typescript
 * const multipleStates: StatePoint = {
 *   x: 15.0,                              // 間隔開始のX座標
 *   index: undefined,                     // 複数状態なので未定義
 *   states: ["IDLE", "ACTIVE", "ERROR"]   // 間隔内の全状態
 * };
 * ```
 *
 * @interface StatePoint
 */
export type StatePoint = {
    /**
     * プロット座標系でのX座標
     *
     * 単一状態の場合は実際のデータポイントのX座標、
     * 複数状態の場合は間隔の開始または終了X座標を表します。
     */
    x: number;
    /**
     * 元データセットでのポイントインデックス
     *
     * 単一状態の場合は実際のポイントインデックス、
     * 複数状態の場合は`undefined`となり、特別な描画処理が必要です。
     */
    index: number | undefined;
    /**
     * 間隔内に出現した状態のリスト
     *
     * 複数状態の間隔でのみ設定され、ツールチップや
     * 特別な描画スタイルで使用されます。
     */
    states?: string[];
};
/**
 * 状態遷移データの効率的なダウンサンプリングを実行
 *
 * 表示可能な領域を均等な間隔に分割し、各間隔内での状態遷移の
 * 数を記録します。複雑な状態変化を視覚的に区別可能な形式で
 * 表現し、パフォーマンスと情報量のバランスを取ります。
 *
 * ## アルゴリズムの詳細
 *
 * ### 間隔処理ロジック
 * 1. **単一状態間隔**: 元のポイントを保持し、通常の描画
 * 2. **複数状態間隔**: 2つのStatePointを生成
 *    - 間隔開始点（index=undefined, states配列付き）
 *    - 間隔終了点（最後のポイントのindex）
 *
 * ### 境界処理
 * - 表示領域の50%バッファを使用
 * - パン/ズーム操作での連続性を保証
 * - 境界前後のポイントを適切に処理
 *
 * ### 状態の一意性
 * - 連続する同一状態は1つのエントリとして記録
 * - 状態変化のタイミングを正確に保持
 * - 効率的な重複排除アルゴリズム
 *
 * @param points - 状態遷移ポイントのイテラブル
 * @param view - プロットの表示領域情報
 * @param maxPoints - 最大ポイント数（オプション、デフォルトは2ポイント/間隔）
 * @returns 最適化された状態遷移ポイント配列
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * const viewport = {
 *   bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 1 } },
 *   width: 800,
 *   height: 100
 * };
 *
 * const stateData = [
 *   { x: 0, y: 0, index: 0, label: "IDLE" },
 *   { x: 10, y: 1, index: 1, label: "ACTIVE" },
 *   { x: 15, y: 0, index: 2, label: "IDLE" },
 *   { x: 16, y: 1, index: 3, label: "BUSY" },
 *   { x: 17, y: 0, index: 4, label: "IDLE" },
 *   { x: 30, y: 1, index: 5, label: "ACTIVE" }
 * ];
 *
 * const result = downsampleStates(stateData, viewport);
 *
 * // 結果例:
 * // [
 * //   { x: 0, index: 0 },                              // 単一状態間隔
 * //   { x: 15, index: undefined, states: ["IDLE", "BUSY"] }, // 複数状態間隔開始
 * //   { x: 18, index: 4 },                             // 複数状態間隔終了
 * //   { x: 30, index: 5 }                              // 単一状態間隔
 * // ]
 * ```
 *
 * @example
 * ```typescript
 * // 高密度データでの使用例
 * const highDensityStates = generateStateTransitions(10000);
 * const optimized = downsampleStates(highDensityStates, viewport, 500);
 *
 * // 描画処理
 * optimized.forEach(point => {
 *   if (point.index !== undefined) {
 *     // 通常のポイントとして描画
 *     renderStatePoint(point);
 *   } else {
 *     // 複数状態間隔として特別な描画
 *     renderMultiStateInterval(point);
 *   }
 * });
 * ```
 */
export declare function downsampleStates(points: Iterable<Point>, view: PlotViewport, maxPoints?: number): StatePoint[];

/**
 * @fileoverview 時系列データダウンサンプリングシステム
 *
 * このファイルは、大量の時系列データを効率的に表示するためのダウンサンプリング機能を提供します。
 * ChartJSが60FPSで描画可能な範囲内でデータポイントを削減し、視覚的に重要な情報を保持します。
 *
 * ## 主要機能
 *
 * ### 1. 適応的ダウンサンプリング
 * - 表示領域のピクセル密度に基づいて最適なサンプリング間隔を計算
 * - 最大5,000ポイントの制限内で視覚的品質を最大化
 * - 最小3ピクセル間隔での視覚的区別性を保証
 *
 * ### 2. 統計的重要性保持
 * - 各間隔での最小値・最大値・最初・最後の値を保持
 * - データの統計的特性を維持しながら描画負荷を削減
 * - ラベル変更時の境界を適切に処理
 *
 * ### 3. ストリーミング対応
 * - 状態を保持したインクリメンタルな処理
 * - 大容量データセットの段階的処理
 * - メモリ効率的な実装
 *
 * ## アルゴリズム詳細
 *
 * ### Largest Triangle Three Buckets (LTTB) 改良版
 * - 各間隔（バケット）内で最大4つのポイントを選択
 * - 間隔の開始点、終了点、最小値、最大値を保持
 * - 視覚的に重要な変化点を優先的に保持
 *
 * ### 間隔計算アルゴリズム
 * ```
 * 間隔数 = min(最大ポイント数/4, 画面幅/3ピクセル)
 * X軸解像度 = 間隔数 / (X軸最大値 - X軸最小値)
 * Y軸解像度 = 画面高さ / (Y軸最大値 - Y軸最小値)
 * ```
 *
 * ## パフォーマンス特性
 *
 * ### 時間計算量
 * - O(n): 入力データポイント数に対して線形
 * - インクリメンタル処理により大容量データでも高速
 *
 * ### 空間計算量
 * - O(1): 固定サイズの状態のみ保持
 * - 出力サイズは最大ポイント数で制限
 *
 * ### 最適化技術
 * - Math.trunc使用による高速ピクセル計算
 * - 不要な配列コピーの回避
 * - 効率的なソート処理
 *
 * ## 使用例
 *
 * ### 基本的な使用方法
 * ```typescript
 * const viewport = { bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 50 } }, width: 800, height: 600 };
 * const indices = downsampleTimeseries(dataPoints, viewport, 1000);
 * const downsampledData = indices.map(i => originalData[i]);
 * ```
 *
 * ### ストリーミング処理
 * ```typescript
 * let state = initDownsample(viewport);
 * for (const chunk of dataChunks) {
 *   const [indices, newState] = continueDownsample(chunk, state);
 *   state = newState;
 *   processIndices(indices);
 * }
 * const finalIndices = finishDownsample(state);
 * ```
 *
 * ## 技術的注意事項
 *
 * ### ピクセル精度
 * - 3ピクセル以下の距離は視覚的に区別不可能として扱い
 * - 高DPIディスプレイでも適切に動作
 *
 * ### ラベル処理
 * - ラベル変更時には必ず境界を保持
 * - 状態遷移の可視化をサポート
 *
 * ### メモリ管理
 * - 大容量データセットでのメモリ効率を重視
 * - ガベージコレクションの負荷を最小化
 *
 * @author Lichtblick Suite Team
 * @since 2023
 * @version 2.0
 */
import { Point } from "@lichtblick/suite-base/components/Chart/datasets";
import type { PlotViewport } from "./types";
/**
 * 全プロットおよび全データソースでの目標データポイント数
 *
 * この閾値を超えると、ChartJSは60FPSでの描画が困難になります。
 * 実際のベンチマークに基づいて設定された値で、視覚的品質と
 * パフォーマンスのバランスを取ります。
 *
 * @constant {number}
 */
export declare const MAX_POINTS = 5000;
/**
 * 視覚的に区別可能な最小ピクセル距離
 *
 * この閾値内に現れるポイントは視覚的に区別できないため、
 * ダウンサンプリングの対象となります。高DPIディスプレイでも
 * 適切に動作するよう調整されています。
 *
 * @constant {number}
 */
export declare const MINIMUM_PIXEL_DISTANCE = 3;
/**
 * 間隔内のアイテムを表す内部データ構造
 *
 * ダウンサンプリング処理中に各ポイントの位置とメタデータを
 * 効率的に管理するために使用されます。
 *
 * @interface IntervalItem
 */
type IntervalItem = {
    /** ピクセル座標でのX位置 */
    xPixel: number;
    /** ピクセル座標でのY位置 */
    yPixel: number;
    /** ポイントのラベル（状態遷移用） */
    label: string | undefined;
    /** 元データセット内でのインデックス */
    index: number;
};
/**
 * 進行中のダウンサンプリング操作の状態
 *
 * ストリーミング処理において、複数のデータチャンクにわたって
 * 状態を保持するために使用されます。メモリ効率的な設計により
 * 大容量データセットでも高速に動作します。
 *
 * @interface DownsampleState
 */
export type DownsampleState = {
    /**
     * 処理済みポイント数のカーソル
     *
     * インクリメンタル処理において、新しいポイントのみが
     * 入力として渡されるため、完全なデータセットでの
     * 正確なインデックスを計算するために使用されます。
     */
    cursor: number;
    /** X軸の値1単位あたりのピクセル数 */
    pixelPerXValue: number;
    /** Y軸の値1単位あたりのピクセル数 */
    pixelPerYValue: number;
    /** 現在の間隔の最初のポイント */
    intFirst: IntervalItem | undefined;
    /** 現在の間隔の最後のポイント */
    intLast: IntervalItem | undefined;
    /** 現在の間隔の最小値ポイント */
    intMin: IntervalItem | undefined;
    /** 現在の間隔の最大値ポイント */
    intMax: IntervalItem | undefined;
};
/**
 * ダウンサンプリング操作で使用する間隔サイズを計算
 *
 * 表示領域のピクセル密度と最大ポイント数制限に基づいて、
 * 最適な間隔サイズを決定します。視覚的品質を最大化しながら
 * パフォーマンス制約を満たすよう調整されています。
 *
 * @param view - プロットの表示領域情報
 * @param pointsPerInterval - 間隔あたりのポイント数
 * @param maxPoints - 最大ポイント数（オプション）
 * @returns ピクセル密度情報
 *
 * @example
 * ```typescript
 * const viewport = {
 *   bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 50 } },
 *   width: 800,
 *   height: 600
 * };
 * const { pixelPerXValue, pixelPerYValue } = calculateIntervals(viewport, 4, 1000);
 * console.log(`X解像度: ${pixelPerXValue}, Y解像度: ${pixelPerYValue}`);
 * ```
 */
export declare function calculateIntervals(view: PlotViewport, pointsPerInterval: number, maxPoints?: number): {
    pixelPerXValue: number;
    pixelPerYValue: number;
};
/**
 * 固定ビューポートと最大ポイント数でダウンサンプリング操作を初期化
 *
 * ストリーミング処理の開始点として使用され、後続の
 * continueDownsample呼び出しで使用される状態を準備します。
 *
 * @param view - プロットの表示領域情報
 * @param maxPoints - 最大ポイント数（オプション）
 * @returns 初期化されたダウンサンプリング状態
 *
 * @example
 * ```typescript
 * const viewport = { bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 50 } }, width: 800, height: 600 };
 * const state = initDownsample(viewport, 1000);
 * // 後続のcontinueDownsample呼び出しで使用
 * ```
 */
export declare function initDownsample(view: PlotViewport, maxPoints?: number): DownsampleState;
/**
 * 最後の間隔のインデックスを計算してダウンサンプリング操作を完了
 *
 * ストリーミング処理の最終段階で呼び出され、保留中の間隔から
 * 最終的なポイントインデックスを生成します。統計的重要性を
 * 保持しながら重複を避けるよう最適化されています。
 *
 * @param state - 現在のダウンサンプリング状態
 * @returns 最終間隔から生成されたインデックス配列
 *
 * @example
 * ```typescript
 * let state = initDownsample(viewport);
 * // ... 複数のcontinueDownsample呼び出し
 * const finalIndices = finishDownsample(state);
 * ```
 */
export declare function finishDownsample(state: DownsampleState): number[];
/**
 * 提供されたポイントを消費し、インデックスと新しい状態を返す
 *
 * ストリーミング処理の中核機能で、新しいデータポイントを
 * 段階的に処理します。LTTB改良アルゴリズムにより、各間隔で
 * 統計的に重要なポイントを選択します。
 *
 * ## アルゴリズムの詳細
 *
 * 1. **間隔判定**: ピクセル座標での間隔変更を検出
 * 2. **統計計算**: 各間隔での最小・最大・最初・最後の値を追跡
 * 3. **重複排除**: 同一Y値のポイントを効率的に除外
 * 4. **ラベル処理**: 状態遷移時の境界を適切に処理
 *
 * @param points - 新しいポイントのイテラブル（既に処理済みのポイントは含まない）
 * @param state - 現在のダウンサンプリング状態
 * @returns [生成されたインデックス配列, 更新された状態]
 *
 * @example
 * ```typescript
 * let state = initDownsample(viewport);
 * const dataChunks = [chunk1, chunk2, chunk3];
 *
 * for (const chunk of dataChunks) {
 *   const [indices, newState] = continueDownsample(chunk, state);
 *   state = newState;
 *
 *   // 生成されたインデックスを処理
 *   const selectedPoints = indices.map(i => originalData[i]);
 *   renderPoints(selectedPoints);
 * }
 * ```
 */
export declare function continueDownsample(points: Iterable<Point>, state: DownsampleState): [number[], DownsampleState];
/**
 * 時系列データの完全なダウンサンプリングを実行
 *
 * 単一の呼び出しで完全なダウンサンプリング処理を実行する
 * 便利な関数です。内部的にはinit/continue/finishのフローを
 * 実行しますが、ストリーミング処理が不要な場合に使用します。
 *
 * @param points - ダウンサンプリングするポイントのイテラブル
 * @param view - プロットの表示領域情報
 * @param maxPoints - 最大ポイント数（オプション）
 * @returns 選択されたポイントのインデックス配列
 *
 * @example
 * ```typescript
 * const viewport = { bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 50 } }, width: 800, height: 600 };
 * const allPoints = generateTimeSeriesData(10000);
 * const indices = downsampleTimeseries(allPoints, viewport, 1000);
 * const optimizedData = indices.map(i => allPoints[i]);
 * ```
 */
export declare function downsampleTimeseries(points: Iterable<Point>, view: PlotViewport, maxPoints?: number): number[];
/**
 * 散布図データの特殊なダウンサンプリングを実行
 *
 * 散布図では時系列データとは異なるダウンサンプリング戦略を
 * 使用します。各ピクセル領域で最初に現れるポイントのみを
 * 保持し、視覚的な密度を制御します。
 *
 * @param points - ダウンサンプリングする散布図ポイント
 * @param view - プロットの表示領域情報
 * @returns 選択されたポイントのインデックス配列
 *
 * @example
 * ```typescript
 * const viewport = { bounds: { x: { min: 0, max: 100 }, y: { min: 0, max: 50 } }, width: 800, height: 600 };
 * const scatterPoints = generateScatterData(5000);
 * const indices = downsampleScatter(scatterPoints, viewport);
 * const optimizedScatter = indices.map(i => scatterPoints[i]);
 * ```
 */
export declare function downsampleScatter(points: Iterable<Point>, view: PlotViewport): number[];
export {};

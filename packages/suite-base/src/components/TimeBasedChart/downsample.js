// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * 全プロットおよび全データソースでの目標データポイント数
 *
 * この閾値を超えると、ChartJSは60FPSでの描画が困難になります。
 * 実際のベンチマークに基づいて設定された値で、視覚的品質と
 * パフォーマンスのバランスを取ります。
 *
 * @constant {number}
 */
export const MAX_POINTS = 5000;
/**
 * 各間隔で生成可能な最大ポイント数
 *
 * LTTB（Largest Triangle Three Buckets）アルゴリズムの改良版では、
 * 各間隔で最大4つのポイント（開始、終了、最小、最大）を保持します。
 *
 * @constant {number}
 */
const POINTS_PER_INTERVAL = 4;
/**
 * 視覚的に区別可能な最小ピクセル距離
 *
 * この閾値内に現れるポイントは視覚的に区別できないため、
 * ダウンサンプリングの対象となります。高DPIディスプレイでも
 * 適切に動作するよう調整されています。
 *
 * @constant {number}
 */
export const MINIMUM_PIXEL_DISTANCE = 3;
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
export function calculateIntervals(view, pointsPerInterval, maxPoints) {
    const { bounds, width, height } = view;
    const numPixelIntervals = Math.trunc(width / MINIMUM_PIXEL_DISTANCE);
    // When maxPoints is provided, we should take either that constant or
    // the number of pixel-defined intervals, whichever is fewer
    const numPoints = Math.min(maxPoints ?? numPixelIntervals * pointsPerInterval, numPixelIntervals * pointsPerInterval);
    // We then calculate the number of intervals based on the number of points we
    // decided on
    const numIntervals = Math.trunc(numPoints / pointsPerInterval);
    return {
        pixelPerXValue: numIntervals / (bounds.x.max - bounds.x.min),
        pixelPerYValue: height / (bounds.y.max - bounds.y.min),
    };
}
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
export function initDownsample(view, maxPoints) {
    const { pixelPerXValue, pixelPerYValue } = calculateIntervals(view, POINTS_PER_INTERVAL, maxPoints);
    return {
        pixelPerXValue,
        pixelPerYValue,
        cursor: 0,
        intFirst: undefined,
        intLast: undefined,
        intMin: undefined,
        intMax: undefined,
    };
}
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
export function finishDownsample(state) {
    const indices = [];
    const { intMin, intMax, intLast, intFirst } = state;
    // add the min value from previous interval if it doesn't match the first or last of that interval
    if (intMin && intMin.yPixel !== intFirst?.yPixel && intMin.yPixel !== intLast?.yPixel) {
        indices.push(intMin.index);
    }
    // add the max value from previous interval if it doesn't match the first or last of that interval
    if (intMax && intMax.yPixel !== intFirst?.yPixel && intMax.yPixel !== intLast?.yPixel) {
        indices.push(intMax.index);
    }
    // add the last value if it doesn't match the first
    if (intLast && intFirst?.yPixel !== intLast.yPixel) {
        indices.push(intLast.index);
    }
    // Ensure that the indices are in the same order they appeared in the dataset
    return indices.sort((a, b) => a - b);
}
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
export function continueDownsample(points, state) {
    const { pixelPerXValue, pixelPerYValue, cursor } = state;
    let { intFirst, intLast, intMin, intMax } = state;
    const indices = [];
    let numPoints = 0;
    for (const datum of points) {
        const { index: relativeIndex, label } = datum;
        const index = cursor + relativeIndex;
        numPoints++;
        // Benchmarking shows, at least as of the time of this writing, that Math.trunc is
        // *much* faster than Math.round on this data.
        const x = Math.trunc(datum.x * pixelPerXValue);
        const y = Math.trunc(datum.y * pixelPerYValue);
        // interval has ended, we determine whether to write additional points for min/max/last. Always
        // create a new interval when encountering a new label to preserve the transition from one label to another
        if (intFirst?.xPixel !== x || (intLast?.label != undefined && intLast.label !== datum.label)) {
            // add the min value from previous interval if it doesn't match the first or last of that interval
            const newPoints = [];
            if (intMin && intMin.yPixel !== intFirst?.yPixel && intMin.yPixel !== intLast?.yPixel) {
                newPoints.push(intMin.index);
            }
            // add the max value from previous interval if it doesn't match the first or last of that interval
            if (intMax && intMax.yPixel !== intFirst?.yPixel && intMax.yPixel !== intLast?.yPixel) {
                newPoints.push(intMax.index);
            }
            // add the last value if it doesn't match the first
            if (intLast && intFirst?.yPixel !== intLast.yPixel) {
                newPoints.push(intLast.index);
            }
            // always add the first datum of an new interval
            newPoints.push(index);
            indices.push(...newPoints.sort((a, b) => a - b));
            intFirst = { xPixel: x, yPixel: y, index, label };
            intLast = { xPixel: x, yPixel: y, index, label };
            intMin = { xPixel: x, yPixel: y, index, label };
            intMax = { xPixel: x, yPixel: y, index, label };
            continue;
        }
        intLast ??= { xPixel: x, yPixel: y, index, label };
        intLast.xPixel = x;
        intLast.yPixel = y;
        intLast.index = index;
        intLast.label = label;
        if (intMin && y < intMin.yPixel) {
            intMin.yPixel = y;
            intMin.index = index;
            intMin.label = label;
        }
        if (intMax && y > intMax.yPixel) {
            intMax.yPixel = y;
            intMax.index = index;
            intMax.label = label;
        }
    }
    return [
        indices,
        {
            ...state,
            cursor: cursor + numPoints,
            intFirst,
            intLast,
            intMin,
            intMax,
        },
    ];
}
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
export function downsampleTimeseries(points, view, maxPoints) {
    const state = initDownsample(view, maxPoints);
    const [indices, finalState] = continueDownsample(points, state);
    const lastIndices = finishDownsample(finalState);
    return [...indices, ...lastIndices];
}
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
export function downsampleScatter(points, view) {
    const { bounds, width, height } = view;
    const pixelPerXValue = width / (bounds.x.max - bounds.x.min);
    const pixelPerYValue = height / (bounds.y.max - bounds.y.min);
    const indices = [];
    const seen = new Set();
    for (const datum of points) {
        const { index } = datum;
        const x = Math.trunc(datum.x * pixelPerXValue);
        const y = Math.trunc(datum.y * pixelPerYValue);
        const key = `${x},${y}`;
        if (!seen.has(key)) {
            seen.add(key);
            indices.push(index);
        }
    }
    return indices;
}

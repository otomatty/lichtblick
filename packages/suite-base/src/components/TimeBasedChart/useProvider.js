// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as R from "ramda";
import { useEffect, useMemo, useCallback } from "react";
import { iterateObjects, iterateTyped } from "@lichtblick/suite-base/components/Chart/datasets";
/**
 * getBounds - オブジェクト形式データの境界計算
 *
 * ObjectData形式のデータセットから、X軸・Y軸の最小値・最大値を計算します。
 * NaN値は自動的に除外され、有効な数値のみが境界計算に使用されます。
 *
 * @param data - オブジェクト形式のデータセット配列
 * @returns 計算された境界、または有効なデータが存在しない場合はundefined
 *
 * ## 特徴
 * - **NaN耐性**: 無効な値を自動的にスキップ
 * - **効率的イテレーション**: iterateObjects使用による最適化
 * - **安全な初期化**: undefinedチェックによる堅牢性
 * - **数値精度**: Math.min/maxによる正確な計算
 */
export function getBounds(data) {
    let xMin;
    let xMax;
    let yMin;
    let yMax;
    for (const dataset of data) {
        for (const item of iterateObjects(dataset.data)) {
            if (!isNaN(item.x)) {
                xMin = Math.min(xMin ?? item.x, item.x);
                xMax = Math.max(xMax ?? item.x, item.x);
            }
            if (!isNaN(item.y)) {
                yMin = Math.min(yMin ?? item.y, item.y);
                yMax = Math.max(yMax ?? item.y, item.y);
            }
        }
    }
    if (xMin == undefined || xMax == undefined || yMin == undefined || yMax == undefined) {
        return undefined;
    }
    return { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } };
}
/**
 * getTypedBounds - 型付きデータの境界計算
 *
 * TypedData[]形式のデータセットから、X軸・Y軸の最小値・最大値を計算します。
 * getBounds関数の型付きデータ版で、同様のNaN耐性と効率性を提供します。
 *
 * @param data - 型付きデータセット配列
 * @returns 計算された境界、または有効なデータが存在しない場合はundefined
 *
 * ## getBoundsとの違い
 * - **データ形式**: TypedData[]配列を処理
 * - **イテレーター**: iterateTyped使用
 * - **型安全性**: より厳密な型チェック
 * - **パフォーマンス**: 型付きデータに最適化
 */
export function getTypedBounds(data) {
    let xMin;
    let xMax;
    let yMin;
    let yMax;
    for (const dataset of data) {
        for (const item of iterateTyped(dataset.data)) {
            const { x, y } = item;
            if (!isNaN(x)) {
                xMin = Math.min(xMin ?? x, x);
                xMax = Math.max(xMax ?? x, x);
            }
            if (!isNaN(y)) {
                yMin = Math.min(yMin ?? y, y);
                yMax = Math.max(yMax ?? y, y);
            }
        }
    }
    if (xMin == undefined || xMax == undefined || yMin == undefined || yMax == undefined) {
        return undefined;
    }
    return { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } };
}
/**
 * mergeBounds - 境界の統合
 *
 * 2つの境界オブジェクトを統合し、両方を包含する最小の境界を返します。
 * 複数のデータセットや部分的な更新を統合する際に使用されます。
 *
 * @param a - 最初の境界
 * @param b - 2番目の境界
 * @returns 統合された境界
 */
function mergeBounds(a, b) {
    return {
        x: {
            min: Math.min(a.x.min, b.x.min),
            max: Math.max(a.x.max, b.x.max),
        },
        y: {
            min: Math.min(a.y.min, b.y.min),
            max: Math.max(a.y.max, b.y.max),
        },
    };
}
/**
 * makeMerge - データマージ関数ファクトリー
 *
 * 特定のデータ型に対するマージ戦略を受け取り、
 * ProviderState同士をマージする関数を生成します。
 * 高階関数パターンによる柔軟なマージ戦略の実装です。
 *
 * @param mergeData - データ配列のマージ関数
 * @returns ProviderStateマージ関数
 *
 * ## 使用例
 * ```typescript
 * const mergeNormal = makeMerge<ObjectData>((a, b) => [...a, ...b]);
 * const mergeTyped = makeMerge<TypedData[]>((a, b) => a.concat(b));
 * ```
 */
const makeMerge = (mergeData) => (a, b) => {
    return {
        bounds: mergeBounds(a.bounds, b.bounds),
        data: {
            datasets: R.zip(a.data.datasets, b.data.datasets).map(([aSet, bSet]) => ({
                ...aSet,
                data: mergeData(aSet.data, bSet.data),
            })),
        },
    };
};
/** オブジェクト形式データ用のマージ関数 */
export const mergeNormal = makeMerge((a, b) => [...a, ...b]);
/** 型付きデータ用のマージ関数 */
export const mergeTyped = makeMerge((a, b) => a.concat(b));
/**
 * useProvider - データプロバイダー統合フック
 *
 * 静的データと動的プロバイダーを統一的に扱い、
 * ビューポート連動とリアルタイム更新を提供するReactフック
 *
 * @param view - 現在のビューポート情報
 * @param getDatasetBounds - データセット境界計算関数
 * @param mergeState - 状態マージ関数
 * @param data - 静的データ（オプション）
 * @param provider - 動的プロバイダー（オプション）
 * @returns 統合されたプロバイダー状態
 *
 * ## 動作モード
 *
 * ### 静的データモード
 * - dataが指定され、providerがundefinedの場合
 * - 一度だけ境界計算を実行
 * - 更新なし、固定データ
 *
 * ### 動的プロバイダーモード
 * - providerが指定され、dataがundefinedの場合
 * - ビューポート変更を自動通知
 * - setFull/addPartialによる段階的更新
 *
 * ## 状態管理の特徴
 * - **React.useState**: 内部状態管理
 * - **useCallback**: 更新関数のメモ化
 * - **useEffect**: プロバイダー登録・ビュー通知
 * - **useMemo**: 最終状態の計算最適化
 */
export default function useProvider(view, getDatasetBounds, mergeState, data, provider) {
    const [state, setState] = React.useState();
    /** 完全データ更新コールバック */
    const setFull = React.useCallback((newFull) => {
        setState({
            full: newFull,
            partial: undefined,
        });
    }, []);
    /** 部分データ追加コールバック */
    const addPartial = useCallback((newPartial) => {
        setState((oldState) => {
            if (oldState == undefined) {
                return {
                    full: undefined,
                    partial: newPartial,
                };
            }
            const { partial: oldPartial } = oldState;
            return {
                ...oldState,
                partial: oldPartial != undefined ? mergeState(oldPartial, newPartial) : newPartial,
            };
        });
    }, [mergeState]);
    // プロバイダー登録エフェクト
    useEffect(() => {
        if (provider == undefined) {
            return;
        }
        provider.register(setFull, addPartial);
    }, [provider, addPartial, setFull]);
    // ビューポート通知エフェクト
    useEffect(() => {
        if (provider == undefined) {
            return;
        }
        provider.setView(view);
    }, [provider, view]);
    // 最終状態の計算
    return useMemo(() => {
        // 動的プロバイダーモード
        if (provider != undefined) {
            if (state == undefined) {
                return undefined;
            }
            const { full, partial } = state;
            if (partial == undefined) {
                return full;
            }
            if (full == undefined) {
                return undefined;
            }
            return mergeState(full, partial);
        }
        // 静的データモード
        if (data == undefined) {
            return undefined;
        }
        const bounds = getDatasetBounds(data.datasets);
        return {
            bounds: bounds ?? {
                x: { min: 0, max: 0 },
                y: { min: 0, max: 0 },
            },
            data,
        };
    }, [data, provider, state, getDatasetBounds, mergeState]);
}

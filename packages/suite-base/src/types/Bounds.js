// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * 2つの1次元境界値の和集合を計算
 *
 * @description 2つの1次元境界値を統合し、両方を含む最小の境界値を返します。
 * データの範囲を動的に拡張する際に使用されます。
 *
 * @param a - 最初の境界値
 * @param b - 2番目の境界値
 * @returns 両方の境界値を含む統合された境界値
 *
 * @example
 * ```typescript
 * const range1: Bounds1D = { min: 0, max: 10 };
 * const range2: Bounds1D = { min: 5, max: 15 };
 *
 * const combined = unionBounds1D(range1, range2);
 * // 結果: { min: 0, max: 15 }
 *
 * const range3: Bounds1D = { min: -5, max: 3 };
 * const combined2 = unionBounds1D(combined, range3);
 * // 結果: { min: -5, max: 15 }
 * ```
 */
export function unionBounds1D(a, b) {
    return { min: Math.min(a.min, b.min), max: Math.max(a.max, b.max) };
}
/**
 * 境界値を指定した値を含むように拡張
 *
 * @description 既存の境界値を、指定した値を含むように拡張します。
 * 境界値オブジェクトは直接変更され、同じオブジェクトが返されます。
 *
 * @param bounds - 拡張対象の境界値（直接変更される）
 * @param value - 境界値に含めたい値
 *
 * @example
 * ```typescript
 * const bounds: Bounds1D = { min: 5, max: 10 };
 *
 * // 小さい値で拡張
 * extendBounds1D(bounds, 2);
 * // bounds は { min: 2, max: 10 } になる
 *
 * // 大きい値で拡張
 * extendBounds1D(bounds, 15);
 * // bounds は { min: 2, max: 15 } になる
 *
 * // 範囲内の値では変更されない
 * extendBounds1D(bounds, 8);
 * // bounds は { min: 2, max: 15 } のまま
 * ```
 *
 * @note この関数は境界値オブジェクトを直接変更します（ミューテーション）
 */
export function extendBounds1D(bounds, value) {
    bounds.min = Math.min(bounds.min, value);
    bounds.max = Math.max(bounds.max, value);
}

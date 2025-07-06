// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview TypedArray 型判定ユーティリティ
 *
 * このファイルは、JavaScriptのTypedArrayの型判定を行うための
 * 型定義とユーティリティ関数を提供します。
 *
 * バイナリデータの処理、センサーデータの解析、
 * 高性能な数値計算などで使用されます。
 */
import * as _ from "lodash-es";
/**
 * 値がTypedArrayかどうかを判定する型ガード関数
 *
 * @description 与えられた値がTypedArrayのいずれかの型であるかを判定します。
 * TypeScriptの型ガード機能により、判定後は適切な型として扱われます。
 *
 * @param value - 判定対象の値
 * @returns 値がTypedArrayの場合はtrue、そうでなければfalse
 *
 * @example
 * ```typescript
 * const data = new Float32Array([1.0, 2.0, 3.0]);
 * const regularArray = [1, 2, 3];
 *
 * if (isTypedArray(data)) {
 *   // この時点で data は TypedArray 型として扱われる
 *   console.log(`バイト長: ${data.byteLength}`);
 * }
 *
 * if (isTypedArray(regularArray)) {
 *   // false なので、このブロックは実行されない
 * }
 * ```
 *
 * @note 内部的にはlodash-esのisTypedArray関数を使用しています
 */
export function isTypedArray(value) {
    return _.isTypedArray(value);
}

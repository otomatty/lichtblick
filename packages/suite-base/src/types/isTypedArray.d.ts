/**
 * すべてのTypedArray型の統合型
 *
 * @description JavaScriptで利用可能なすべてのTypedArray型を統合したユニオン型。
 *
 * 含まれる型:
 * - Int8Array: 8ビット符号付き整数配列
 * - Uint8Array: 8ビット符号なし整数配列
 * - Int16Array: 16ビット符号付き整数配列
 * - Uint16Array: 16ビット符号なし整数配列
 * - Int32Array: 32ビット符号付き整数配列
 * - Uint32Array: 32ビット符号なし整数配列
 * - Float32Array: 32ビット浮動小数点数配列
 * - Float64Array: 64ビット浮動小数点数配列
 * - BigInt64Array: 64ビット符号付きBigInt配列
 * - BigUint64Array: 64ビット符号なしBigInt配列
 * - Uint8ClampedArray: 8ビット符号なし整数配列（クランプ付き）
 *
 * @example
 * ```typescript
 * function processTypedArray(data: TypedArray) {
 *   console.log(`配列長: ${data.length}`);
 *   console.log(`バイト長: ${data.byteLength}`);
 * }
 * ```
 */
type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array | Uint8ClampedArray;
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
export declare function isTypedArray(value: unknown): value is TypedArray;
export {};

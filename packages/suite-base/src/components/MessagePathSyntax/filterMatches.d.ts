import { MessagePathFilter } from "@lichtblick/message-path";
import { Immutable } from "@lichtblick/suite";
/**
 * メッセージパスフィルタの条件評価を行う関数
 *
 * 指定されたフィルタ条件と値を比較し、フィルタ条件にマッチするかどうかを判定します。
 * ROSメッセージの複雑なネストされたオブジェクト構造に対して、
 * パス指定による値の取得と比較演算子による条件評価を実行します。
 *
 * @param filter - 評価するフィルタ条件（イミュータブル）
 *                 - path: 値を取得するためのオブジェクトパス
 *                 - operator: 比較演算子（==, !=, >=, <=, >, <）
 *                 - value: 比較対象の値（グローバル変数が解決済みである必要がある）
 * @param value - 評価対象の値（通常はROSメッセージオブジェクト）
 * @returns フィルタ条件にマッチする場合はtrue、そうでなければfalse
 *
 * @throws {Error} フィルタ値がオブジェクト型の場合（グローバル変数が未解決）
 *
 * @example
 * ```typescript
 * const filter = {
 *   path: ["pose", "x"],
 *   operator: ">",
 *   value: 10.0
 * };
 * const message = { pose: { x: 15.0, y: 20.0 } };
 * const result = filterMatches(filter, message); // true
 * ```
 *
 * @example
 * ```typescript
 * // 配列要素のフィルタリング
 * const filter = {
 *   path: ["items", "0", "id"],
 *   operator: "==",
 *   value: 42
 * };
 * const message = { items: [{ id: 42, name: "test" }] };
 * const result = filterMatches(filter, message); // true
 * ```
 */
export declare function filterMatches(filter: Immutable<MessagePathFilter>, value: unknown): boolean;

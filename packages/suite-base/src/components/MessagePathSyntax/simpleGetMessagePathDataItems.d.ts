import { MessagePath } from "@lichtblick/message-path";
import { Immutable } from "@lichtblick/suite";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
/**
 * 指定されたメッセージパスを実行してメッセージからアイテムを抽出する関数
 *
 * ROSメッセージに対してメッセージパス（トピック名 + メッセージパス）を適用し、
 * 条件に合致するデータ項目を抽出します。複雑なネストされたオブジェクト構造、
 * 配列のスライス、フィルタ条件、プロパティアクセスを組み合わせた
 * 高度なデータ抽出を可能にします。
 *
 * サポートされるメッセージパス要素：
 * - name: オブジェクトプロパティへのアクセス（例：.pose.x）
 * - slice: 配列の範囲指定（例：[0:5]、[10]）
 * - filter: 条件フィルタ（例：{id==42}）
 *
 * @param message - 処理対象のメッセージイベント（イミュータブル）
 * @param filledInPath - 実行するメッセージパス（グローバル変数が解決済み）
 * @returns 抽出されたデータ項目の配列。条件に合致するアイテムが見つからない場合は空配列
 *
 * @throws {Error} スライス内に未解決の変数が含まれている場合
 *
 * @example
 * ```typescript
 * // 基本的なプロパティアクセス
 * const message = {
 *   topic: "/robot/pose",
 *   message: { pose: { x: 10.5, y: 20.3 } }
 * };
 * const path = {
 *   topicName: "/robot/pose",
 *   messagePath: [{ type: "name", name: "pose" }, { type: "name", name: "x" }]
 * };
 * const result = simpleGetMessagePathDataItems(message, path); // [10.5]
 * ```
 *
 * @example
 * ```typescript
 * // 配列スライスとフィルタの組み合わせ
 * const message = {
 *   topic: "/robot/sensors",
 *   message: {
 *     sensors: [
 *       { id: 1, value: 100 },
 *       { id: 2, value: 200 },
 *       { id: 3, value: 300 }
 *     ]
 *   }
 * };
 * const path = {
 *   topicName: "/robot/sensors",
 *   messagePath: [
 *     { type: "name", name: "sensors" },
 *     { type: "slice", start: 0, end: 2 },
 *     { type: "filter", path: ["id"], operator: ">=", value: 2 },
 *     { type: "name", name: "value" }
 *   ]
 * };
 * const result = simpleGetMessagePathDataItems(message, path); // [200]
 * ```
 */
export declare function simpleGetMessagePathDataItems(message: Immutable<MessageEvent>, filledInPath: Immutable<MessagePath>): unknown[];

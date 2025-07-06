import { MessagePath } from "@lichtblick/message-path";
import { Immutable } from "@lichtblick/suite";
/**
 * メッセージパスの文字列表現を生成する関数
 *
 * MessagePathオブジェクトを人間が読みやすい文字列形式に変換します。
 * ROSメッセージパスの標準的な記法に従い、トピック名、メッセージパス、
 * 修飾子を組み合わせた完全な文字列を生成します。
 *
 * 生成される文字列の形式：
 * - トピック名 + メッセージパス + 修飾子（オプション）
 * - 例："/robot/pose.pose.x.@derivative"
 *
 * @param path - 文字列化するメッセージパス（イミュータブル）
 * @returns メッセージパスの文字列表現
 *
 * @example
 * ```typescript
 * const path = {
 *   topicNameRepr: "/robot/pose",
 *   messagePath: [
 *     { type: "name", repr: "pose" },
 *     { type: "name", repr: "x" }
 *   ],
 *   modifier: "derivative"
 * };
 * const result = stringifyMessagePath(path); // "/robot/pose.pose.x.@derivative"
 * ```
 *
 * @example
 * ```typescript
 * // フィルタとスライスを含む複雑なパス
 * const path = {
 *   topicNameRepr: "/sensors/data",
 *   messagePath: [
 *     { type: "name", repr: "sensors" },
 *     { type: "slice", start: 0, end: 5 },
 *     { type: "filter", path: ["id"], operator: "==", value: 42 },
 *     { type: "name", repr: "value" }
 *   ]
 * };
 * const result = stringifyMessagePath(path); // "/sensors/data.sensors[0:5]{id==42}.value"
 * ```
 */
export declare function stringifyMessagePath(path: Immutable<MessagePath>): string;

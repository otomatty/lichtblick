import { MessagePathStructureItemMessage, MessagePath } from "@lichtblick/message-path";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { MessageEvent, Topic } from "@lichtblick/suite-base/players/types";
import { enumValuesByDatatypeAndField } from "@lichtblick/suite-base/util/enums";
/**
 * メッセージパスから抽出されたデータ項目の型定義
 *
 * メッセージパスクエリの結果として返される個別のデータ項目を表現します。
 * 値、パス、定数名（該当する場合）の情報を含みます。
 */
export type MessagePathDataItem = {
    /** 実際の値 */
    value: unknown;
    /** この値にアクセスするためのパス。可能な限り `[:]{some_id==123}` のような「わかりやすいID」を使用 */
    path: string;
    /** 値が一致する定数の名前（該当する場合） */
    constantName?: string;
};
/**
 * メッセージパスのキャッシュされたデータ項目取得フック
 *
 * 指定されたメッセージパスのセットに対して、単一のパスとメッセージを
 * `MessagePathDataItem`オブジェクトの配列に解決する関数を返します。
 *
 * 主な特徴：
 * - パフォーマンス最適化のため、結果をキャッシュ
 * - トピック/データ型/グローバル変数が変更されない限り、配列とオブジェクトは参照で同じ
 * - 関連するトピックとデータ型のみを処理対象として絞り込み
 * - グローバル変数の解決と埋め込み
 *
 * @param paths - キャッシュするメッセージパスの配列
 * @returns パスと メッセージを受け取り、MessagePathDataItem配列を返す関数
 *
 * @example
 * ```typescript
 * const paths = ["/robot/pose.pose.x", "/sensors/data[0].value"];
 * const getDataItems = useCachedGetMessagePathDataItems(paths);
 *
 * // 使用時
 * const message = { topic: "/robot/pose", message: { pose: { x: 10.5 } } };
 * const dataItems = getDataItems("/robot/pose.pose.x", message);
 * // [{ value: 10.5, path: "/robot/pose.pose.x", constantName: undefined }]
 * ```
 */
export declare function useCachedGetMessagePathDataItems(paths: readonly string[]): (path: string, message: MessageEvent) => MessagePathDataItem[] | undefined;
/**
 * メッセージパス内のグローバル変数を実際の値で埋め込む関数
 *
 * メッセージパスに含まれるグローバル変数参照を、現在のグローバル変数の値で置き換えます。
 * スライスのstart/endやフィルタの値に含まれる変数参照を処理します。
 *
 * @param rosPath - グローバル変数を含む可能性のあるメッセージパス
 * @param globalVariables - 現在のグローバル変数の値
 * @returns グローバル変数が解決されたメッセージパス
 *
 * @example
 * ```typescript
 * const path = {
 *   messagePath: [
 *     { type: "slice", start: { variableName: "startIdx" }, end: 10 },
 *     { type: "filter", value: { variableName: "targetId" } }
 *   ]
 * };
 * const variables = { startIdx: 5, targetId: 42 };
 * const filledPath = fillInGlobalVariablesInPath(path, variables);
 * // { messagePath: [{ type: "slice", start: 5, end: 10 }, { type: "filter", value: 42 }] }
 * ```
 */
export declare function fillInGlobalVariablesInPath(rosPath: MessagePath, globalVariables: GlobalVariables): MessagePath;
/**
 * メッセージパスからデータ項目を抽出する関数
 *
 * 指定されたメッセージとメッセージパスから、条件に合致するデータ項目を抽出します。
 * 複雑なネストされたオブジェクト構造、配列のスライス、フィルタ条件を処理し、
 * 適切なパス表現と定数名の解決を行います。
 *
 * @param message - 処理対象のメッセージイベント
 * @param filledInPath - グローバル変数が解決済みのメッセージパス
 * @param topicsByName - トピック名でインデックスされたトピック情報
 * @param structures - データ型の構造情報
 * @param enumValues - 列挙値のマッピング
 * @returns 抽出されたデータ項目の配列、または該当なしの場合はundefined
 *
 * @example
 * ```typescript
 * const message = { topic: "/robot/pose", message: { pose: { x: 10.5 } } };
 * const path = { topicName: "/robot/pose", messagePath: [{ type: "name", name: "pose" }] };
 * const topics = { "/robot/pose": { name: "/robot/pose", schemaName: "geometry_msgs/Pose" } };
 * const result = getMessagePathDataItems(message, path, topics, structures, enumValues);
 * ```
 */
export declare function getMessagePathDataItems(message: MessageEvent, filledInPath: MessagePath, topicsByName: Record<string, Topic>, structures: Record<string, MessagePathStructureItemMessage>, enumValues: ReturnType<typeof enumValuesByDatatypeAndField>): MessagePathDataItem[] | undefined;
/**
 * メッセージイベントとクエリされたデータのペア
 */
export type MessageAndData = {
    messageEvent: MessageEvent;
    queriedData: MessagePathDataItem[];
};
/**
 * パスごとのメッセージデータ項目のマッピング型
 */
export type MessageDataItemsByPath = {
    readonly [key: string]: readonly MessageAndData[];
};
/**
 * トピック別メッセージからメッセージパスをデコードするフック
 *
 * 指定されたパスのセットに対して、トピック別にグループ化されたメッセージから
 * メッセージパスデータ項目を抽出する関数を返します。
 *
 * @param paths - 処理するメッセージパスの配列
 * @returns トピック別メッセージマップを受け取り、パス別データ項目マップを返す関数
 *
 * @example
 * ```typescript
 * const paths = ["/robot/pose.pose.x", "/sensors/data[0].value"];
 * const decodeMessages = useDecodeMessagePathsForMessagesByTopic(paths);
 *
 * const messagesByTopic = {
 *   "/robot/pose": [{ topic: "/robot/pose", message: { pose: { x: 10.5 } } }],
 *   "/sensors/data": [{ topic: "/sensors/data", message: { data: [{ value: 42 }] } }]
 * };
 *
 * const result = decodeMessages(messagesByTopic);
 * // {
 * //   "/robot/pose.pose.x": [{ messageEvent: ..., queriedData: [{ value: 10.5, path: ... }] }],
 * //   "/sensors/data[0].value": [{ messageEvent: ..., queriedData: [{ value: 42, path: ... }] }]
 * // }
 * ```
 */
export declare function useDecodeMessagePathsForMessagesByTopic(paths: readonly string[]): (messagesByTopic: {
    [topicName: string]: readonly MessageEvent[];
}) => MessageDataItemsByPath;

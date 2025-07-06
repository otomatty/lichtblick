import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { MessageAndData } from "./useCachedGetMessagePathDataItems";
/**
 * useMessageDataItemフックのオプション設定
 */
type Options = {
    /** 保持する履歴サイズ（マッチしたメッセージの数） */
    historySize: number;
};
/**
 * メッセージリデューサーの状態型定義
 *
 * useMessageDataItemフックの内部状態を表現します。
 * マッチしたメッセージの履歴、最新のメッセージイベント、使用されたパスを保持します。
 */
type ReducedValue = {
    /** マッチしたメッセージ（イベント）の配列。最も古いメッセージが最初 */
    matches: MessageAndData[];
    /** addMessagesに受信された最新のメッセージイベントセット */
    messageEvents: readonly Readonly<MessageEvent>[];
    /** これらのメッセージをマッチするために使用されたパス */
    path: string;
};
/**
 * 指定されたメッセージパスにマッチするメッセージのデータ項目を取得するフック
 *
 * 指定されたメッセージパスに対してマッチするメッセージの配列を返します。
 * 配列の最初の項目が最も古いマッチしたメッセージで、最後の項目が最新のものです。
 *
 * 主な特徴：
 * - リアルタイムでメッセージをフィルタリングし、パスにマッチするもののみを保持
 * - 設定可能な履歴サイズによるメモリ効率的な運用
 * - メッセージリデューサーを使用した効率的な状態管理
 * - パスの変更時の自動的な再フィルタリング
 *
 * @param path - マッチング対象のメッセージパス
 * @param options - オプション設定（historySize等）
 * @returns マッチしたメッセージとデータのペア配列（古いものから順）
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * const matches = useMessageDataItem("/robot/pose.pose.x");
 * // 最新のマッチしたメッセージのみを取得
 *
 * // 履歴サイズを指定した使用例
 * const matches = useMessageDataItem("/sensors/data[0].value", { historySize: 10 });
 * // 最大10個のマッチしたメッセージを保持
 *
 * // 結果の使用例
 * if (matches.length > 0) {
 *   const latestMatch = matches[matches.length - 1];
 *   console.log("Latest value:", latestMatch.queriedData[0]?.value);
 *   console.log("Message timestamp:", latestMatch.messageEvent.receiveTime);
 * }
 * ```
 */
export declare function useMessageDataItem(path: string, options?: Options): ReducedValue["matches"];
export {};

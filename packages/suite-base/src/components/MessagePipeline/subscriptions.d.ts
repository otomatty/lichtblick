import { Immutable } from "@lichtblick/suite";
import { SubscribePayload } from "@lichtblick/suite-base/players/types";
/**
 * サブスクリプションメモ化関数生成
 *
 * 深い等価性チェックによるメモ化された恒等関数を作成する。
 * Playerに送信するサブスクリプションペイロードの安定化に使用され、
 * 同一内容のサブスクリプションに対して同一のオブジェクト参照を返す。
 *
 * ## 機能詳細
 *
 * ### メモ化戦略
 * - **深い等価性**: オブジェクトの内容を完全に比較
 * - **無制限キャッシュ**: maxSize: Infinityによる永続キャッシュ
 * - **参照安定性**: 同一内容での同一参照保証
 *
 * ### パフォーマンス効果
 * - Player側での不要な購読変更防止
 * - React再レンダリングの最適化
 * - ネットワーク通信の削減
 *
 * ## 使用上の注意
 *
 * この関数は無制限のキャッシュサイズを持つため、
 * 包含スコープによって管理される必要がある。
 * MessagePipelineストアのライフサイクルと合わせて管理すること。
 *
 * @returns メモ化されたサブスクリプション恒等関数
 *
 * @example
 * ```ts
 * const memoizer = makeSubscriptionMemoizer();
 *
 * const sub1 = { topic: "/pose", preload: false };
 * const sub2 = { topic: "/pose", preload: false };
 *
 * const memoized1 = memoizer(sub1);
 * const memoized2 = memoizer(sub2);
 *
 * console.log(memoized1 === memoized2); // true - 同一参照
 * ```
 */
export declare function makeSubscriptionMemoizer(): (val: SubscribePayload) => SubscribePayload;
/**
 * 個別トピックサブスクリプションをPlayerに送信するサブスクリプションセットに統合
 *
 * 複数のパネルからの個別サブスクリプションを受け取り、効率的な
 * サブスクリプションセットを生成してPlayerに送信する。
 * プリロードタイプの適切な処理と、フィールド要求の最適化を実行。
 *
 * ## 統合戦略
 *
 * ### プリロード処理
 * - **fullプリロード**: partialプリロードも自動生成
 * - **partialプリロード**: そのまま処理
 * - **プリロード分離**: fullとpartialを別々に統合
 *
 * ### フィールド最適化
 * - **全フィールド要求**: いずれかのクライアントが全フィールドを要求した場合
 * - **部分フィールド統合**: 異なるクライアントが異なるスライスを要求した場合の和集合
 * - **重複排除**: 同一サブスクリプションの除去
 *
 * ## プリロード戦略
 *
 * fullプリロードが要求された場合、以下の2つのサブスクリプションを生成：
 * 1. `preloadType: "full"` - 完全なバックフィル
 * 2. `preloadType: "partial"` - 部分的なバックフィル
 *
 * これにより、初期表示の高速化と継続的なデータ更新の両立を実現。
 *
 * @param subscriptions - 統合対象のサブスクリプション配列
 * @returns Playerに送信する最適化されたサブスクリプション配列
 *
 * @example
 * ```ts
 * const panelSubs = [
 *   { topic: "/pose", fields: ["position"], preloadType: "partial" },
 *   { topic: "/pose", fields: ["orientation"], preloadType: "partial" },
 *   { topic: "/twist", fields: undefined, preloadType: "full" },
 * ];
 *
 * const merged = mergeSubscriptions(panelSubs);
 * // => [
 * //   { topic: "/pose", fields: ["position", "orientation"], preloadType: "partial" },
 * //   { topic: "/twist", fields: undefined, preloadType: "full" },
 * //   { topic: "/twist", fields: undefined, preloadType: "partial" }
 * // ]
 * ```
 *
 * @example 全フィールド要求の場合
 * ```ts
 * const subs = [
 *   { topic: "/pose", fields: ["position"] },
 *   { topic: "/pose", fields: undefined }, // 全フィールド要求
 * ];
 * const merged = mergeSubscriptions(subs);
 * // => [{ topic: "/pose", fields: undefined }] // 全フィールドが優先
 * ```
 */
export declare function mergeSubscriptions(subscriptions: Immutable<SubscribePayload[]>): Immutable<SubscribePayload[]>;

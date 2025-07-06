import { MessageEvent } from "@lichtblick/suite-base/players/types";
import { Fixture } from "@lichtblick/suite-base/stories/PanelSetup";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
/**
 * テスト用のROSデータ型定義
 *
 * MessagePathSyntaxコンポーネントのテストで使用される基本的なデータ型定義です。
 * シンプルなint32型のindexフィールドを持つ「some/datatype」を定義しています。
 *
 * @example
 * ```typescript
 * // テストでの使用例
 * const testDatatype = datatypes.get("some/datatype");
 * console.log(testDatatype.definitions[0].name); // "index"
 * ```
 */
export declare const datatypes: RosDatatypes;
/**
 * テスト用のメッセージイベント配列
 *
 * MessagePathSyntaxコンポーネントのテストで使用される模擬メッセージデータです。
 * 3つの連続したタイムスタンプを持つメッセージを含み、それぞれ異なるindexの値を持ちます。
 *
 * 特徴：
 * - 全て同じトピック（/some/topic）からのメッセージ
 * - 1秒間隔でのタイムスタンプ（100, 101, 102秒）
 * - 連続したindex値（0, 1, 2）
 * - 統一されたスキーマ名（msgs/PoseDebug）
 *
 * @example
 * ```typescript
 * // メッセージの取得例
 * const firstMessage = messages[0];
 * console.log(firstMessage.message.index); // 0
 * console.log(firstMessage.receiveTime.sec); // 100
 * ```
 */
export declare const messages: readonly MessageEvent[];
/**
 * MessagePathInputコンポーネント用のStorybook/テストフィクスチャ
 *
 * MessagePathInputコンポーネントのStorybookストーリーやテストで使用される
 * 包括的なテストデータセットです。複雑なROSメッセージ構造、トピック、
 * グローバル変数を含む実際のロボットアプリケーションを模擬した環境を提供します。
 *
 * 含まれるデータ型：
 * - msgs/PoseDebug: ヘッダーとポーズ情報を含む位置デバッグメッセージ
 * - msgs/Pose: 位置、速度、加速度、方向等の詳細なポーズ情報
 * - msgs/State: 複数のアイテムを含む状態メッセージ
 * - msgs/StateData: 単一の浮動小数点値を持つ状態データ
 * - msgs/OtherState: ID、速度、名前、有効性フラグ、データ配列を含む複合状態
 * - msgs/Log: IDと重要度を持つログメッセージ
 * - std_msgs/Header: 標準的なROSヘッダー（シーケンス、タイムスタンプ、フレームID）
 *
 * 提供されるトピック：
 * - /some_topic/location: 位置情報
 * - /some_topic/state: 状態情報
 * - /very_very_very_..._long_topic_name/state: 長いトピック名のテスト用
 * - /some_logs_topic: ログメッセージ
 *
 * グローバル変数：
 * - global_var_1: 42
 * - global_var_2: 10
 *
 * @example
 * ```typescript
 * // Storybookでの使用例
 * export const Default = {
 *   parameters: {
 *     lichtblick: MessagePathInputStoryFixture,
 *   },
 * };
 * ```
 *
 * @example
 * ```typescript
 * // テストでの使用例
 * const poseType = MessagePathInputStoryFixture.datatypes.get("msgs/Pose");
 * const topics = MessagePathInputStoryFixture.topics;
 * const variables = MessagePathInputStoryFixture.globalVariables;
 * ```
 */
export declare const MessagePathInputStoryFixture: Fixture;

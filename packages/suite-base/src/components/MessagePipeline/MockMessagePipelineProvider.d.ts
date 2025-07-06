/// <reference types="react" />
import { Immutable } from "immer";
import { Time } from "@lichtblick/rostime";
import { ParameterValue } from "@lichtblick/suite";
import { BuiltinPanelExtensionContext } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { AdvertiseOptions, MessageEvent, PlayerPresence, PlayerAlert, PlayerStateActiveData, PlayerURLState, Progress, PublishPayload, SubscribePayload, Topic, TopicStats } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
/**
 * **MockMessagePipelineProvider Props型定義**
 *
 * テスト用MessagePipelineProvider の設定可能なプロパティを定義。
 * 実際のPlayer の動作をシミュレートするための包括的なオプションを提供する。
 *
 * ## プロパティカテゴリ
 *
 * ### 基本設定
 * - `name` - Player名
 * - `presence` - Player存在状態
 * - `playerId` - Player識別子
 * - `profile` - Playerプロファイル
 * - `capabilities` - Player機能
 *
 * ### データ設定
 * - `topics` - 利用可能トピック
 * - `topicStats` - トピック統計
 * - `datatypes` - データ型定義
 * - `messages` - メッセージイベント
 * - `alerts` - Player警告
 *
 * ### 制御機能
 * - `publish` - メッセージ発行
 * - `callService` - サービス呼び出し
 * - `setPublishers` - パブリッシャー設定
 * - `setSubscriptions` - サブスクリプション設定
 * - `setParameter` - パラメータ設定
 *
 * ### 再生制御
 * - `startPlayback` - 再生開始
 * - `pausePlayback` - 再生停止
 * - `seekPlayback` - シーク
 * - `currentTime` - 現在時刻
 * - `startTime` - 開始時刻
 * - `endTime` - 終了時刻
 * - `isPlaying` - 再生状態
 *
 * ### 高度な機能
 * - `fetchAsset` - アセット取得
 * - `pauseFrame` - フレーム一時停止
 * - `urlState` - URL状態
 * - `progress` - 進捗情報
 */
export type MockMessagePipelineProps = {
    /** Player名（表示用） */
    name?: string;
    /** Player存在状態 */
    presence?: PlayerPresence;
    /** 利用可能なトピック一覧 */
    topics?: Topic[];
    /** トピック統計情報 */
    topicStats?: Map<string, TopicStats>;
    /** ROSデータ型定義 */
    datatypes?: RosDatatypes;
    /** メッセージイベント一覧 */
    messages?: MessageEvent[];
    /** Player警告一覧 */
    alerts?: PlayerAlert[];
    /** メッセージ発行コールバック */
    publish?: (request: PublishPayload) => void;
    /** サービス呼び出しコールバック */
    callService?: (service: string, request: unknown) => Promise<unknown>;
    /** パブリッシャー設定コールバック */
    setPublishers?: (arg0: string, arg1: AdvertiseOptions[]) => void;
    /** サブスクリプション設定コールバック */
    setSubscriptions?: (arg0: string, arg1: Immutable<SubscribePayload[]>) => void;
    /** パラメータ設定コールバック */
    setParameter?: (key: string, value: ParameterValue) => void;
    /** アセット取得機能 */
    fetchAsset?: BuiltinPanelExtensionContext["unstable_fetchAsset"];
    /** アクティブデータを無効化するフラグ */
    noActiveData?: boolean;
    /** アクティブデータの部分的な設定 */
    activeData?: Partial<PlayerStateActiveData>;
    /** Player機能一覧 */
    capabilities?: string[];
    /** Playerプロファイル */
    profile?: string;
    /** 再生開始コールバック */
    startPlayback?: () => void;
    /** 再生停止コールバック */
    pausePlayback?: () => void;
    /** シークコールバック */
    seekPlayback?: (arg0: Time) => void;
    /** 現在時刻 */
    currentTime?: Time;
    /** 開始時刻 */
    startTime?: Time;
    /** 終了時刻 */
    endTime?: Time;
    /** 再生状態 */
    isPlaying?: boolean;
    /** フレーム一時停止機能 */
    pauseFrame?: (arg0: string) => () => void;
    /** Player識別子 */
    playerId?: string;
    /** 進捗情報 */
    progress?: Progress;
    /** URL状態 */
    urlState?: PlayerURLState;
};
/**
 * **MockMessagePipelineProvider - テスト用MessagePipelineProvider**
 *
 * テスト環境でMessagePipelineContext を提供するためのモックプロバイダー。
 * 実際のPlayer やデータソースを使用せず、制御されたテスト環境を構築する。
 *
 * ## 主な機能
 *
 * ### 🎭 完全なMessagePipeline シミュレーション
 * - MessagePipelineContext の完全な実装
 * - 実際のProvider と同じAPIを提供
 * - テスト用の制御可能な動作
 *
 * ### 📊 動的状態管理
 * - Zustand ベースの状態管理
 * - プロパティ変更の自動検出
 * - 効率的な状態更新とメモ化
 *
 * ### ⏱️ 時刻計算システム
 * - メッセージから自動時刻計算
 * - startTime/currentTime の自動推論
 * - 明示的な時刻設定のサポート
 *
 * ### 🔄 サブスクライバー管理
 * - サブスクライバー追加の検出
 * - メッセージ配信の制御
 * - シーク時のバックフィル動作のシミュレーション
 *
 * ### ⏸️ フレーム制御
 * - pauseFrame 機能の完全サポート
 * - Promise ベースの一時停止
 * - Condvar による同期制御
 *
 * ## アーキテクチャ
 *
 * ```
 * MockMessagePipelineProvider
 * ├── State Management (Zustand)
 * │   ├── mockProps (プロパティ管理)
 * │   ├── dispatch (状態更新)
 * │   └── subscriptionMemoizer (サブスクリプション最適化)
 * ├── Time Calculation
 * │   ├── Auto-detection from messages
 * │   ├── Manual override support
 * │   └── Default fallback values
 * ├── Subscriber Management
 * │   ├── hasSubscribers tracking
 * │   ├── Message emission control
 * │   └── Backfill simulation
 * └── Frame Control
 *     ├── pauseFrame implementation
 *     ├── Promise management
 *     └── Condvar synchronization
 * ```
 *
 * ## 使用例
 *
 * ```typescript
 * // 基本的な使用方法
 * <MockMessagePipelineProvider
 *   topics={mockTopics}
 *   messages={mockMessages}
 *   datatypes={mockDatatypes}
 * >
 *   <TestComponent />
 * </MockMessagePipelineProvider>
 *
 * // 高度な設定
 * <MockMessagePipelineProvider
 *   name="Test Player"
 *   presence={PlayerPresence.PRESENT}
 *   capabilities={[PLAYER_CAPABILITIES.setSpeed]}
 *   currentTime={{ sec: 100, nsec: 0 }}
 *   isPlaying={true}
 *   publish={(payload) => console.log('Published:', payload)}
 *   setSubscriptions={(id, subs) => console.log('Subscribed:', subs)}
 * >
 *   <TestComponent />
 * </MockMessagePipelineProvider>
 * ```
 *
 * ## 設計思想
 *
 * ### テスト特化設計
 * - テストに必要な機能のみ実装
 * - 実際のPlayer 動作の正確なシミュレーション
 * - デバッグしやすい透明な実装
 *
 * ### パフォーマンス重視
 * - 効率的なメモ化
 * - 不要な再レンダリング防止
 * - 最適化された状態更新
 *
 * ### 実際のProvider との互換性
 * - 同じContext インターフェース
 * - 同じ動作パターン
 * - シームレスな置き換え可能
 *
 * @param props - MockMessagePipelineProps とchildren
 * @returns MockMessagePipelineProvider コンポーネント
 *
 * @example
 * ```typescript
 * // ストーリーブックでの使用
 * export const Default = () => (
 *   <MockMessagePipelineProvider
 *     topics={[{ name: '/test', schemaName: 'Test' }]}
 *     messages={[{
 *       topic: '/test',
 *       receiveTime: { sec: 100, nsec: 0 },
 *       message: { data: 'test' }
 *     }]}
 *   >
 *     <PanelComponent />
 *   </MockMessagePipelineProvider>
 * );
 *
 * // テストでの使用
 * describe('Panel Component', () => {
 *   it('should render with mock data', () => {
 *     render(
 *       <MockMessagePipelineProvider topics={mockTopics}>
 *         <PanelComponent />
 *       </MockMessagePipelineProvider>
 *     );
 *     // テスト処理
 *   });
 * });
 * ```
 */
export default function MockMessagePipelineProvider(props: React.PropsWithChildren<MockMessagePipelineProps>): React.ReactElement;

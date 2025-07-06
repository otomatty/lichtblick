import { Metadata, ParameterValue } from "@lichtblick/suite";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import { PlayerStateActiveData, PlayerState, Player, SubscribePayload, AdvertiseOptions, PlayerPresence } from "@lichtblick/suite-base/players/types";
/**
 * **FakePlayer - テスト用Player実装**
 *
 * テスト環境でPlayer インターフェースの動作をシミュレートするための軽量な実装。
 * 実際のデータソース接続やファイル読み込みを行わず、制御されたテスト環境を提供する。
 *
 * ## 主な機能
 *
 * ### 🎭 Player インターフェース完全実装
 * - Player インターフェースのすべてのメソッドを実装
 * - 実際の処理は行わず、テスト用のスタブとして機能
 * - 状態変更の通知機能のみ実装
 *
 * ### 📡 状態通知システム
 * - リスナー登録とPlayerState通知機能
 * - テスト用の制御可能な状態変更
 * - 非同期状態更新の正確なシミュレーション
 *
 * ### 🔧 テスト制御機能
 * - capabilities、profile、playerId の動的設定
 * - サブスクリプション、パブリッシャーの追跡
 * - メタデータの固定値提供
 *
 * ## 使用例
 *
 * ```typescript
 * // 基本的な使用方法
 * const fakePlayer = new FakePlayer();
 * fakePlayer.setListener(async (state) => {
 *   console.log('Player state updated:', state);
 * });
 *
 * // テスト用状態の設定
 * fakePlayer.setCapabilities([PLAYER_CAPABILITIES.setSpeed]);
 * fakePlayer.setProfile('test-profile');
 *
 * // 状態変更の通知
 * await fakePlayer.emit({
 *   presence: PlayerPresence.PRESENT,
 *   activeData: {
 *     currentTime: { sec: 100, nsec: 0 },
 *     // ... other test data
 *   }
 * });
 * ```
 *
 * ## アーキテクチャ
 *
 * ```
 * FakePlayer
 * ├── State Management
 * │   ├── #listener (状態変更リスナー)
 * │   ├── subscriptions (サブスクリプション追跡)
 * │   ├── publishers (パブリッシャー追跡)
 * │   ├── #capabilities (Player機能設定)
 * │   └── #profile (プロファイル設定)
 * ├── Control Methods
 * │   ├── emit() (状態通知)
 * │   ├── setCapabilities() (機能設定)
 * │   ├── setProfile() (プロファイル設定)
 * │   └── setSubscriptions() (サブスクリプション設定)
 * └── Player Interface
 *     ├── Playback Control (no-op実装)
 *     ├── Publishing (no-op実装)
 *     ├── Service Calls (no-op実装)
 *     └── Metadata (固定値返却)
 * ```
 *
 * ## 設計思想
 *
 * ### ミニマリスト設計
 * - 必要最小限の機能のみ実装
 * - テストに不要な複雑性を排除
 * - 高速で軽量な動作
 *
 * ### 制御可能性
 * - テストコードから完全に制御可能
 * - 予測可能な動作
 * - デバッグしやすい実装
 *
 * ### 互換性保証
 * - Player インターフェースとの完全互換
 * - 実際のPlayer と同じAPIを提供
 * - テストと本番環境の差異を最小化
 *
 * @example
 * ```typescript
 * // テストでの使用例
 * describe('MessagePipeline', () => {
 *   it('should handle player state changes', async () => {
 *     const fakePlayer = new FakePlayer();
 *     const stateChanges: PlayerState[] = [];
 *
 *     fakePlayer.setListener(async (state) => {
 *       stateChanges.push(state);
 *     });
 *
 *     await fakePlayer.emit({
 *       presence: PlayerPresence.PRESENT,
 *       activeData: mockActiveData
 *     });
 *
 *     expect(stateChanges).toHaveLength(1);
 *     expect(stateChanges[0].presence).toBe(PlayerPresence.PRESENT);
 *   });
 * });
 * ```
 */
export default class FakePlayer implements Player {
    #private;
    /** テスト用のPlayer ID（デフォルト: "test"） */
    playerId: string;
    /** 現在のサブスクリプション一覧（テスト用追跡） */
    subscriptions: SubscribePayload[];
    /** 現在のパブリッシャー一覧（テスト用追跡） */
    publishers: AdvertiseOptions[] | undefined;
    /**
     * 状態変更リスナーを設定
     *
     * PlayerState の変更を監視するリスナー関数を登録する。
     * emit() メソッドで状態変更を通知する際に呼び出される。
     *
     * @param listener - PlayerState変更時に呼び出される非同期関数
     *
     * @example
     * ```typescript
     * fakePlayer.setListener(async (state) => {
     *   console.log('Player state changed:', state.presence);
     *   // テストでの検証処理
     * });
     * ```
     */
    setListener(listener: (arg0: PlayerState) => Promise<void>): void;
    /**
     * PlayerState の変更を通知
     *
     * 設定されたリスナーに対してPlayerState の変更を非同期で通知する。
     * テストコードから制御可能な状態変更をシミュレートできる。
     *
     * @param options - 通知するPlayerState の部分的な設定
     * @param options.activeData - アクティブデータ（再生中のデータ情報）
     * @param options.presence - Player の存在状態
     * @param options.progress - 再生進捗情報
     * @param options.playerId - Player ID（省略時は現在のplayerId を使用）
     *
     * @returns Promise<void> - 通知完了を示すPromise
     *
     * @example
     * ```typescript
     * // 基本的な状態変更通知
     * await fakePlayer.emit({
     *   presence: PlayerPresence.PRESENT
     * });
     *
     * // アクティブデータ付きの通知
     * await fakePlayer.emit({
     *   presence: PlayerPresence.PRESENT,
     *   activeData: {
     *     currentTime: { sec: 100, nsec: 0 },
     *     topics: mockTopics,
     *     messages: mockMessages
     *   }
     * });
     * ```
     */
    emit({ activeData, presence, progress, playerId, }?: {
        activeData?: PlayerStateActiveData;
        presence?: PlayerPresence;
        progress?: PlayerState["progress"];
        playerId?: string;
    }): Promise<void>;
    /**
     * Player を閉じる（no-op実装）
     *
     * 実際のリソース解放は行わず、テスト用のスタブとして機能。
     */
    close: () => void;
    /**
     * 再生速度を設定（no-op実装）
     *
     * 実際の再生速度変更は行わず、テスト用のスタブとして機能。
     */
    setPlaybackSpeed: () => void;
    /**
     * 再生を一時停止（no-op実装）
     *
     * 実際の再生制御は行わず、テスト用のスタブとして機能。
     */
    pausePlayback: () => void;
    /**
     * メッセージを発行（no-op実装）
     *
     * 実際のメッセージ発行は行わず、テスト用のスタブとして機能。
     */
    publish: () => void;
    /**
     * サービスを呼び出し（no-op実装）
     *
     * 実際のサービス呼び出しは行わず、テスト用のスタブとして機能。
     *
     * @returns Promise<void> - 常に正常完了するPromise
     */
    callService: () => Promise<void>;
    /**
     * パブリッシャーを設定
     *
     * テスト用にパブリッシャー設定を追跡する。
     * 実際の発行機能は提供せず、設定の記録のみ行う。
     *
     * @param pubs - 設定するパブリッシャーオプションの配列
     *
     * @example
     * ```typescript
     * fakePlayer.setPublishers([
     *   { topic: '/test_topic', schemaName: 'TestMessage' }
     * ]);
     * console.log(fakePlayer.publishers); // 設定されたパブリッシャーを確認
     * ```
     */
    setPublishers: (pubs: AdvertiseOptions[]) => void;
    /**
     * パラメータを設定（no-op実装）
     *
     * 実際のパラメータ設定は行わず、テスト用のスタブとして機能。
     *
     * @param _key - パラメータキー（未使用）
     * @param _value - パラメータ値（未使用）
     */
    setParameter(_key: string, _value: ParameterValue): void;
    /**
     * サブスクリプションを設定
     *
     * テスト用にサブスクリプション設定を追跡する。
     * 実際のデータ配信は行わず、設定の記録のみ行う。
     *
     * @param subs - 設定するサブスクリプションペイロードの配列
     *
     * @example
     * ```typescript
     * fakePlayer.setSubscriptions([
     *   { topic: '/test_topic', preload: false }
     * ]);
     * console.log(fakePlayer.subscriptions); // 設定されたサブスクリプションを確認
     * ```
     */
    setSubscriptions: (subs: SubscribePayload[]) => void;
    /**
     * Player 機能を設定
     *
     * テスト用にPlayer の機能（capabilities）を動的に設定する。
     * emit() で通知するPlayerState に反映される。
     *
     * @param capabilities - 設定する機能の配列
     *
     * @example
     * ```typescript
     * fakePlayer.setCapabilities([
     *   PLAYER_CAPABILITIES.setSpeed,
     *   PLAYER_CAPABILITIES.playbackControl
     * ]);
     *
     * await fakePlayer.emit(); // 設定された機能が通知される
     * ```
     */
    setCapabilities: (capabilities: (typeof PLAYER_CAPABILITIES)[keyof typeof PLAYER_CAPABILITIES][]) => void;
    /**
     * Player プロファイルを設定
     *
     * テスト用にPlayer のプロファイルを動的に設定する。
     * emit() で通知するPlayerState に反映される。
     *
     * @param profile - 設定するプロファイル名（undefinedで未設定）
     *
     * @example
     * ```typescript
     * fakePlayer.setProfile('test-profile');
     * await fakePlayer.emit(); // 設定されたプロファイルが通知される
     * ```
     */
    setProfile: (profile: string | undefined) => void;
    /**
     * 再生を開始（no-op実装）
     *
     * 実際の再生開始は行わず、テスト用のスタブとして機能。
     */
    startPlayback: () => void;
    /**
     * 再生位置をシーク（no-op実装）
     *
     * 実際のシーク処理は行わず、テスト用のスタブとして機能。
     */
    seekPlayback: () => void;
    /**
     * グローバル変数を設定（no-op実装）
     *
     * 実際のグローバル変数設定は行わず、テスト用のスタブとして機能。
     */
    setGlobalVariables: () => void;
    /**
     * メタデータを取得
     *
     * テスト用の固定メタデータを返す。
     * freezeMetadata() により不変オブジェクトとして提供される。
     *
     * @returns 固定のテスト用メタデータ配列
     *
     * @example
     * ```typescript
     * const metadata = fakePlayer.getMetadata();
     * console.log(metadata[0].name); // "metadataFake"
     * console.log(metadata[0].metadata.key); // "value"
     * ```
     */
    getMetadata: () => readonly Metadata[];
}

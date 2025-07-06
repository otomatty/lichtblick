import { MutableRefObject } from "react";
import { StoreApi } from "zustand";
import { Immutable, MessageEvent } from "@lichtblick/suite";
import { AdvertiseOptions, Player, PlayerState, SubscribePayload } from "@lichtblick/suite-base/players/types";
import { FramePromise } from "./pauseFrameForPromise";
import { MessagePipelineContext } from "./types";
/**
 * デフォルトPlayerState生成関数
 *
 * Playerが存在しない状態、または初期化中の状態に対応する
 * デフォルトのPlayerStateを生成する。
 *
 * @param player - Playerインスタンス（オプショナル）
 * @returns デフォルトのPlayerState
 *
 * @example
 * ```ts
 * // Playerが存在しない場合
 * const state = defaultPlayerState(); // presence: NOT_PRESENT
 *
 * // Playerが存在する場合（初期化中として扱う）
 * const state = defaultPlayerState(player); // presence: INITIALIZING
 * ```
 */
export declare function defaultPlayerState(player?: Player): PlayerState;
/**
 * MessagePipeline内部状態型定義
 *
 * MessagePipelineストアの内部状態を定義する。
 * 公開状態（public）と内部状態の両方を管理し、
 * 効率的なデータ処理とパネル間連携を実現する。
 */
export type MessagePipelineInternalState = {
    /**
     * アクション実行関数
     * 状態更新のためのアクションを実行する
     */
    dispatch: (action: MessagePipelineStateAction) => void;
    /**
     * 状態リセット関数
     * 公開・内部状態を初期空値に戻す
     * Player変更時やエラー回復時に使用
     */
    reset: () => void;
    /**
     * 現在のPlayerインスタンス（オプショナル）
     * データソースとの接続を管理
     */
    player?: Player;
    /**
     * 最後のPlayer機能一覧
     * public.startPlayback/playUntil等の更新判定に使用
     * 機能変更時のみAPIバインディングを更新することで効率化
     */
    lastCapabilities: string[];
    /**
     * サブスクリプションメモ化関数
     * 参照等価性を保持してPlayerサブスクリプション変更を最小化
     * 同一内容のサブスクリプションに対して同一オブジェクトを返す
     */
    subscriptionMemoizer: (sub: SubscribePayload) => SubscribePayload;
    /**
     * パネル別サブスクリプションマップ
     * Key: パネルID, Value: そのパネルのサブスクリプション配列
     * パネル個別の購読管理と動的更新に使用
     */
    subscriptionsById: Map<string, Immutable<SubscribePayload[]>>;
    /**
     * パネル別パブリッシャーマップ
     * Key: パネルID, Value: そのパネルのパブリッシャー設定配列
     */
    publishersById: {
        [key: string]: AdvertiseOptions[];
    };
    /**
     * 全パブリッシャー統合配列
     * publishersByIdから生成される統合リスト
     * Playerに送信される実際のパブリッシャー設定
     */
    allPublishers: AdvertiseOptions[];
    /**
     * トピック別購読者IDマップ
     * Key: トピック名, Value: そのトピックを購読するパネルID配列
     *
     * 受信メッセージをID別にバケッティングし、
     * パネルが購読したメッセージのみを送信するために使用。
     *
     * 注意: 同一IDの重複保存は避けているが、Setではなく配列を使用。
     * これは配列要素の反復処理がSetより高速で、
     * メッセージ配信の「ホット」パスで配列反復が必要なため。
     */
    subscriberIdsByTopic: Map<string, string[]>;
    /**
     * トピック別最後メッセージキャッシュ
     * Key: トピック名, Value: そのトピックの最後のメッセージ
     *
     * 新規購読者に対して即座に最後のメッセージを提供し、
     * Playerバックフィルに頼る前にこのキャッシュを使用する。
     */
    lastMessageEventByTopic: Map<string, MessageEvent>;
    /**
     * レンダリング完了コールバック関数（オプショナル）
     * React レンダリング完了時に呼び出される関数
     * フレーム制御とパフォーマンス最適化に使用
     */
    renderDone?: () => void;
    /**
     * 公開状態
     * useMessagePipeline経由で消費者に公開される状態部分
     * パネルコンポーネントが直接アクセスする統一インターフェース
     */
    public: MessagePipelineContext;
};
/**
 * サブスクリプション更新アクション型定義
 * パネルのサブスクリプション変更時に使用
 */
type UpdateSubscriberAction = {
    type: "update-subscriber";
    /** パネルの一意識別子 */
    id: string;
    /** 新しいサブスクリプション配列 */
    payloads: Immutable<SubscribePayload[]>;
};
/**
 * Player状態更新アクション型定義
 * Player状態変更時に使用
 */
type UpdatePlayerStateAction = {
    type: "update-player-state";
    /** 新しいPlayer状態 */
    playerState: PlayerState;
    /** レンダリング完了コールバック（オプショナル） */
    renderDone?: () => void;
};
/**
 * MessagePipeline状態アクション型定義
 * 状態更新のための全アクションタイプを統合
 */
export type MessagePipelineStateAction = UpdateSubscriberAction | UpdatePlayerStateAction | {
    type: "set-publishers";
    id: string;
    payloads: AdvertiseOptions[];
};
/**
 * MessagePipelineストア作成関数
 *
 * Zustandベースの高性能ストアを作成し、MessagePipelineの
 * 中核となる状態管理システムを初期化する。
 *
 * ## 主要機能
 *
 * ### 1. 状態管理初期化
 * - 各種Mapとキャッシュの初期化
 * - サブスクリプションメモ化の設定
 * - 公開APIの構築
 *
 * ### 2. アクション処理
 * - サブスクリプション更新
 * - Player状態更新
 * - パブリッシャー設定
 *
 * ### 3. 統合API提供
 * - パネル向け統一インターフェース
 * - Player操作API
 * - アセット取得機能
 * - フレーム制御機能
 *
 * @param config - ストア作成設定
 * @returns MessagePipeline Zustandストア
 *
 * @example
 * ```ts
 * const store = createMessagePipelineStore({
 *   promisesToWaitForRef,
 *   initialPlayer: player
 * });
 *
 * const state = store.getState();
 * state.dispatch({ type: "update-subscriber", id: "panel1", payloads: [] });
 * ```
 */
export declare function createMessagePipelineStore({ promisesToWaitForRef, initialPlayer, }: {
    /** フレーム一時停止Promise配列への参照 */
    promisesToWaitForRef: MutableRefObject<FramePromise[]>;
    /** 初期Playerインスタンス */
    initialPlayer: Player | undefined;
}): StoreApi<MessagePipelineInternalState>;
/**
 * MessagePipelineストアリデューサー関数
 *
 * Redux様のリデューサーパターンにより、
 * アクションタイプに応じて適切な状態更新関数を呼び出す。
 *
 * @param prevState - 前の状態
 * @param action - 実行するアクション
 * @returns 新しい状態
 */
export declare function reducer(prevState: MessagePipelineInternalState, action: MessagePipelineStateAction): MessagePipelineInternalState;
export {};

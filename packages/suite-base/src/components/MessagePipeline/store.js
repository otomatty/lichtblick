// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview MessagePipelineストア - データ処理パイプラインの状態管理システム
 *
 * このファイルは、MessagePipelineの中核となる状態管理システムを実装している。
 * Zustandベースの高性能ストアにより、パネル間のサブスクリプション統合、
 * メッセージ配信、Player統合、アセット管理を効率的に処理する重要なシステム。
 *
 * ## アーキテクチャ概要
 *
 * ### 1. 状態管理設計
 * - **Zustandストア**: 高性能な状態管理とセレクター最適化
 * - **Immutable設計**: React最適化と予期しない変更の防止
 * - **アクション駆動**: Redux様のアクション駆動状態更新
 * - **メモリ効率**: 大容量データの効率的な処理
 *
 * ### 2. データフロー設計
 * ```
 * Panel.setSubscriptions() → updateSubscriberAction → mergeSubscriptions
 *                                                              ↓
 * Player.listener() → updatePlayerStateAction → messagesBySubscriberId
 * ```
 *
 * ### 3. パフォーマンス最適化戦略
 * - **サブスクリプションメモ化**: 重複購読の最適化
 * - **メッセージバケッティング**: 購読者別の効率的な配信
 * - **参照等価性保持**: 不要な再レンダリング防止
 * - **最後メッセージキャッシュ**: 新規購読者への即座の配信
 *
 * ## 主要機能
 *
 * ### サブスクリプション統合システム
 * - パネル別サブスクリプションの動的管理
 * - 重複購読の自動最適化
 * - 新規トピック購読時の最後メッセージ配信
 * - 購読解除時のクリーンアップ処理
 *
 * ### メッセージ配信システム
 * - 購読者別メッセージバケッティング
 * - トピック別購読者マッピング
 * - 最後メッセージキャッシュ管理
 * - 効率的なメッセージルーティング
 *
 * ### Player統合システム
 * - 複数Playerタイプの統一インターフェース
 * - 機能別API動的バインディング
 * - アセット取得とプロトコル対応
 * - エラーハンドリングとフォールバック
 *
 * ### フレーム制御システム
 * - pauseFrame機能による非同期制御
 * - Condvar基盤の効率的な待機
 * - パネル処理時間の動的調整
 * - フレームレート最適化
 *
 * ## 設計思想
 *
 * ### 1. 高性能データ処理
 * 大容量ROSデータのリアルタイム処理に対応するため、
 * メモリ効率とCPU効率を最優先に設計
 *
 * ### 2. 拡張性
 * 新しいPlayerタイプやパネル機能に対応可能な
 * 柔軟なアーキテクチャ設計
 *
 * ### 3. 型安全性
 * TypeScriptによる厳密な型定義と
 * 実行時エラーの防止
 *
 * @see {@link ./types.ts} - 型定義の詳細
 * @see {@link ./index.tsx} - Provider実装
 * @see {@link ./subscriptions.ts} - サブスクリプション管理
 */
import * as _ from "lodash-es";
import shallowequal from "shallowequal";
import { createStore } from "zustand";
import { Condvar } from "@lichtblick/den/async";
import { makeSubscriptionMemoizer, mergeSubscriptions, } from "@lichtblick/suite-base/components/MessagePipeline/subscriptions";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import { PlayerPresence, } from "@lichtblick/suite-base/players/types";
import isDesktopApp from "@lichtblick/suite-base/util/isDesktopApp";
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
export function defaultPlayerState(player) {
    return {
        /**
         * Playerが存在する場合は初期化中に設定し、
         * UIでの状態変化によるちらつきを防ぐ
         */
        presence: player ? PlayerPresence.INITIALIZING : PlayerPresence.NOT_PRESENT,
        progress: {},
        capabilities: [],
        profile: undefined,
        playerId: "",
        activeData: undefined,
    };
}
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
export function createMessagePipelineStore({ promisesToWaitForRef, initialPlayer, }) {
    return createStore((set, get) => ({
        player: initialPlayer,
        publishersById: {},
        allPublishers: [],
        subscriptionMemoizer: makeSubscriptionMemoizer(),
        subscriptionsById: new Map(),
        subscriberIdsByTopic: new Map(),
        newTopicsBySubscriberId: new Map(),
        lastMessageEventByTopic: new Map(),
        lastCapabilities: [],
        /**
         * アクション実行関数
         * 指定されたアクションに基づいて状態を更新
         */
        dispatch(action) {
            set((state) => reducer(state, action));
        },
        /**
         * 状態リセット関数
         *
         * 公開・内部状態を初期値に戻す。
         * Player変更時やエラー回復時に使用され、
         * 前の状態による影響を完全に除去する。
         */
        reset() {
            set((prev) => ({
                ...prev,
                publishersById: {},
                allPublishers: [],
                subscriptionMemoizer: makeSubscriptionMemoizer(),
                subscriptionsById: new Map(),
                subscriberIdsByTopic: new Map(),
                newTopicsBySubscriberId: new Map(),
                lastMessageEventByTopic: new Map(),
                lastCapabilities: [],
                public: {
                    ...prev.public,
                    playerState: defaultPlayerState(),
                    messageEventsBySubscriberId: new Map(),
                    subscriptions: [],
                    sortedTopics: [],
                    datatypes: new Map(),
                    startPlayback: undefined,
                    playUntil: undefined,
                    pausePlayback: undefined,
                    setPlaybackSpeed: undefined,
                    seekPlayback: undefined,
                },
            }));
        },
        /**
         * 公開MessagePipelineContext
         * パネルコンポーネントがアクセスする統一インターフェース
         */
        public: {
            playerState: defaultPlayerState(initialPlayer),
            messageEventsBySubscriberId: new Map(),
            subscriptions: [],
            sortedTopics: [],
            datatypes: new Map(),
            /**
             * サブスクリプション設定関数
             * 指定されたパネルのサブスクリプションを更新
             */
            setSubscriptions(id, payloads) {
                get().dispatch({ type: "update-subscriber", id, payloads });
            },
            /**
             * パブリッシャー設定関数
             * 指定されたパネルのパブリッシャーを設定し、Playerに反映
             */
            setPublishers(id, payloads) {
                get().dispatch({ type: "set-publishers", id, payloads });
                get().player?.setPublishers(get().allPublishers);
            },
            /**
             * パラメータ設定関数
             * ROSパラメータサーバーにパラメータを設定
             */
            setParameter(key, value) {
                get().player?.setParameter(key, value);
            },
            /**
             * メッセージ発行関数
             * ROSトピックにメッセージを発行
             */
            publish(payload) {
                get().player?.publish(payload);
            },
            /**
             * ROSサービス呼び出し関数
             *
             * ROSサービスを非同期で呼び出す。
             * Playerが存在しない場合はエラーを投げる。
             *
             * @param service - サービス名
             * @param request - リクエストデータ
             * @returns サービスレスポンス
             * @throws Playerが存在しない場合
             */
            async callService(service, request) {
                const player = get().player;
                if (!player) {
                    throw new Error("callService called when player is not present");
                }
                return await player.callService(service, request);
            },
            /**
             * アセット取得関数
             *
             * 拡張機能やリソースファイルを取得する。
             * package://、HTTP、その他のプロトコルに対応し、
             * デスクトップアプリとWebアプリの両方で動作する。
             *
             * ## プロトコル対応
             *
             * ### 1. package://プロトコル
             * - デスクトップ: ビルトインfetch + Playerフォールバック
             * - Web: Player経由 + 相対URL解決フォールバック
             *
             * ### 2. HTTP/HTTPSプロトコル
             * - 標準fetchによる取得
             *
             * ### 3. その他プロトコル
             * - Player.fetchAsset()経由での取得
             *
             * @param uri - 取得するリソースのURI
             * @param options - 取得オプション（signal等）
             * @returns アセットデータ
             * @throws 取得失敗時
             */
            async fetchAsset(uri, options) {
                const { protocol } = new URL(uri);
                const player = get().player;
                if (protocol === "package:") {
                    /**
                     * package://プロトコル処理
                     * デスクトップアプリではビルトインfetchが対応済み
                     */
                    const canBuiltinFetchPkgUri = isDesktopApp();
                    const pkgPath = uri.slice("package://".length);
                    const pkgName = pkgPath.split("/")[0];
                    if (player?.fetchAsset) {
                        try {
                            return await player.fetchAsset(uri);
                        }
                        catch (err) {
                            if (canBuiltinFetchPkgUri) {
                                /**
                                 * Player経由で取得できない場合、
                                 * ビルトインfetchでフォールバック
                                 */
                                return await builtinFetch(uri, options);
                            }
                            throw err; // その他の場合はエラーを再投げ
                        }
                    }
                    else if (canBuiltinFetchPkgUri) {
                        return await builtinFetch(uri, options);
                    }
                    else if (pkgName &&
                        options?.referenceUrl != undefined &&
                        !options.referenceUrl.startsWith("package://") &&
                        options.referenceUrl.includes(pkgName)) {
                        /**
                         * package://<pkgName>/<pkgPath> URLの最後の手段として、
                         * ベースURL（<pkgName>を含み、package://でない）からの
                         * 相対URLとしてpackage URLを解決する。
                         *
                         * 例:
                         *   ベースURL: https://example.com/<pkgName>/urdf/robot.urdf
                         *   解決結果: https://example.com/<pkgName>/<pkgPath>
                         */
                        const resolvedUrl = options.referenceUrl.slice(0, options.referenceUrl.lastIndexOf(pkgName)) + pkgPath;
                        return await builtinFetch(resolvedUrl, options);
                    }
                }
                /**
                 * その他のプロトコルは標準fetchを使用
                 */
                return await builtinFetch(uri, options);
            },
            /**
             * メタデータ取得関数
             * データソースのメタデータ情報を取得
             */
            getMetadata() {
                const player = get().player;
                return player?.getMetadata?.() ?? Object.freeze([]);
            },
            /** 再生制御API（Player機能に応じて動的設定） */
            startPlayback: undefined,
            playUntil: undefined,
            pausePlayback: undefined,
            setPlaybackSpeed: undefined,
            seekPlayback: undefined,
            /**
             * フレーム一時停止関数
             *
             * 重い処理を行う際に描画フレームを一時停止し、
             * 処理完了後に再開するための制御機能。
             * Condvarベースの効率的な非同期制御を実装。
             *
             * @param name - 一時停止の理由を示す名前（デバッグ用）
             * @returns フレーム再開関数
             *
             * @example
             * ```ts
             * const resume = pauseFrame("heavy-processing");
             * try {
             *   await heavyAsyncOperation();
             * } finally {
             *   resume();
             * }
             * ```
             */
            pauseFrame(name) {
                const condvar = new Condvar();
                promisesToWaitForRef.current.push({ name, promise: condvar.wait() });
                return () => {
                    condvar.notifyAll();
                };
            },
        },
    }));
}
/**
 * サブスクリプション更新処理関数
 *
 * パネルのサブスクリプション変更時に呼び出され、以下の処理を実行：
 * 1. サブスクリプションマップの更新
 * 2. トピック別購読者マップの再構築
 * 3. 新規トピックの検出と最後メッセージ配信
 * 4. 不要なキャッシュのクリーンアップ
 *
 * ## 新規トピック処理
 * 新しくサブスクライブしたトピックに対して、キャッシュされた
 * 最後のメッセージを即座に配信し、ユーザー体験を向上させる。
 *
 * @param prevState - 前の状態
 * @param action - サブスクリプション更新アクション
 * @returns 新しい状態
 */
function updateSubscriberAction(prevState, action) {
    const previousSubscriptionsById = prevState.subscriptionsById;
    const subscriptionsById = new Map(previousSubscriptionsById);
    if (action.payloads.length === 0) {
        /**
         * サブスクリプションIDにトピックがない場合、
         * マップから削除する
         */
        subscriptionsById.delete(action.id);
    }
    else {
        subscriptionsById.set(action.id, action.payloads);
    }
    const subscriberIdsByTopic = new Map();
    /**
     * トピック別購読者IDマップの構築
     */
    for (const [id, subs] of subscriptionsById) {
        for (const subscription of subs) {
            const topic = subscription.topic;
            const ids = subscriberIdsByTopic.get(topic) ?? [];
            /**
             * IDがトピックの配列に既に存在する場合は再追加しない。
             * 再追加すると、購読者IDによる受信メッセージのバケッティング時に
             * フレームメッセージが再度与えられてしまう。
             */
            if (!ids.includes(id)) {
                ids.push(id);
            }
            subscriberIdsByTopic.set(topic, ids);
        }
    }
    /**
     * この購読者の新規トピックを記録し、
     * これらのトピックで最後のメッセージを配信できるようにする
     */
    const newTopicsForId = new Set();
    const prevSubsForId = previousSubscriptionsById.get(action.id);
    const prevTopics = new Set(prevSubsForId?.map((sub) => sub.topic) ?? []);
    for (const { topic: newTopic } of action.payloads) {
        if (!prevTopics.has(newTopic)) {
            newTopicsForId.add(newTopic);
        }
    }
    const lastMessageEventByTopic = new Map(prevState.lastMessageEventByTopic);
    for (const topic of prevTopics) {
        /**
         * このトピックに他の購読者がいない場合、
         * lastMessageEventByTopicから削除する。
         * これにより、パネルが購読解除→再生トリガー→再購読した場合に、
         * 現在時刻のシークバックフィルからメッセージを取得する前に
         * 古い陳腐化したメッセージを取得しない問題を修正する。
         */
        if (!subscriberIdsByTopic.has(topic)) {
            lastMessageEventByTopic.delete(topic);
        }
    }
    /**
     * この購読者の新規トピックに最後のメッセージを注入
     */
    const messagesForSubscriber = [];
    for (const topic of newTopicsForId) {
        const msgEvent = lastMessageEventByTopic.get(topic);
        if (msgEvent) {
            messagesForSubscriber.push(msgEvent);
        }
    }
    let newMessagesBySubscriberId;
    if (messagesForSubscriber.length > 0) {
        newMessagesBySubscriberId = new Map(prevState.public.messageEventsBySubscriberId);
        /**
         * 新しいトピックを購読したパネルのみを更新
         */
        newMessagesBySubscriberId.set(action.id, messagesForSubscriber);
    }
    const subscriptions = mergeSubscriptions(Array.from(subscriptionsById.values()).flat());
    const newPublicState = {
        ...prevState.public,
        subscriptions,
        messageEventsBySubscriberId: newMessagesBySubscriberId ?? prevState.public.messageEventsBySubscriberId,
    };
    return {
        ...prevState,
        lastMessageEventByTopic,
        subscriptionsById,
        subscriberIdsByTopic,
        public: newPublicState,
    };
}
/**
 * Player状態更新処理関数
 *
 * Player状態変更時に呼び出され、以下の処理を実行：
 * 1. メッセージの購読者別配信
 * 2. トピック・データ型情報の更新
 * 3. Player機能の動的API バインディング
 * 4. 最後メッセージキャッシュの更新
 *
 * ## メッセージ配信処理
 * 受信メッセージを購読者別にバケッティングし、
 * 各パネルが必要なメッセージのみを受信する仕組み。
 *
 * ## API動的バインディング
 * Player機能（capabilities）に応じて、再生制御APIを
 * 動的にバインドし、機能変更時のみ更新することで効率化。
 *
 * @param prevState - 前の状態
 * @param action - Player状態更新アクション
 * @returns 新しい状態
 */
function updatePlayerStateAction(prevState, action) {
    const messages = action.playerState.activeData?.messages;
    const seenTopics = new Set();
    /**
     * 各購読者に対して新しいメッセージ配列セットが必要。
     * 下流ユーザーがオブジェクトインスタンス参照チェックを使用して
     * 新しいメッセージがあるかどうかを判定するため。
     */
    const messagesBySubscriberId = new Map();
    const subscriberIdsByTopic = prevState.subscriberIdsByTopic;
    const lastMessageEventByTopic = prevState.lastMessageEventByTopic;
    /**
     * メッセージを購読者別キューに配置
     */
    if (messages && messages !== prevState.public.playerState.activeData?.messages) {
        for (const messageEvent of messages) {
            /**
             * 新しく購読したパネルに最後のメッセージを送信するため、
             * 全トピックの最後のメッセージを保存
             */
            lastMessageEventByTopic.set(messageEvent.topic, messageEvent);
            seenTopics.add(messageEvent.topic);
            const ids = subscriberIdsByTopic.get(messageEvent.topic);
            if (!ids) {
                continue;
            }
            for (const id of ids) {
                const subscriberMessageEvents = messagesBySubscriberId.get(id);
                if (!subscriberMessageEvents) {
                    messagesBySubscriberId.set(id, [messageEvent]);
                }
                else {
                    subscriberMessageEvents.push(messageEvent);
                }
            }
        }
    }
    const newPublicState = {
        ...prevState.public,
        playerState: action.playerState,
        messageEventsBySubscriberId: messagesBySubscriberId,
    };
    /**
     * トピック情報の更新
     */
    const topics = action.playerState.activeData?.topics;
    if (topics !== prevState.public.playerState.activeData?.topics) {
        newPublicState.sortedTopics = topics
            ? [...topics].sort((a, b) => a.name.localeCompare(b.name))
            : [];
    }
    /**
     * データ型情報の更新
     */
    if (action.playerState.activeData?.datatypes !== prevState.public.playerState.activeData?.datatypes) {
        newPublicState.datatypes = action.playerState.activeData?.datatypes ?? new Map();
    }
    /**
     * Player機能の動的APIバインディング
     * 機能変更時のみAPI関数をバインドし、効率化を図る
     */
    const capabilities = action.playerState.capabilities;
    const player = prevState.player;
    if (player && !shallowequal(capabilities, prevState.lastCapabilities)) {
        newPublicState.startPlayback = capabilities.includes(PLAYER_CAPABILITIES.playbackControl)
            ? player.startPlayback?.bind(player)
            : undefined;
        newPublicState.playUntil = capabilities.includes(PLAYER_CAPABILITIES.playbackControl)
            ? player.playUntil?.bind(player)
            : undefined;
        newPublicState.pausePlayback = capabilities.includes(PLAYER_CAPABILITIES.playbackControl)
            ? player.pausePlayback?.bind(player)
            : undefined;
        newPublicState.setPlaybackSpeed = capabilities.includes(PLAYER_CAPABILITIES.setSpeed)
            ? player.setPlaybackSpeed?.bind(player)
            : undefined;
        newPublicState.seekPlayback = capabilities.includes(PLAYER_CAPABILITIES.playbackControl)
            ? player.seekPlayback?.bind(player)
            : undefined;
    }
    return {
        ...prevState,
        renderDone: action.renderDone,
        public: newPublicState,
        lastCapabilities: capabilities,
        lastMessageEventByTopic,
    };
}
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
export function reducer(prevState, action) {
    switch (action.type) {
        case "update-player-state":
            return updatePlayerStateAction(prevState, action);
        case "update-subscriber":
            return updateSubscriberAction(prevState, action);
        case "set-publishers": {
            const newPublishersById = { ...prevState.publishersById, [action.id]: action.payloads };
            return {
                ...prevState,
                publishersById: newPublishersById,
                allPublishers: _.flatten(Object.values(newPublishersById)),
            };
        }
    }
}
/**
 * ビルトインfetch関数
 *
 * 標準fetchAPIを使用してリソースを取得し、
 * MessagePipeline用の統一形式に変換する。
 * エラーハンドリングとレスポンス形式の標準化を提供。
 *
 * @param url - 取得するURL
 * @param opts - fetchオプション
 * @returns 統一形式のアセットデータ
 * @throws HTTP エラー時
 */
async function builtinFetch(url, opts) {
    const response = await fetch(url, opts);
    if (!response.ok) {
        const errMsg = response.statusText;
        throw new Error(`Error ${response.status}${errMsg ? ` (${errMsg})` : ``}`);
    }
    return {
        uri: url,
        data: new Uint8Array(await response.arrayBuffer()),
        mediaType: response.headers.get("content-type") ?? undefined,
    };
}

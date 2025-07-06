// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { Immutable } from "immer";
import * as _ from "lodash-es";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import shallowequal from "shallowequal";
import { Writable } from "ts-essentials";
import { createStore } from "zustand";

import { Condvar } from "@lichtblick/den/async";
import { Time, isLessThan } from "@lichtblick/rostime";
import { Metadata, ParameterValue } from "@lichtblick/suite";
import {
  FramePromise,
  pauseFrameForPromises,
} from "@lichtblick/suite-base/components/MessagePipeline/pauseFrameForPromise";
import { BuiltinPanelExtensionContext } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { freezeMetadata } from "@lichtblick/suite-base/players/IterablePlayer/freezeMetadata";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import {
  AdvertiseOptions,
  MessageEvent,
  PlayerPresence,
  PlayerAlert,
  PlayerState,
  PlayerStateActiveData,
  PlayerURLState,
  Progress,
  PublishPayload,
  SubscribePayload,
  Topic,
  TopicStats,
} from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";

import { ContextInternal } from "./index";
import { MessagePipelineInternalState, MessagePipelineStateAction, reducer } from "./store";
import { makeSubscriptionMemoizer } from "./subscriptions";

/** 空のデータ型マップ（デフォルト値として使用） */
const NO_DATATYPES = new Map();

/** no-op関数（デフォルトコールバックとして使用） */
function noop() {}

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
 * **MockMessagePipelineState型定義**
 *
 * MockMessagePipelineProvider の内部状態を表す型。
 * MessagePipelineInternalState を拡張し、モック固有の状態を追加。
 */
type MockMessagePipelineState = MessagePipelineInternalState & {
  /** モックプロパティ */
  mockProps: MockMessagePipelineProps;
  /** 状態更新ディスパッチ関数 */
  dispatch: (
    action:
      | MessagePipelineStateAction
      | { type: "set-mock-props"; mockProps: MockMessagePipelineProps },
  ) => void;
};

/**
 * **パブリック状態生成関数**
 *
 * MockMessagePipelineProps からMessagePipelineContext のパブリック状態を生成する。
 * 時刻計算、デフォルト値設定、コールバック関数の作成を行う。
 *
 * @param prevState - 前回の状態（最適化のため）
 * @param props - モックプロパティ
 * @param dispatch - 状態更新ディスパッチ関数
 * @param promisesToWaitForRef - フレーム一時停止Promise参照
 * @returns パブリック状態オブジェクト（messageEventsBySubscriberId除く）
 *
 * ## 主な処理
 *
 * ### 時刻計算ロジック
 * 1. メッセージから最小時刻をstartTimeとして算出
 * 2. メッセージから最大時刻をcurrentTimeとして算出
 * 3. propsで明示的に指定された時刻を優先
 *
 * ### デフォルト値設定
 * - データ型: 空のMap
 * - 開始時刻: { sec: 100, nsec: 0 }
 * - Player存在状態: PRESENT
 * - 再生速度: 0.2
 *
 * ### コールバック最適化
 * - 前回と同じ関数参照の場合は再利用
 * - 新しい関数の場合のみ新規作成
 * - メモ化による不要な再レンダリング防止
 *
 * @example
 * ```typescript
 * const publicState = getPublicState(
 *   prevState,
 *   mockProps,
 *   dispatch,
 *   promisesToWaitForRef
 * );
 * console.log(publicState.playerState.activeData?.currentTime);
 * ```
 */
function getPublicState(
  prevState: MockMessagePipelineState | undefined,
  props: MockMessagePipelineProps,
  dispatch: MockMessagePipelineState["dispatch"],
  promisesToWaitForRef: MutableRefObject<FramePromise[]>,
): Omit<MessagePipelineInternalState["public"], "messageEventsBySubscriberId"> {
  // メッセージから時刻を自動計算
  let startTime = prevState?.public.playerState.activeData?.startTime;
  let currentTime = props.currentTime;
  if (!currentTime) {
    for (const message of props.messages ?? []) {
      if (startTime == undefined || isLessThan(message.receiveTime, startTime)) {
        startTime = message.receiveTime;
      }
      if (!currentTime || isLessThan(currentTime, message.receiveTime)) {
        currentTime = message.receiveTime;
      }
    }
  }

  return {
    playerState: {
      name: props.name,
      presence: props.presence ?? PlayerPresence.PRESENT,
      playerId: props.playerId ?? "1",
      progress: props.progress ?? {},
      capabilities: props.capabilities ?? prevState?.public.playerState.capabilities ?? [],
      profile: props.profile,
      alerts: props.alerts,
      urlState: props.urlState,
      activeData:
        props.noActiveData === true
          ? undefined
          : {
              messages: props.messages ?? [],
              topics: props.topics ?? [],
              topicStats: props.topicStats ?? new Map(),
              datatypes: props.datatypes ?? NO_DATATYPES,
              startTime: props.startTime ?? startTime ?? { sec: 100, nsec: 0 },
              currentTime: currentTime ?? { sec: 100, nsec: 0 },
              endTime: props.endTime ?? currentTime ?? { sec: 100, nsec: 0 },
              isPlaying: props.isPlaying ?? false,
              speed: 0.2,
              lastSeekTime: 0,
              totalBytesReceived: 0,
              ...props.activeData,
            },
    },
    subscriptions: [],
    sortedTopics:
      props.topics === prevState?.mockProps.topics
        ? prevState?.public.sortedTopics ?? []
        : props.topics
          ? [...props.topics].sort((a, b) => a.name.localeCompare(b.name))
          : [],
    datatypes: props.datatypes ?? NO_DATATYPES,
    setSubscriptions:
      (props.setSubscriptions === prevState?.mockProps.setSubscriptions
        ? prevState?.public.setSubscriptions
        : undefined) ??
      ((id, payloads) => {
        dispatch({ type: "update-subscriber", id, payloads });
        props.setSubscriptions?.(id, payloads);
      }),
    setPublishers:
      (props.setPublishers === prevState?.mockProps.setPublishers
        ? prevState?.public.setPublishers
        : undefined) ??
      ((id, payloads) => {
        dispatch({ type: "set-publishers", id, payloads });
        props.setPublishers?.(id, payloads);
      }),
    setParameter: props.setParameter ?? noop,
    publish: props.publish ?? noop,
    callService: props.callService ?? (async () => {}),
    fetchAsset:
      props.fetchAsset ??
      (async () => {
        throw new Error(`not supported`);
      }),
    startPlayback: props.startPlayback,
    playUntil: noop,
    pausePlayback: props.pausePlayback,
    setPlaybackSpeed:
      props.capabilities?.includes(PLAYER_CAPABILITIES.setSpeed) === true ? noop : undefined,
    seekPlayback: props.seekPlayback,
    getMetadata: () => {
      const mockMetadata: ReadonlyArray<Readonly<Metadata>> = [
        {
          name: "mockMetadata",
          metadata: { key: "value" },
        },
      ];
      freezeMetadata(mockMetadata);
      return mockMetadata;
    },
    pauseFrame:
      props.pauseFrame ??
      function (name) {
        const condvar = new Condvar();
        promisesToWaitForRef.current.push({ name, promise: condvar.wait() });
        return () => {
          condvar.notifyAll();
        };
      },
  };
}

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
export default function MockMessagePipelineProvider(
  props: React.PropsWithChildren<MockMessagePipelineProps>,
): React.ReactElement {
  /** フレーム一時停止用Promise参照 */
  const promisesToWaitForRef = useRef<FramePromise[]>([]);

  /** 開始時刻参照（メッセージから自動計算用） */
  const startTime = useRef<Time | undefined>();

  // メッセージから現在時刻を自動計算
  let currentTime = props.currentTime;
  if (!currentTime) {
    for (const message of props.messages ?? []) {
      if (startTime.current == undefined || isLessThan(message.receiveTime, startTime.current)) {
        startTime.current = message.receiveTime;
      }
      if (!currentTime || isLessThan(currentTime, message.receiveTime)) {
        currentTime = message.receiveTime;
      }
    }
  }

  /** サブスクライバー存在フラグ（メッセージ配信制御用） */
  const [hasSubscribers, setHasSubscribers] = useState<boolean>(false);

  /**
   * **モックプロパティのメモ化**
   *
   * サブスクライバーの存在に基づいてメッセージの配信を制御する。
   * 実際のPlayer の動作を模倣し、サブスクライバー設定後にのみメッセージを配信。
   *
   * ## 処理ロジック
   * 1. hasSubscribers が false の場合、messages を除外
   * 2. hasSubscribers が true になった際、シークバックフィルをシミュレート
   * 3. lastSeekTime をインクリメントして新規サブスクライバー向けの配信を表現
   */
  const mockProps = useMemo(() => {
    // サブスクライバーが存在する場合のみメッセージを含める
    // 実際のPlayer の動作を模倣し、サブスクライバー設定前のメッセージ配信を防ぐ
    if (hasSubscribers) {
      const propsNoChildren = _.omit(props, "children");
      // 新規サブスクライバー追加後のシークバックフィル動作を模倣
      // モック用途では初回サブスクライバー追加時のみ発生（hasSubscribers はリセットしない）
      if (props.noActiveData === true) {
        return propsNoChildren;
      }
      const activeData = {
        ...propsNoChildren.activeData,
      };

      activeData.lastSeekTime = (activeData.lastSeekTime ?? 0) + 1;

      return {
        ...propsNoChildren,
        activeData,
      };
    }
    return _.omit(props, ["children", "messages"]);
  }, [props, hasSubscribers]);

  /**
   * **Zustand ストア初期化**
   *
   * MockMessagePipelineState を管理するZustand ストアを作成。
   * 状態更新ディスパッチ、フレーム一時停止、初期状態設定を行う。
   */
  const [store] = useState(() =>
    createStore<MockMessagePipelineState>((set) => {
      /**
       * **状態更新ディスパッチ関数**
       *
       * MessagePipelineStateAction またはモック固有のアクションを処理。
       * フレーム一時停止Promise の待機、状態更新、サブスクライバー検出を行う。
       *
       * @param action - 実行するアクション
       */
      const dispatch: MockMessagePipelineState["dispatch"] = async (action) => {
        // フレーム一時停止Promise が存在する場合は待機
        const promisesToWaitFor = promisesToWaitForRef.current;
        if (promisesToWaitFor.length > 0) {
          await pauseFrameForPromises(promisesToWaitFor);
          // ストーリー使用時の安全性のため、Promise 解決後にクリア
          // 通常のPlayer リスナーでは await 前にクリアするが、ストーリーでは不十分な場合がある
          promisesToWaitForRef.current = [];
        }

        if (action.type === "set-mock-props") {
          // モックプロパティ更新アクション
          set((state) => {
            const actionMockProps = action.mockProps;
            if (shallowequal(state.mockProps, actionMockProps)) {
              return state;
            }
            const publicState = getPublicState(
              state,
              actionMockProps,
              state.dispatch,
              promisesToWaitForRef,
            );
            const newState = reducer(state, {
              type: "update-player-state",
              playerState: publicState.playerState as Writable<PlayerState>,
            });
            return {
              ...newState,
              mockProps: actionMockProps,
              dispatch: state.dispatch,
              public: {
                ...publicState,
                messageEventsBySubscriberId: newState.public.messageEventsBySubscriberId,
              },
            };
          });
        } else {
          // 通常のMessagePipelineStateAction
          set((state) => {
            const newState = reducer(state, action);

            // 新規サブスクライバー検出
            if (
              !hasSubscribers &&
              action.type === "update-subscriber" &&
              action.payloads.length > 0
            ) {
              setHasSubscribers(true);
            }

            return { ...newState, dispatch: state.dispatch };
          });
        }
      };

      /**
       * **リセット関数（未実装）**
       *
       * モック環境ではリセット機能は提供しない。
       */
      const reset = () => {
        throw new Error("not implemented");
      };

      // 初期パブリック状態の生成
      const initialPublicState = getPublicState(
        undefined,
        mockProps,
        dispatch,
        promisesToWaitForRef,
      );

      // 初期ストア状態
      return {
        mockProps,
        player: undefined,
        dispatch,
        reset,
        subscriptionMemoizer: makeSubscriptionMemoizer(),
        publishersById: {},
        allPublishers: [],
        subscriptionsById: new Map(),
        subscriberIdsByTopic: new Map(),
        newTopicsBySubscriberId: new Map(),
        lastMessageEventByTopic: new Map(),
        lastCapabilities: [...initialPublicState.playerState.capabilities],
        public: {
          ...initialPublicState,
          messageEventsBySubscriberId: new Map(),
        },
      };
    }),
  );

  /**
   * **プロパティ変更の監視とストア更新**
   *
   * useLayoutEffect ではなくuseEffect を使用する理由：
   * 1. 子コンポーネントのuseEffect でサブスクライバー設定を先に実行
   * 2. その後でモックプロパティを設定してメッセージ配信
   * 3. サブスクライバー未設定時のメッセージ配信を防ぐ（実際の動作と一致）
   *
   * useLayoutEffect を使用すると、サブスクライバー設定前に初期メッセージが
   * 配信されてしまい、実際の動作と不整合が生じる。
   */
  useEffect(() => {
    store.getState().dispatch({ type: "set-mock-props", mockProps });
  }, [mockProps, store]);

  return <ContextInternal.Provider value={store}>{props.children}</ContextInternal.Provider>;
}

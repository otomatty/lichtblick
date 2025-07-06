// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * @fileoverview MessagePipeline型定義 - データ処理パイプラインの中核型システム
 *
 * このファイルは、Lichtblickアプリケーションにおけるデータ処理パイプラインの
 * 中核となる型定義を提供している。MessagePipelineContextは、パネル、Player、
 * 状態管理システム間の統一インターフェースとして機能する重要な型定義。
 *
 * ## アーキテクチャ概要
 *
 * ### 1. MessagePipelineContext - 統一データアクセス層
 * - **Player状態管理**: リアルタイムデータソースの状態とメタデータ
 * - **トピック管理**: ROSトピックの動的管理とソート
 * - **サブスクリプション制御**: パネル別のデータ購読管理
 * - **メッセージ配信**: 効率的なメッセージルーティングシステム
 * - **再生制御**: タイムライン操作とプレイバック制御
 *
 * ### 2. データフロー設計
 * ```
 * Player → MessagePipeline → Panel Components
 *   ↓           ↓                ↑
 * PlayerState → Context → useMessagePipeline()
 * ```
 *
 * ### 3. パフォーマンス最適化
 * - **Immutable設計**: 不変性によるReact最適化
 * - **購読者別配信**: メッセージの効率的な分散
 * - **フレーム制御**: 描画フレームレートの動的調整
 * - **メモリ管理**: 大容量データの効率的な処理
 *
 * ## 主要機能
 *
 * ### メッセージ配信システム
 * - パネル別のメッセージ配信（messageEventsBySubscriberId）
 * - トピック別の購読者管理
 * - バックフィル機能による過去データアクセス
 * - リアルタイムストリーミング対応
 *
 * ### 再生制御システム
 * - タイムライン操作（seekPlayback, playUntil）
 * - 再生速度制御（setPlaybackSpeed）
 * - 一時停止/再開制御（pausePlayback, startPlayback）
 * - フレーム単位の精密制御（pauseFrame）
 *
 * ### パブリッシュ/サブスクライブシステム
 * - 動的サブスクリプション管理（setSubscriptions）
 * - パブリッシャー登録（setPublishers）
 * - ROSサービス呼び出し（callService）
 * - パラメータ設定（setParameter）
 *
 * ## 設計思想
 *
 * ### 1. 統一インターフェース
 * 異なるデータソース（bag、MCAP、ライブ接続等）に対して
 * 統一されたアクセス方法を提供し、パネル実装の複雑さを軽減
 *
 * ### 2. 非同期処理対応
 * 大容量データやネットワーク処理に対応した非同期API設計
 * Promise/async-awaitパターンの一貫した使用
 *
 * ### 3. 拡張性
 * 新しいデータソースやパネルタイプに対応可能な
 * 柔軟なアーキテクチャ設計
 *
 * @see {@link ../store.ts} - 状態管理の実装詳細
 * @see {@link ../index.tsx} - Provider実装
 * @see {@link ../../players/types.ts} - Player型定義
 */

import { Time } from "@lichtblick/rostime";
import { Immutable, MessageEvent, Metadata, ParameterValue } from "@lichtblick/suite";
import { BuiltinPanelExtensionContext } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import {
  AdvertiseOptions,
  PlayerState,
  PublishPayload,
  SubscribePayload,
  Topic,
} from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";

/**
 * フレーム再開関数型
 * pauseFrame()によって一時停止されたフレーム処理を再開するための関数
 */
type ResumeFrame = () => void;

/**
 * MessagePipelineContext - データ処理パイプラインの中核インターフェース
 *
 * このインターフェースは、Lichtblickアプリケーション全体でのデータアクセス、
 * 状態管理、再生制御の統一APIを提供する。すべてのパネルコンポーネントは
 * このコンテキストを通じてデータにアクセスし、システムと相互作用する。
 *
 * ## 主要責任
 *
 * ### 1. データアクセス統一化
 * - 異なるPlayerタイプ（bag、MCAP、ライブ等）への統一インターフェース
 * - トピック情報とデータ型の一元管理
 * - メッセージデータの効率的な配信
 *
 * ### 2. サブスクリプション管理
 * - パネル別のデータ購読制御
 * - 動的なサブスクリプション変更対応
 * - 重複購読の最適化
 *
 * ### 3. 再生制御
 * - タイムライン操作の統一API
 * - フレームレート制御
 * - 一時停止/再開機能
 *
 * ## パフォーマンス特性
 *
 * ### Immutableデザイン
 * 全てのプロパティがImmutableとして定義されており、React最適化と
 * 予期しない状態変更の防止を実現している。
 *
 * ### 効率的なメッセージ配信
 * messageEventsBySubscriberIdによって、各パネルが必要なメッセージのみを
 * 受信する仕組みを実装している。
 *
 * ### フレーム制御
 * pauseFrame機能により、重い処理を行うパネルが描画フレームを
 * 適切に制御できる仕組みを提供している。
 *
 * @example パネルでの基本的な使用例
 * ```tsx
 * function MyPanel() {
 *   const { playerState, messageEventsBySubscriberId, setSubscriptions } = useMessagePipeline(
 *     useCallback((ctx) => ({
 *       playerState: ctx.playerState,
 *       messageEventsBySubscriberId: ctx.messageEventsBySubscriberId,
 *       setSubscriptions: ctx.setSubscriptions,
 *     }), [])
 *   );
 *
 *   useEffect(() => {
 *     setSubscriptions("myPanel", [{ topic: "/pose", preload: false }]);
 *   }, [setSubscriptions]);
 *
 *   const messages = messageEventsBySubscriberId.get("myPanel") ?? [];
 *   return <div>Received {messages.length} messages</div>;
 * }
 * ```
 *
 * @example フレーム制御の使用例
 * ```tsx
 * function HeavyProcessingPanel() {
 *   const pauseFrame = useMessagePipeline(useCallback((ctx) => ctx.pauseFrame, []));
 *
 *   const processHeavyData = useCallback(async (data) => {
 *     const resume = pauseFrame("heavy-processing");
 *     try {
 *       await heavyAsyncOperation(data);
 *     } finally {
 *       resume();
 *     }
 *   }, [pauseFrame]);
 * }
 * ```
 */
export type MessagePipelineContext = Immutable<{
  /**
   * 現在のPlayer状態
   * データソースの接続状態、進行状況、エラー情報等を含む
   */
  playerState: PlayerState;

  /**
   * ソート済みトピック一覧
   * 利用可能な全ROSトピックをアルファベット順にソートした配列
   * UIでのトピック選択等に使用される
   */
  sortedTopics: Topic[];

  /**
   * ROSデータ型定義マップ
   * 各メッセージタイプの構造定義を格納
   * メッセージの解析と表示に使用される
   */
  datatypes: RosDatatypes;

  /**
   * 現在のサブスクリプション一覧
   * 全パネルからのサブスクリプションをマージした結果
   * Playerに送信される実際の購読リスト
   */
  subscriptions: SubscribePayload[];

  /**
   * 購読者別メッセージマップ
   * 各パネル（購読者ID）が受信したメッセージの配列を格納
   * Key: パネルのsubscriber ID, Value: そのパネル宛のメッセージ配列
   */
  messageEventsBySubscriberId: Map<string, MessageEvent[]>;

  /**
   * サブスクリプション設定関数
   * 指定されたパネルIDのサブスクリプションを更新する
   *
   * @param id - パネルの一意識別子
   * @param subscriptionsForId - そのパネルの新しいサブスクリプション配列
   */
  setSubscriptions: (id: string, subscriptionsForId: Immutable<SubscribePayload[]>) => void;

  /**
   * パブリッシャー設定関数
   * 指定されたパネルIDのパブリッシャーを登録する
   *
   * @param id - パネルの一意識別子
   * @param publishersForId - そのパネルのパブリッシャー設定配列
   */
  setPublishers: (id: string, publishersForId: AdvertiseOptions[]) => void;

  /**
   * パラメータ設定関数
   * ROSパラメータサーバーにパラメータを設定する
   *
   * @param key - パラメータ名
   * @param value - 設定する値
   */
  setParameter: (key: string, value: ParameterValue) => void;

  /**
   * メッセージ発行関数
   * ROSトピックにメッセージを発行する
   *
   * @param request - 発行するメッセージの内容
   */
  publish: (request: PublishPayload) => void;

  /**
   * メタデータ取得関数
   * データソースのメタデータ情報を取得する
   *
   * @returns メタデータの読み取り専用配列
   */
  getMetadata: () => ReadonlyArray<Readonly<Metadata>>;

  /**
   * ROSサービス呼び出し関数
   * ROSサービスを非同期で呼び出す
   *
   * @param service - サービス名
   * @param request - リクエストデータ
   * @returns サービスのレスポンス
   */
  callService: (service: string, request: unknown) => Promise<unknown>;

  /**
   * アセット取得関数
   * 拡張機能やリソースファイルを取得する
   * package://スキームやHTTPリソースに対応
   */
  fetchAsset: BuiltinPanelExtensionContext["unstable_fetchAsset"];

  /**
   * 再生開始関数（オプショナル）
   * データソースが再生制御をサポートする場合のみ利用可能
   */
  startPlayback?: () => void;

  /**
   * 再生一時停止関数（オプショナル）
   * データソースが再生制御をサポートする場合のみ利用可能
   */
  pausePlayback?: () => void;

  /**
   * 指定時刻まで再生関数（オプショナル）
   * 指定された時刻まで再生を続ける
   *
   * @param time - 再生停止時刻
   */
  playUntil?: (time: Time) => void;

  /**
   * 再生速度設定関数（オプショナル）
   * 再生速度を動的に変更する
   *
   * @param speed - 再生速度（1.0が通常速度）
   */
  setPlaybackSpeed?: (speed: number) => void;

  /**
   * シーク関数（オプショナル）
   * 指定された時刻にジャンプする
   *
   * @param time - シーク先の時刻
   */
  seekPlayback?: (time: Time) => void;

  /**
   * フレーム一時停止関数
   * 重い処理を行う際に描画フレームを一時停止し、
   * 処理完了後に再開するための制御機能
   *
   * 使用例：
   * - 大量データの処理時
   * - 非同期リソース読み込み時
   * - 重いレンダリング処理時
   *
   * @param name - 一時停止の理由を示す名前（デバッグ用）
   * @returns フレーム再開関数
   */
  pauseFrame: (name: string) => ResumeFrame;
}>;

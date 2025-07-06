// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * Scrubber - 統合タイムライン操作コンポーネント
 *
 * @overview
 * 動画再生システムの核心となるタイムライン操作コンポーネント。
 * スクラブバー、進捗表示、イベント表示、ホバー処理を統合し、
 * 直感的な時間操作とリアルタイムフィードバックを提供。
 * 複数のLichtblickインスタンス間での同期機能も包含。
 *
 * @features
 * - **タイムライン操作**: ドラッグ＆ドロップによる直感的シーク
 * - **進捗表示**: データ読み込み状況の視覚化
 * - **イベント表示**: タイムライン上のイベントマーカー
 * - **ホバーフィードバック**: 時刻情報とイベント詳細のツールチップ
 * - **読み込み状態**: バッファリング中の視覚的インジケーター
 * - **同期機能**: BroadcastManagerによる複数インスタンス同期
 * - **時間範囲制御**: 開始・終了時刻に基づく操作制限
 *
 * @architecture
 * - **レイヤー構造**: 複数のコンポーネントを重ねた階層型アーキテクチャ
 * - **MessagePipeline統合**: プレイヤー状態とのリアルタイム同期
 * - **Context統合**: TimelineInteractionStateContextによる状態管理
 * - **BroadcastManager**: 複数インスタンス間でのシーク同期
 * - **Material-UI**: Tooltip, Popperによる高度なホバー処理
 *
 * @layerStructure
 * ```
 * Scrubber (Root Container)
 * ├── Track (Background)
 * ├── ProgressPlot (Data Loading Progress)
 * ├── Slider (Interactive Timeline)
 * ├── EventsOverlay (Event Markers)
 * ├── PlaybackBarHoverTicks (Hover Indicators)
 * └── Tooltip (Time Information)
 * ```
 *
 * @interactionFlow
 * 1. **ホバー開始**: マウスがスクラブバーに入る
 * 2. **位置計算**: fraction値（0-1）の計算
 * 3. **時刻変換**: fraction → 実際の時刻
 * 4. **状態更新**: TimelineInteractionStateContextに通知
 * 5. **UI更新**: ツールチップ表示、ホバーティック表示
 * 6. **操作実行**: クリック/ドラッグ時のシーク処理
 * 7. **同期送信**: BroadcastManagerによる他インスタンス同期
 *
 * @performanceOptimizations
 * - **useLatest**: 最新の状態値へのアクセス最適化
 * - **useCallback**: イベントハンドラーのメモ化
 * - **useMemo**: 複雑な計算結果のキャッシュ
 * - **React.useRef**: Popper インスタンスの効率的管理
 * - **条件付きレンダリング**: 不要な再描画の削減
 *
 * @contextIntegration
 * - **MessagePipelineContext**: プレイヤー状態の監視
 * - **TimelineInteractionStateContext**: ホバー状態の管理
 * - **BroadcastManager**: 複数インスタンス間の同期
 *
 * @visualBehavior
 * - **通常状態**: 半透明の背景トラック
 * - **無効状態**: 透明度の低下
 * - **ホバー状態**: ツールチップとティック表示
 * - **読み込み中**: 縞模様アニメーション
 * - **イベント表示**: 時間範囲マーカー
 *
 * @broadcastSync
 * シーク操作時に他のLichtblickインスタンスに同期信号を送信：
 * ```typescript
 * BroadcastManager.getInstance().postMessage({
 *   type: "seek",
 *   time: targetTime,
 * });
 * ```
 *
 * @dependencies
 * - **@lichtblick/rostime**: 時刻計算とフォーマット処理
 * - **@lichtblick/suite-base/components/MessagePipeline**: プレイヤー状態監視
 * - **@lichtblick/suite-base/context/TimelineInteractionStateContext**: ホバー状態管理
 * - **@lichtblick/suite-base/util/broadcast/BroadcastManager**: 同期機能
 * - **@popperjs/core**: 高度なツールチップ配置
 * - **Material-UI**: Tooltip, Fadeコンポーネント
 * - **react-use**: useLatestフック
 * - **uuid**: ユニークなコンポーネントID生成
 *
 * @usageExample
 * ```tsx
 * <Scrubber
 *   onSeek={(time) => player.seek(time)}
 * />
 * ```
 *
 * @relatedComponents
 * - **Slider**: 基本的なタイムライン操作機能
 * - **ProgressPlot**: データ読み込み進捗表示
 * - **EventsOverlay**: イベントマーカー表示
 * - **PlaybackBarHoverTicks**: ホバー時のティック表示
 * - **PlaybackControlsTooltipContent**: ツールチップ内容生成
 * - **PlaybackControls**: 親コンポーネント（統合再生制御）
 */

import { Fade, PopperProps, Tooltip } from "@mui/material";
import type { Instance } from "@popperjs/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLatest } from "react-use";
import { makeStyles } from "tss-react/mui";
import { v4 as uuidv4 } from "uuid";

import {
  subtract as subtractTimes,
  add as addTimes,
  toSec,
  fromSec,
  Time,
} from "@lichtblick/rostime";
import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@lichtblick/suite-base/components/MessagePipeline";
import Stack from "@lichtblick/suite-base/components/Stack";
import {
  useClearHoverValue,
  useSetHoverValue,
} from "@lichtblick/suite-base/context/TimelineInteractionStateContext";
import { PlayerPresence } from "@lichtblick/suite-base/players/types";
import BroadcastManager from "@lichtblick/suite-base/util/broadcast/BroadcastManager";

import { EventsOverlay } from "./EventsOverlay";
import PlaybackBarHoverTicks from "./PlaybackBarHoverTicks";
import { PlaybackControlsTooltipContent } from "./PlaybackControlsTooltipContent";
import { ProgressPlot } from "./ProgressPlot";
import Slider, { HoverOverEvent } from "./Slider";

/**
 * Scrubber コンポーネントのスタイル定義
 *
 * @returns スタイルクラス定義
 */
const useStyles = makeStyles()((theme) => ({
  /**
   * 現在位置マーカーのスタイル
   *
   * @style
   * - 背景色: テーマのプライマリテキスト色
   * - 位置: 絶対位置で中央揃え
   * - サイズ: 高さ16px、幅2px
   * - 形状: 角丸のバー形状
   * - 変形: X軸中央揃え
   */
  marker: {
    backgroundColor: theme.palette.text.primary,
    position: "absolute",
    height: 16,
    borderRadius: 1,
    width: 2,
    transform: "translate(-50%, 0)",
  },
  /**
   * タイムライントラックのスタイル
   *
   * @style
   * - 位置: 絶対位置で全幅
   * - 高さ: 6px（コンパクト設計）
   * - 背景色: action.focusカラー
   */
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: theme.palette.action.focus,
  },
  /**
   * 無効状態のトラックスタイル
   *
   * @style
   * - 透明度: テーマの無効状態透明度
   */
  trackDisabled: {
    opacity: theme.palette.action.disabledOpacity,
  },
}));

// MessagePipeline セレクター関数群
/**
 * プレイヤー状態から開始時刻を取得
 *
 * @description
 * MessagePipelineコンテキストから再生データの開始時刻を取得するセレクター関数。
 * タイムライン操作の基準点として使用され、シーク操作の下限値を決定。
 *
 * @param ctx - MessagePipelineコンテキスト
 * @returns 開始時刻 | undefined（データが無効な場合）
 */
const selectStartTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.startTime;

/**
 * プレイヤー状態から現在時刻を取得
 *
 * @description
 * MessagePipelineコンテキストから現在の再生時刻を取得するセレクター関数。
 * タイムライン上の現在位置マーカーの表示に使用され、リアルタイムで更新。
 *
 * @param ctx - MessagePipelineコンテキスト
 * @returns 現在時刻 | undefined（データが無効な場合）
 */
const selectCurrentTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.currentTime;

/**
 * プレイヤー状態から終了時刻を取得
 *
 * @description
 * MessagePipelineコンテキストから再生データの終了時刻を取得するセレクター関数。
 * タイムライン操作の上限値を決定し、シーク操作の範囲制限に使用。
 *
 * @param ctx - MessagePipelineコンテキスト
 * @returns 終了時刻 | undefined（データが無効な場合）
 */
const selectEndTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.endTime;

/**
 * プレイヤー状態から読み込み範囲を取得
 *
 * @description
 * MessagePipelineコンテキストから完全に読み込み済みのデータ範囲を取得するセレクター関数。
 * ProgressPlotコンポーネントでの進捗表示に使用され、利用可能なデータ範囲を視覚化。
 *
 * @param ctx - MessagePipelineコンテキスト
 * @returns 読み込み済み範囲の配列
 */
const selectRanges = (ctx: MessagePipelineContext) =>
  ctx.playerState.progress.fullyLoadedFractionRanges;

/**
 * プレイヤー状態から存在状態を取得
 *
 * @description
 * MessagePipelineコンテキストからプレイヤーの存在状態を取得するセレクター関数。
 * 読み込み中、バッファリング中、エラー状態などの判定に使用され、
 * UI要素の無効化や読み込みインジケーターの表示制御に影響。
 *
 * @param ctx - MessagePipelineコンテキスト
 * @returns プレイヤー存在状態（INITIALIZING, BUFFERING, PRESENT, ERROR等）
 */
const selectPresence = (ctx: MessagePipelineContext) => ctx.playerState.presence;

/**
 * Scrubber コンポーネントのプロパティ定義
 *
 * @interface Props
 */
type Props = {
  /** シーク操作時のコールバック関数 */
  onSeek: (seekTo: Time) => void;
};

/**
 * Scrubber メインコンポーネント
 *
 * @description
 * 統合タイムライン操作コンポーネント。複数のサブコンポーネントを組み合わせて
 * 直感的な時間操作機能を提供。MessagePipelineとの統合により、
 * プレイヤー状態をリアルタイムで反映。
 *
 * @param props - コンポーネントのプロパティ
 * @returns 統合タイムライン操作コンポーネント
 */
export default function Scrubber(props: Props): React.JSX.Element {
  const { onSeek } = props;
  const { classes, cx } = useStyles();

  /**
   * ユニークなコンポーネントID
   *
   * @description
   * 他のコンポーネントと区別するためのユニークなID。
   * TimelineInteractionStateContextでのホバー状態管理に使用され、
   * 複数のタイムライン操作コンポーネントが同時に存在する場合の
   * 状態の競合を防ぐ。一度生成されたIDは再生成されない。
   */
  const [hoverComponentId] = useState<string>(() => uuidv4());

  // MessagePipelineから状態を取得
  const startTime = useMessagePipeline(selectStartTime);
  const currentTime = useMessagePipeline(selectCurrentTime);
  const endTime = useMessagePipeline(selectEndTime);
  const presence = useMessagePipeline(selectPresence);
  const ranges = useMessagePipeline(selectRanges);

  // TimelineInteractionStateContextとの統合
  const setHoverValue = useSetHoverValue();

  /**
   * ホバー情報の型定義
   *
   * @interface HoverInfo
   * @description
   * マウスホバー時の詳細情報を管理する型。
   * ツールチップ表示とホバーティック表示のために使用。
   */
  type HoverInfo = {
    /** ホバー位置の時刻 */
    stamp: Time;
    /** マウスのX座標（クライアント座標系） */
    clientX: number;
    /** マウスのY座標（クライアント座標系） */
    clientY: number;
  };

  /**
   * ホバー情報の状態管理
   *
   * @state
   * @description
   * 現在のマウスホバー情報を管理する状態。
   * - undefined: ホバーしていない状態
   * - HoverInfo: ホバー中の詳細情報（時刻、座標）
   * ツールチップの表示制御とPopperの位置決定に使用。
   */
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | undefined>();

  /**
   * 最新のホバー情報への参照
   *
   * @description
   * useLatestフックにより、コールバック関数内で最新のホバー情報にアクセス可能。
   * React のクロージャ問題を解決し、非同期処理での最新状態の参照を保証。
   */
  const latestHoverInfo = useLatest(hoverInfo);

  /**
   * 最新の開始時刻への参照
   *
   * @description
   * useLatestフックにより、コールバック関数内で最新の開始時刻にアクセス可能。
   * onChange、onHoverOverコールバック内での正確な時刻計算を保証。
   */
  const latestStartTime = useLatest(startTime);

  /**
   * 最新の終了時刻への参照
   *
   * @description
   * useLatestフックにより、コールバック関数内で最新の終了時刻にアクセス可能。
   * onChange、onHoverOverコールバック内での正確な時刻計算を保証。
   */
  const latestEndTime = useLatest(endTime);

  /**
   * タイムライン位置変更時の処理
   *
   * @description
   * fraction値（0-1）を実際の時刻に変換し、シーク操作を実行。
   * 同時にBroadcastManagerを通じて他のインスタンスに同期信号を送信。
   *
   * @algorithm
   * 1. 開始時刻・終了時刻の存在確認
   * 2. 全再生時間の計算: endTime - startTime
   * 3. 目標時刻の計算: startTime + (fraction * 全再生時間)
   * 4. onSeekコールバック実行
   * 5. BroadcastManagerによる同期信号送信
   *
   * @synchronization
   * BroadcastManagerを通じて他のLichtblickインスタンスに以下の情報を送信：
   * - type: "seek"
   * - time: 計算された目標時刻
   *
   * @param fraction - タイムライン上の位置（0-1の範囲）
   */
  const onChange = useCallback(
    (fraction: number) => {
      if (!latestStartTime.current || !latestEndTime.current) {
        return;
      }
      const timeToSeek = addTimes(
        latestStartTime.current,
        fromSec(fraction * toSec(subtractTimes(latestEndTime.current, latestStartTime.current))),
      );
      onSeek(timeToSeek);
      BroadcastManager.getInstance().postMessage({
        type: "seek",
        time: timeToSeek,
      });
    },
    [onSeek, latestEndTime, latestStartTime],
  );

  /**
   * ホバー開始時の処理
   *
   * @description
   * マウスホバー時に時刻計算と状態更新を実行。
   * ツールチップ表示とタイムライン上のティック表示を制御。
   *
   * @algorithm
   * 1. 開始時刻・終了時刻の存在確認
   * 2. 全再生時間の計算: endTime - startTime（秒単位）
   * 3. 開始時刻からの経過時間の計算: fraction * 全再生時間
   * 4. 絶対時刻の計算: startTime + 経過時間
   * 5. ローカルホバー情報の更新
   * 6. グローバルホバー状態の更新（TimelineInteractionStateContext）
   *
   * @contextIntegration
   * TimelineInteractionStateContextに以下の情報を設定：
   * - componentId: このコンポーネントのユニークID
   * - type: "PLAYBACK_SECONDS"
   * - value: 開始時刻からの経過秒数
   *
   * @param event - ホバーイベント情報
   */
  const onHoverOver = useCallback(
    ({ fraction, clientX, clientY }: HoverOverEvent) => {
      if (!latestStartTime.current || !latestEndTime.current) {
        return;
      }
      const duration = toSec(subtractTimes(latestEndTime.current, latestStartTime.current));
      const timeFromStart = fromSec(fraction * duration);
      setHoverInfo({ stamp: addTimes(latestStartTime.current, timeFromStart), clientX, clientY });
      setHoverValue({
        componentId: hoverComponentId,
        type: "PLAYBACK_SECONDS",
        value: toSec(timeFromStart),
      });
    },
    [hoverComponentId, latestEndTime, latestStartTime, setHoverValue],
  );

  const clearHoverValue = useClearHoverValue();

  /**
   * ホバー終了時の処理
   *
   * @description
   * ホバー状態をクリアし、関連するUI要素を非表示にする。
   * - TimelineInteractionStateContextからこのコンポーネントの状態を削除
   * - ローカルホバー情報をクリア
   * - ツールチップとホバーティックを非表示
   */
  const onHoverOut = useCallback(() => {
    clearHoverValue(hoverComponentId);
    setHoverInfo(undefined);
  }, [clearHoverValue, hoverComponentId]);

  /**
   * コンポーネントのクリーンアップ
   *
   * @description
   * コンポーネントのアンマウント時にホバー状態をクリアし、
   * TimelineInteractionStateContextからの状態リークを防ぐ。
   */
  useEffect(() => onHoverOut, [onHoverOut]);

  /**
   * 現在位置マーカーのレンダリング
   *
   * @description
   * 現在の再生位置を視覚的に表示するマーカーを生成。
   * fraction値に基づいて位置を計算。
   *
   * @rendering
   * - 位置: fraction * 100% の左端からの相対位置
   * - スタイル: classes.marker（高さ16px、幅2px、角丸、中央揃え）
   * - 変形: transform: translate(-50%, 0) で中央配置
   *
   * @param val - 現在位置のfraction値（0-1）
   * @returns 位置マーカー要素 または undefined
   */
  const renderSlider = useCallback(
    (val?: number) => {
      if (val == undefined) {
        return undefined;
      }
      return <div className={classes.marker} style={{ left: `${val * 100}%` }} />;
    },
    [classes.marker],
  );

  /**
   * 時刻の秒値計算
   *
   * @description
   * 開始時刻・終了時刻をROS時刻形式から秒値に変換。
   * Sliderコンポーネントの無効化判定に使用。
   */
  const min = startTime && toSec(startTime);
  const max = endTime && toSec(endTime);

  /**
   * 現在位置のfraction値計算
   *
   * @description
   * 現在時刻を0-1の範囲に正規化。
   * 開始時刻と終了時刻の間での相対位置を計算。
   *
   * @calculation
   * fraction = (currentTime - startTime) / (endTime - startTime)
   *
   * @returns 0-1の範囲の値 | undefined（時刻が無効な場合）
   */
  const fraction =
    currentTime && startTime && endTime
      ? toSec(subtractTimes(currentTime, startTime)) / toSec(subtractTimes(endTime, startTime))
      : undefined;

  /**
   * 読み込み状態の判定
   *
   * @description
   * プレイヤーの存在状態に基づいて読み込み中かどうかを判定。
   * ProgressPlotコンポーネントでの読み込みアニメーション制御に使用。
   *
   * @states
   * - INITIALIZING: 初期化中
   * - BUFFERING: バッファリング中
   * 上記の状態時に読み込み中とみなす。
   */
  const loading = presence === PlayerPresence.INITIALIZING || presence === PlayerPresence.BUFFERING;

  /**
   * Popper インスタンスの管理
   *
   * @description
   * ツールチップのPopperインスタンスへの参照。
   * 位置の動的更新（update()呼び出し）に使用。
   */
  const popperRef = React.useRef<Instance>(ReactNull);

  /**
   * ホバー状態の判定
   *
   * @description
   * 現在ホバー中かどうかの判定。
   * ツールチップの表示制御に使用。
   */
  const isHovered = hoverInfo != undefined;

  /**
   * ツールチップのPopper設定
   *
   * @description
   * 高度なツールチップ配置とアニメーション設定。
   * ドラッグ中もツールチップを表示し続ける設定。
   *
   * @configuration
   * - open: ホバー状態でツールチップを表示
   * - popperRef: Popperインスタンスの参照
   * - modifiers: CSS GPU加速無効化、オフセット設定
   * - anchorEl: 仮想的なアンカー要素（マウス位置）
   *
   * @virtualAnchor
   * getBoundingClientRect を使用して、マウス位置を仮想的なアンカー要素として設定。
   * 実際のDOM要素ではなく、マウス座標に基づいた動的な位置決定を実現。
   */
  const popperProps: Partial<PopperProps> = useMemo(
    () => ({
      open: isHovered, // Keep the tooltip visible while dragging even when the mouse is outside the playback bar
      popperRef,
      modifiers: [
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false, // Fixes hairline seam on arrow in chrome.
          },
        },
        {
          name: "offset",
          options: {
            // Offset popper to hug the track better.
            offset: [0, 4],
          },
        },
      ],
      anchorEl: {
        getBoundingClientRect: () => {
          return new DOMRect(
            latestHoverInfo.current?.clientX ?? 0,
            latestHoverInfo.current?.clientY ?? 0,
            0,
            0,
          );
        },
      },
    }),
    [isHovered, latestHoverInfo],
  );

  /**
   * Popper位置の動的更新
   *
   * @description
   * ホバー情報が変更されるたびにPopperの位置を更新。
   * マウス移動に追従するツールチップを実現。
   *
   * @performance
   * useEffectによりhoverInfoの変更時のみ実行され、
   * 不要な位置更新を避ける。
   */
  useEffect(() => {
    if (popperRef.current != undefined) {
      void popperRef.current.update();
    }
  }, [hoverInfo]);

  return (
    <Tooltip
      title={
        hoverInfo != undefined ? <PlaybackControlsTooltipContent stamp={hoverInfo.stamp} /> : ""
      }
      placement="top"
      disableInteractive
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      PopperProps={popperProps}
    >
      <Stack
        direction="row"
        flexGrow={1}
        alignItems="center"
        position="relative"
        style={{ height: 32 }}
      >
        {/* 背景トラック */}
        <div className={cx(classes.track, { [classes.trackDisabled]: !startTime })} />

        {/* データ読み込み進捗表示 */}
        <Stack position="absolute" flex="auto" fullWidth style={{ height: 6 }}>
          <ProgressPlot loading={loading} availableRanges={ranges} />
        </Stack>

        {/* インタラクティブスライダー */}
        <Stack fullHeight fullWidth position="absolute" flex={1}>
          <Slider
            disabled={min == undefined || max == undefined}
            fraction={fraction}
            onHoverOver={onHoverOver}
            onHoverOut={onHoverOut}
            onChange={onChange}
            renderSlider={renderSlider}
          />
        </Stack>

        {/* イベントマーカー表示 */}
        <EventsOverlay />

        {/* ホバーティック表示 */}
        <PlaybackBarHoverTicks componentId={hoverComponentId} />
      </Stack>
    </Tooltip>
  );
}

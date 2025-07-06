import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import MockMessagePipelineProvider from "@lichtblick/suite-base/components/MessagePipeline/MockMessagePipelineProvider";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import { PlayerPresence } from "@lichtblick/suite-base/players/types";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
import { EndTimestamp } from "./EndTimestamp";
/**
 * Test Time Constants - テスト用時刻定数
 *
 * 様々な時刻表示パターンをテストするための固定時刻データ。
 */
// 絶対時刻テスト用（2022-02-02 12:15:42.222 UTC）
const ABSOLUTE_TIME = { sec: 1643800942, nsec: 222222222 };
// 相対時刻テスト用（約7日と3時間の経過時間）
const RELATIVE_TIME = { sec: 630720000, nsec: 597648236 };
/**
 * Meta Configuration - Storybookメタ設定
 *
 * EndTimestampストーリーの基本設定と共通デコレーターを定義。
 * アプリケーション設定とメッセージパイプラインの模擬環境を提供します。
 */
export default {
    title: "components/AppBar/EndTimestamp",
    component: EndTimestamp,
    args: {
        timezone: "UTC",
        time: ABSOLUTE_TIME,
    },
    decorators: [
        /**
         * Story Decorator - ストーリーデコレーター
         *
         * 各ストーリーに必要な設定環境とデータプロバイダーを提供：
         * - AppConfigurationContext: タイムゾーンと時刻フォーマット設定
         * - MockMessagePipelineProvider: 時刻データとPlayer状態の模擬
         * - スタイリング環境: パディングとレイアウト調整
         *
         * @param Story - ラップするストーリーコンポーネント
         * @param ctx - ストーリーコンテキスト（引数を含む）
         * @returns 装飾されたストーリー
         */
        (Story, ctx) => {
            const { args: { timeFormat, timezone, time, ...args }, } = ctx;
            // アプリケーション設定の模擬（タイムゾーンと時刻フォーマット）
            const [value] = useState(() => makeMockAppConfiguration([
                [AppSetting.TIMEZONE, timezone],
                [AppSetting.TIME_FORMAT, timeFormat],
            ]));
            return (_jsx(AppConfigurationContext.Provider, { value: value, children: _jsx(MockMessagePipelineProvider, { endTime: time, presence: PlayerPresence.PRESENT, children: _jsx("div", { style: { padding: 16 }, children: _jsx(Story, { ...args }) }) }) }));
        },
    ],
};
/**
 * Default Story - デフォルト表示ストーリー
 *
 * EndTimestampの基本的な表示状態を確認するストーリー。
 * 絶対時刻をUTCタイムゾーンで表示し、標準的な使用パターンを確認できます。
 */
export const Default = {};
/**
 * Time Format Seconds - 秒数フォーマット表示
 *
 * 時刻を秒数形式（SEC）で表示するストーリー。
 * Unix時刻やROSの標準時刻形式での表示を確認できます。
 */
export const TimeFormatSeconds = {
    args: { timeFormat: "SEC" },
};
/**
 * Time Format TOD - 時刻フォーマット表示
 *
 * 時刻を時刻形式（TOD: Time of Day）で表示するストーリー。
 * 人間が読みやすい時刻表示形式を確認できます。
 */
export const TimeFormatTOD = {
    args: { timeFormat: "TOD" },
};
/**
 * Time Format Relative - 相対時刻表示
 *
 * 相対時刻（経過時間）を表示するストーリー。
 * データ再生時の経過時間表示や、記録開始からの時間表示を確認できます。
 */
export const TimeFormatRelative = {
    args: { time: RELATIVE_TIME },
};

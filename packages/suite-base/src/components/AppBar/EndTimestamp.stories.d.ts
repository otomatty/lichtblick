/**
 * EndTimestamp Storybook Stories - EndTimestampコンポーネントのStorybookストーリー
 *
 * EndTimestampコンポーネントの様々な時刻表示形式とタイムゾーン対応をテストするためのストーリー集。
 * 絶対時刻、相対時刻、異なる時刻フォーマットの表示確認が可能です。
 *
 * 主なテストケース：
 * - デフォルト表示（絶対時刻・UTC）
 * - 時刻フォーマット切り替え（秒数・時刻表示）
 * - 相対時刻表示
 * - タイムゾーン対応
 * - Player状態との連動
 *
 * 技術仕様：
 * - AppConfigurationContext による設定管理
 * - MockMessagePipelineProvider による時刻データ提供
 * - Time型（ROSTime）による高精度時刻処理
 * - 複数の時刻フォーマット対応
 *
 * @example
 * ```bash
 * # Storybookでの確認方法
 * npm run storybook
 * # AppBar > EndTimestamp を選択
 * ```
 */
import { StoryFn, StoryObj } from "@storybook/react";
import { Time } from "@lichtblick/rostime";
import { EndTimestamp } from "./EndTimestamp";
/**
 * Story Arguments - ストーリー引数の型定義
 *
 * EndTimestampコンポーネントのテストに必要なプロパティを定義。
 * 時刻データ、タイムゾーン、表示フォーマットの制御に使用されます。
 */
type StoryArgs = {
    /** 表示する時刻データ（ROSTime形式） */
    time?: Time;
    /** タイムゾーン設定 */
    timezone?: string;
    /** 時刻表示フォーマット */
    timeFormat?: "SEC" | "TOD";
};
/**
 * Meta Configuration - Storybookメタ設定
 *
 * EndTimestampストーリーの基本設定と共通デコレーターを定義。
 * アプリケーション設定とメッセージパイプラインの模擬環境を提供します。
 */
declare const _default: {
    title: string;
    component: typeof EndTimestamp;
    args: {
        timezone: string;
        time: {
            sec: number;
            nsec: number;
        };
    };
    decorators: ((Story: StoryFn, ctx: import("storybook/internal/csf").StoryContext<import("@storybook/react/dist/types-5617c98e").R, {
        time?: Time | undefined;
        timezone?: string | undefined;
        timeFormat?: "SEC" | "TOD" | undefined;
    }>) => React.JSX.Element)[];
};
export default _default;
type Story = StoryObj<StoryArgs>;
/**
 * Default Story - デフォルト表示ストーリー
 *
 * EndTimestampの基本的な表示状態を確認するストーリー。
 * 絶対時刻をUTCタイムゾーンで表示し、標準的な使用パターンを確認できます。
 */
export declare const Default: Story;
/**
 * Time Format Seconds - 秒数フォーマット表示
 *
 * 時刻を秒数形式（SEC）で表示するストーリー。
 * Unix時刻やROSの標準時刻形式での表示を確認できます。
 */
export declare const TimeFormatSeconds: Story;
/**
 * Time Format TOD - 時刻フォーマット表示
 *
 * 時刻を時刻形式（TOD: Time of Day）で表示するストーリー。
 * 人間が読みやすい時刻表示形式を確認できます。
 */
export declare const TimeFormatTOD: StoryObj;
/**
 * Time Format Relative - 相対時刻表示
 *
 * 相対時刻（経過時間）を表示するストーリー。
 * データ再生時の経過時間表示や、記録開始からの時間表示を確認できます。
 */
export declare const TimeFormatRelative: StoryObj;

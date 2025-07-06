import { ChartOptions, InteractionMode, ScaleOptions } from "chart.js";
import { AnnotationOptions } from "chartjs-plugin-annotation";
import React, { ComponentProps } from "react";
import ChartComponent from "@lichtblick/suite-base/components/Chart/index";
import { Bounds } from "@lichtblick/suite-base/types/Bounds";
import { TimeBasedChartTooltipData } from "./TimeBasedChartTooltipContent";
import { ObjectDataProvider, TypedDataProvider } from "./types";
type ChartComponentProps = ComponentProps<typeof ChartComponent>;
/**
 * ChartDefaultView - チャートのデフォルト表示設定
 *
 * "reset view"機能で使用される表示モードの計算設定
 */
type ChartDefaultView = {
    type: "fixed";
    minXValue: number;
    maxXValue: number;
} | {
    type: "following";
    width: number;
};
/**
 * Props - TimeBasedChartコンポーネントのプロパティ定義
 *
 * 高度な時系列チャートの全機能を制御するための包括的なプロパティセット
 */
export type Props = {
    /** チャートタイプ（現在は"scatter"のみサポート） */
    type: "scatter";
    /** チャートの幅（ピクセル） */
    width: number;
    /** チャートの高さ（ピクセル） */
    height: number;
    /** ズーム機能の有効化 */
    zoom: boolean;
    /** 静的チャートデータ（providerと排他的） */
    data?: ChartComponentProps["data"];
    /** 動的データプロバイダー（オブジェクト形式） */
    provider?: ObjectDataProvider;
    /** 静的型付きチャートデータ（typedProviderと排他的） */
    typedData?: ChartComponentProps["typedData"];
    /** 動的データプロバイダー（型付き形式） */
    typedProvider?: TypedDataProvider;
    /** データ境界の明示的指定 */
    dataBounds?: Bounds;
    /** カスタムツールチップデータ */
    tooltips?: Map<string, TimeBasedChartTooltipData>;
    /** X軸設定 */
    xAxes?: ScaleOptions<"linear">;
    /** Y軸設定（必須） */
    yAxes: ScaleOptions<"linear">;
    /** Chart.jsアノテーション設定 */
    annotations?: AnnotationOptions[];
    /** リセットボタンの下部パディング */
    resetButtonPaddingBottom?: number;
    /** 複数チャート同期の有効化 */
    isSynced?: boolean;
    /** 非表示ライン設定 */
    linesToHide?: {
        [key: string]: boolean;
    };
    /** Chart.jsインタラクションモード */
    interactionMode?: InteractionMode;
    /** データセットID（識別用） */
    datasetId?: string;
    /** クリックイベントハンドラー */
    onClick?: ChartComponentProps["onClick"];
    /** X軸が再生時間を表すかどうか（ホバー同期用） */
    xAxisIsPlaybackTime: boolean;
    /** X軸ラベル表示の有効化 */
    showXAxisLabels: boolean;
    /** Chart.jsプラグイン設定 */
    plugins?: ChartOptions["plugins"];
    /** 現在の再生時間 */
    currentTime?: number;
    /** デフォルト表示範囲設定 */
    defaultView?: ChartDefaultView;
};
/**
 * TimeBasedChart - メインコンポーネント
 *
 * 時系列データの高度な可視化を提供するChart.jsベースのコンポーネント。
 * ズーム・パン、データダウンサンプリング、リアルタイム同期機能を統合。
 */
export default function TimeBasedChart(props: Props): React.JSX.Element;
export {};

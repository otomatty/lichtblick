/// <reference types="hammerjs" />
import { ChartData, ChartOptions, ChartType } from "chart.js";
import { RpcElement, RpcScales } from "@lichtblick/suite-base/components/Chart/types";
import { TypedChartData } from "../types";
/**
 * Chart.js初期化オプション
 *
 * WebWorkerでChart.jsインスタンスを作成する際に必要な設定を定義します。
 *
 * @interface InitOpts
 */
export interface InitOpts {
    /** チャートの一意識別子 */
    id: string;
    /** チャートノード（OffscreenCanvasを含む） */
    node: {
        canvas: OffscreenCanvas;
    };
    /** チャートのタイプ */
    type: ChartType;
    /** チャートデータ */
    data?: ChartData<"scatter">;
    /** Chart.jsオプション */
    options?: ChartOptions;
    /** デバイスピクセル比 */
    devicePixelRatio?: number;
    /** フォント読み込み完了Promise */
    fontLoaded: Promise<FontFace>;
}
/**
 * Chart.js WebWorkerマネージャー
 *
 * WebWorker内でChart.jsインスタンスを管理し、メインスレッドとの
 * RPC通信を通じてチャートの描画・更新・イベント処理を行います。
 *
 * ## 主な機能
 * - Chart.jsインスタンスの初期化・管理
 * - OffscreenCanvasでの描画
 * - マウス・タッチイベントの処理
 * - ズーム・パン操作の対応
 * - 高解像度ディスプレイ対応
 * - カスタムインタラクションモードの実装
 *
 * ## アーキテクチャ
 * - WebWorkerスレッドで実行
 * - RPC通信でメインスレッドと連携
 * - 偽のDOMイベントシステムを実装
 * - Chart.jsプラグインとの統合
 *
 * @example
 * ```typescript
 * // WebWorker内での使用例
 * const manager = new ChartJSManager({
 *   id: 'chart-1',
 *   node: { canvas: offscreenCanvas },
 *   type: 'scatter',
 *   data: chartData,
 *   options: chartOptions,
 *   devicePixelRatio: 2,
 *   fontLoaded: fontPromise
 * });
 * ```
 */
export default class ChartJSManager {
    #private;
    constructor(initOpts: InitOpts);
    init({ id, node, type, data, options, devicePixelRatio, fontLoaded, }: InitOpts): Promise<void>;
    wheel(event: WheelEvent): RpcScales;
    mousedown(event: MouseEvent): RpcScales;
    mousemove(event: MouseEvent): RpcScales;
    mouseup(event: MouseEvent): RpcScales;
    panstart(event: HammerInput): RpcScales;
    panmove(event: HammerInput): RpcScales;
    panend(event: HammerInput): RpcScales;
    update({ options, width, height, isBoundsReset, data, typedData, }: {
        options?: ChartOptions;
        width?: number;
        height?: number;
        isBoundsReset: boolean;
        data?: ChartData<"scatter">;
        typedData?: TypedChartData;
    }): RpcScales;
    destroy(): void;
    getElementsAtEvent({ event }: {
        event: MouseEvent;
    }): RpcElement[];
    getDatalabelAtEvent({ event }: {
        event: Event;
    }): unknown;
    getScales(): RpcScales;
}

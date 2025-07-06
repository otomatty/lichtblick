import { ChartData, ChartOptions } from "chart.js";
import Rpc from "@lichtblick/suite-base/util/Rpc";
import { TypedChartData } from "../types";
/**
 * チャート更新メッセージの型定義
 *
 * WebWorkerに送信されるチャート更新情報を定義します。
 * 全てのフィールドはオプショナルで、変更された項目のみ送信されます。
 */
export type ChartUpdateMessage = {
    /** チャートデータ（オブジェクト形式） */
    data?: ChartData<"scatter">;
    /** チャートデータ（型付き配列形式） */
    typedData?: TypedChartData;
    /** チャートの高さ */
    height?: number;
    /** Chart.jsオプション */
    options?: ChartOptions;
    /** 境界リセットフラグ */
    isBoundsReset: boolean;
    /** チャートの幅 */
    width?: number;
};
/**
 * Chart.js WebWorkerマルチプレクサー
 *
 * 制限された数のWebWorkerを使用するため、単一のWebWorkerで複数のChart.jsインスタンスを
 * 実行する可能性があります。ChartJsMuxは、特定のChart.jsインスタンスIDに対するRPC要求を
 * 適切なインスタンスに転送します。
 *
 * ## 主な機能
 * - 複数のChart.jsインスタンスの管理
 * - RPC通信の多重化とルーティング
 * - Chart.js機能の一括登録
 * - フォント読み込みの管理
 * - イベントハンドリングの中継
 *
 * ## サポートされるRPCメソッド
 * - initialize: 新しいチャートインスタンスの作成
 * - update: チャートデータ・オプションの更新
 * - destroy: チャートインスタンスの破棄
 * - マウスイベント: wheel, mousedown, mousemove, mouseup
 * - タッチイベント: panstart, panmove, panend
 * - 要素取得: getElementsAtEvent, getDatalabelAtEvent
 *
 * @example
 * ```typescript
 * // WebWorker内での使用例
 * const rpc = new Rpc(workerChannel);
 * const chartMux = new ChartJsMux(rpc);
 *
 * // メインスレッドから
 * rpc.send('initialize', {
 *   id: 'chart-1',
 *   node: { canvas: offscreenCanvas },
 *   type: 'scatter',
 *   data: chartData,
 *   options: chartOptions
 * });
 * ```
 */
export default class ChartJsMux {
    #private;
    /**
     * ChartJsMuxインスタンスを作成
     *
     * @param rpc - RPC通信インスタンス
     */
    constructor(rpc: Rpc);
}

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
import { CategoryScale, Chart, Filler, Legend, LinearScale, LineController, LineElement, PointElement, ScatterController, Ticks, TimeScale, TimeSeriesScale, Title, Tooltip, } from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { loadDefaultFont } from "@lichtblick/suite-base/panels/shared/loadFont";
import { setupWorker } from "@lichtblick/suite-base/util/RpcWorkerUtils";
import ChartJSManager from "./ChartJSManager";
// WebWorkerスレッドでフォントの読み込みを即座に開始
// 各ChartJSManagerインスタンスは、新しいChartインスタンスを作成する前に
// このPromiseを待機し、レンダリングを開始します
const fontLoaded = loadDefaultFont();
// Chart.jsインスタンスでサポートする機能をグローバルに登録
// 注意: AnnotationPluginは必ず登録する必要があり、インライン（インスタンス毎）では動作しません
Chart.register(LineElement, PointElement, LineController, ScatterController, CategoryScale, LinearScale, TimeScale, TimeSeriesScale, Filler, Legend, Title, Tooltip, AnnotationPlugin);
/**
 * 固定小数点フォーマッター
 * 最初と最後のX軸ラベルの幅を一定に保つために使用
 */
const fixedNumberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
/**
 * チャートオプションの`ticks`を調整して、最初/最後のxラベルの幅を一定に保つ
 *
 * この処理は`callback`関数をtickオプションに渡す必要があるため、
 * 関数をpostMessageで送信できないWebWorker内で実行する必要があります。
 *
 * @param args - RPC更新イベント
 * @returns 調整されたRPC更新イベント
 * @see https://github.com/foxglove/studio/issues/2926
 */
function fixTicks(args) {
    const xScale = args.options?.scales?.x;
    if (xScale?.ticks) {
        xScale.ticks.callback = function (value, index, ticks) {
            // 最初と最後のtickには固定フォーマッターを使用
            if (index === 0 || index === ticks.length - 1) {
                return fixedNumberFormat.format(value);
            }
            // それ以外はChart.jsのデフォルトフォーマッターを使用
            return Ticks.formatters.numeric.apply(this, [value, index, ticks]);
        };
    }
    return args;
}
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
    /** RPC通信インスタンス */
    #rpc;
    /** チャートマネージャーのマップ（ID -> ChartJSManager） */
    #managers = new Map();
    /**
     * ChartJsMuxインスタンスを作成
     *
     * @param rpc - RPC通信インスタンス
     */
    constructor(rpc) {
        this.#rpc = rpc;
        if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
            setupWorker(this.#rpc);
        }
        // 新しいChart.jsインスタンスを作成
        // 他のRPC要求を送信する前に、これを実行する必要があります
        rpc.receive("initialize", (args) => {
            args.fontLoaded = fontLoaded;
            const manager = new ChartJSManager(args);
            this.#managers.set(args.id, manager);
            return manager.getScales();
        });
        // マウスイベントのハンドリング
        rpc.receive("wheel", (args) => this.#getChart(args.id).wheel(args.event));
        rpc.receive("mousedown", (args) => this.#getChart(args.id).mousedown(args.event));
        rpc.receive("mousemove", (args) => this.#getChart(args.id).mousemove(args.event));
        rpc.receive("mouseup", (args) => this.#getChart(args.id).mouseup(args.event));
        // タッチ・パンイベントのハンドリング
        rpc.receive("panstart", (args) => this.#getChart(args.id).panstart(args.event));
        rpc.receive("panend", (args) => this.#getChart(args.id).panend(args.event));
        rpc.receive("panmove", (args) => this.#getChart(args.id).panmove(args.event));
        // チャートの更新と破棄
        rpc.receive("update", (args) => this.#getChart(args.id).update(fixTicks(args)));
        rpc.receive("destroy", (args) => {
            const manager = this.#managers.get(args.id);
            if (manager) {
                manager.destroy();
                this.#managers.delete(args.id);
            }
        });
        // 要素取得メソッド
        rpc.receive("getElementsAtEvent", (args) => this.#getChart(args.id).getElementsAtEvent(args));
        rpc.receive("getDatalabelAtEvent", (args) => this.#getChart(args.id).getDatalabelAtEvent(args));
    }
    /**
     * 指定されたIDのチャートマネージャーを取得
     *
     * @param id - チャートID
     * @returns ChartJSManagerインスタンス
     * @throws チャートが見つからない場合はエラー
     */
    #getChart(id) {
        const chart = this.#managers.get(id);
        if (!chart) {
            throw new Error(`Could not find chart with id ${id}`);
        }
        return chart;
    }
}

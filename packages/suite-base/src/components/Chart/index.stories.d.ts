/**
 * Chartコンポーネントのストーリー
 *
 * WebWorkerベースの高性能チャートコンポーネントの
 * 使用例とテストケースを提供します。
 *
 * ## 含まれるストーリー
 * - Basic: 基本的な散布図の表示
 * - WithZoom: ズーム・パン機能付き
 * - LargeDataset: 大量データのパフォーマンステスト
 * - StateTransition: 状態遷移表示
 * - MultipleDatasets: 複数系列データ
 * - TypedArrayData: 型付き配列による高速データ処理
 *
 * ## 技術的特徴
 * - WebWorkerによる非同期レンダリング
 * - OffscreenCanvas対応（対応ブラウザ）
 * - 高解像度ディスプレイ対応
 * - リアルタイムデータ更新
 */
import { StoryObj } from "@storybook/react";
import ChartComponent from ".";
declare const _default: {
    title: string;
    component: typeof ChartComponent;
    parameters: {
        chromatic: {
            delay: number;
        };
        colorScheme: string;
        disableI18n: boolean;
    };
};
export default _default;
/**
 * 基本的な散布図の表示
 *
 * シンプルなデータポイントを表示する基本的な例です。
 * WebWorkerでの描画処理を確認できます。
 */
export declare const Basic: StoryObj;
/**
 * ズーム・パン機能付きチャート
 *
 * マウスホイールでズーム、ドラッグでパンができる
 * インタラクティブなチャートの例です。
 */
export declare const WithZoom: StoryObj;
/**
 * 大量データのパフォーマンステスト
 *
 * 10,000個のデータポイントを表示して
 * WebWorkerでの高速レンダリングを確認します。
 */
export declare const LargeDataset: StoryObj;
/**
 * リアルタイムデータ更新
 *
 * 定期的にデータが更新される動的なチャートの例です。
 * WebWorkerでの効率的な更新処理を確認できます。
 */
export declare const RealTimeUpdate: StoryObj;
export declare const AllowsClickingOnDatalabels: StoryObj;

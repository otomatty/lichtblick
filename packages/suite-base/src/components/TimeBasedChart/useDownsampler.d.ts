import type { ObjectData, RpcScales } from "@lichtblick/suite-base/components/Chart/types";
import { PlotDataProvider, ChartDataset } from "./types";
/**
 * useDownsampler - データダウンサンプリングフック
 *
 * 大量のデータセットを効率的にダウンサンプリングし、
 * TimeBasedChartの高性能描画を実現するReactフック。
 * PlotDataProviderインターフェースを通じて統一的なデータ提供を行う。
 *
 * @param datasets - ダウンサンプリング対象のデータセット配列
 * @returns ダウンサンプラープロバイダーとスケール更新関数
 *
 * ## 戻り値
 *
 * ### downsampler: PlotDataProvider<ObjectData>
 * - TimeBasedChartで使用可能なデータプロバイダー
 * - setView/registerメソッドを提供
 * - 自動的なダウンサンプリング処理
 *
 * ### setScales: (scales: RpcScales) => void
 * - チャートスケール変更時の更新関数
 * - 即座にダウンサンプリングを実行
 * - ズーム・パン操作への対応
 *
 * ## 内部動作
 *
 * ### 更新フロー
 * 1. **datasets変更** → Downsampler.update() → queueDownsample()
 * 2. **scales変更** → Downsampler.update() → 即座にapplyDownsample()
 * 3. **view変更** → Downsampler.update() → 境界更新のみ
 *
 * ### デバウンス戦略
 * - スケール変更: デバウンスなし（即座実行）
 * - データセット変更: 100msデバウンス
 * - ビューポート変更: ダウンサンプルなし
 */
export default function useDownsampler(datasets: ChartDataset[]): {
    downsampler: PlotDataProvider<ObjectData>;
    setScales: (scales: RpcScales) => void;
};

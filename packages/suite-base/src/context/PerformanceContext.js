// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useContext } from "react";
// Ensure Symbol.dispose and Symbol.asyncDispose are defined
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Symbol.dispose ??= Symbol("Symbol.dispose");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
/**
 * ## PerformanceContext
 *
 * **パフォーマンス計測・監視のContext**
 *
 * ### 概要
 * - アプリケーション全体のパフォーマンス計測を統一管理
 * - メトリクスの登録・削除・計測を提供
 * - TypeScript 5.2の using 宣言をサポート
 * - 開発・本番環境での動的な計測制御
 *
 * ### 主な機能
 * - **メトリクス管理**: 動的なメトリクス登録・削除
 * - **時間計測**: 手動・自動の時間計測
 * - **データ記録**: タイムスタンプ付きデータ記録
 * - **スコープ計測**: using宣言による自動計測
 *
 * ### 使用例
 * ```typescript
 * import { usePerformance } from "./PerformanceContext";
 *
 * function DataProcessor() {
 *   const performance = usePerformance();
 *
 *   // メトリクス登録
 *   const [processingMetric] = useState(() =>
 *     performance.registerMetric({
 *       name: "データ処理時間",
 *       unit: "ms"
 *     })
 *   );
 *
 *   // クリーンアップ
 *   useEffect(() => {
 *     return () => {
 *       performance.unregisterMetric(processingMetric);
 *     };
 *   }, [performance, processingMetric]);
 *
 *   // 手動計測
 *   const processDataManual = async (data: any[]) => {
 *     const startTime = performance.now();
 *
 *     try {
 *       const result = await heavyDataProcessing(data);
 *
 *       const endTime = performance.now();
 *       performance.addMeasurement(processingMetric, endTime, endTime - startTime);
 *
 *       return result;
 *     } catch (error) {
 *       console.error("データ処理エラー:", error);
 *       throw error;
 *     }
 *   };
 *
 *   // 自動計測（using宣言）
 *   const processDataAuto = (data: any[]) => {
 *     using timer = performance.scopeTimer(processingMetric);
 *
 *     // 重い処理
 *     return heavyDataProcessing(data);
 *
 *     // スコープ終了時に自動計測
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => processDataManual(data)}>
 *         手動計測で処理
 *       </button>
 *       <button onClick={() => processDataAuto(data)}>
 *         自動計測で処理
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### メトリクス管理
 * - **動的登録**: 実行時にメトリクスを追加
 * - **自動ID生成**: 一意なメトリクスIDの自動生成
 * - **型安全性**: Opaque型による型安全なID管理
 * - **メモリ管理**: 不要なメトリクスの削除
 *
 * ### 計測方法
 * - **手動計測**: start/endタイムスタンプの手動管理
 * - **自動計測**: using宣言によるスコープベース計測
 * - **高精度計測**: performance.now()による高精度タイムスタンプ
 * - **任意値記録**: 時間以外の任意メトリクス記録
 *
 * ### 設計パターン
 * - **Registry パターン**: メトリクスの中央管理
 * - **Context API**: グローバルなパフォーマンス管理
 * - **Disposable パターン**: 自動リソース管理
 * - **Opaque Type**: 型安全性の向上
 *
 * ### パフォーマンス考慮事項
 * - **軽量実装**: 計測オーバーヘッドの最小化
 * - **メモリ効率**: 不要なメトリクスの適切な削除
 * - **非同期対応**: 非同期処理の計測サポート
 * - **条件付き計測**: 開発環境でのみ有効化
 *
 * ### デフォルト実装
 * デフォルトでは何も実行しない軽量実装を提供。
 * 実際の計測は実装固有のプロバイダーで注入。
 *
 * @see IPerformanceRegistry - パフォーマンスレジストリインターフェース
 * @see PerformanceMetric - メトリクス定義
 * @see PerformanceMetricID - メトリクス識別子
 */
export const PerformanceContext = createContext({
    registerMetric() {
        return NaN;
    },
    unregisterMetric() { },
    addMeasurement() { },
    scopeTimer() {
        return { [Symbol.dispose]() { } };
    },
});
PerformanceContext.displayName = "PerformanceContext";
/**
 * パフォーマンスレジストリを取得するカスタムフック
 *
 * PerformanceContextからパフォーマンス計測インスタンスを取得します。
 *
 * @returns IPerformanceRegistry - パフォーマンスレジストリインスタンス
 *
 * @example
 * ```typescript
 * function ComponentMetrics() {
 *   const performance = usePerformance();
 *
 *   const [renderMetric] = useState(() =>
 *     performance.registerMetric({
 *       name: "コンポーネントレンダリング時間",
 *       unit: "ms"
 *     })
 *   );
 *
 *   const measureRender = () => {
 *     using timer = performance.scopeTimer(renderMetric);
 *
 *     // レンダリング処理
 *     return <div>Heavy Component</div>;
 *   };
 *
 *   return measureRender();
 * }
 * ```
 */
// ts-unused-exports:disable-next-line
export function usePerformance() {
    return useContext(PerformanceContext);
}

/**
 * useProvider - データプロバイダー統合フック
 *
 * このファイルは、TimeBasedChartの動的データ管理システムの中核を担います。
 * 静的データと動的データプロバイダーの両方を統一的に扱い、
 * 効率的なデータ更新とバウンディング計算を提供します。
 *
 * ## 主要な機能
 *
 * ### 1. データソース統合
 * - **静的データ**: 一度だけ読み込まれるChart.jsデータ
 * - **動的プロバイダー**: リアルタイム更新可能なデータソース
 * - **統一インターフェース**: 両方を同じ型で扱う
 *
 * ### 2. 境界計算
 * - **オブジェクト形式**: getBounds関数によるObjectData境界計算
 * - **型付き形式**: getTypedBounds関数によるTypedData境界計算
 * - **自動マージ**: 複数データセットの境界統合
 *
 * ### 3. 段階的データ更新
 * - **完全更新**: setFull - 全データの置き換え
 * - **部分更新**: addPartial - 既存データへの追加
 * - **インクリメンタル**: 効率的なリアルタイム更新
 *
 * ### 4. ビューポート連動
 * - **ビュー通知**: データプロバイダーへの表示領域通知
 * - **効率的フェッチ**: 必要な範囲のみのデータ取得
 * - **動的最適化**: 表示領域に応じた処理調整
 *
 * ## アーキテクチャ
 *
 * ### データフロー
 * ```
 * 静的データ → getBounds → ProviderState
 *      ↓
 * useProvider → 統一されたProviderState
 *      ↓
 * 動的プロバイダー → setFull/addPartial → 状態更新
 * ```
 *
 * ### 状態管理
 * ```
 * DataState<T> {
 *   full: ProviderState<T>     // 完全なデータセット
 *   partial: ProviderState<T>  // 部分的な追加データ
 * }
 * ```
 *
 * ## 使用例
 *
 * ### 静的データ使用
 * ```tsx
 * const providerState = useProvider(
 *   view,
 *   getBounds,
 *   mergeNormal,
 *   staticChartData,
 *   undefined
 * );
 * ```
 *
 * ### 動的プロバイダー使用
 * ```tsx
 * const providerState = useProvider(
 *   view,
 *   getTypedBounds,
 *   mergeTyped,
 *   undefined,
 *   dynamicProvider
 * );
 * ```
 *
 * ## 型安全性
 *
 * - ジェネリック型`<T>`による柔軟な型対応
 * - ObjectData/TypedData[]の両方をサポート
 * - Chart.js型との完全互換性
 * - TypeScript strict modeでの安全性確保
 *
 * ## パフォーマンス最適化
 *
 * - useMemo/useCallbackによる再計算防止
 * - 段階的データマージによるメモリ効率化
 * - 必要時のみのバウンディング再計算
 * - React strict modeでの重複処理回避
 */
import { ChartDataset, ChartData } from "chart.js";
import type { ObjectData, TypedData } from "@lichtblick/suite-base/components/Chart/types";
import { PlotDataProvider, ProviderState, Bounds, PlotViewport } from "./types";
type Datasets<T> = ChartDataset<"scatter", T>[];
type Data<T> = ChartData<"scatter", T>;
/**
 * getBounds - オブジェクト形式データの境界計算
 *
 * ObjectData形式のデータセットから、X軸・Y軸の最小値・最大値を計算します。
 * NaN値は自動的に除外され、有効な数値のみが境界計算に使用されます。
 *
 * @param data - オブジェクト形式のデータセット配列
 * @returns 計算された境界、または有効なデータが存在しない場合はundefined
 *
 * ## 特徴
 * - **NaN耐性**: 無効な値を自動的にスキップ
 * - **効率的イテレーション**: iterateObjects使用による最適化
 * - **安全な初期化**: undefinedチェックによる堅牢性
 * - **数値精度**: Math.min/maxによる正確な計算
 */
export declare function getBounds(data: Datasets<ObjectData>): Bounds | undefined;
/**
 * getTypedBounds - 型付きデータの境界計算
 *
 * TypedData[]形式のデータセットから、X軸・Y軸の最小値・最大値を計算します。
 * getBounds関数の型付きデータ版で、同様のNaN耐性と効率性を提供します。
 *
 * @param data - 型付きデータセット配列
 * @returns 計算された境界、または有効なデータが存在しない場合はundefined
 *
 * ## getBoundsとの違い
 * - **データ形式**: TypedData[]配列を処理
 * - **イテレーター**: iterateTyped使用
 * - **型安全性**: より厳密な型チェック
 * - **パフォーマンス**: 型付きデータに最適化
 */
export declare function getTypedBounds(data: Datasets<TypedData[]>): Bounds | undefined;
type State<T> = ProviderState<T>;
/** オブジェクト形式データ用のマージ関数 */
export declare const mergeNormal: (a: State<ObjectData>, b: State<ObjectData>) => State<ObjectData>;
/** 型付きデータ用のマージ関数 */
export declare const mergeTyped: (a: State<TypedData[]>, b: State<TypedData[]>) => State<TypedData[]>;
/**
 * useProvider - データプロバイダー統合フック
 *
 * 静的データと動的プロバイダーを統一的に扱い、
 * ビューポート連動とリアルタイム更新を提供するReactフック
 *
 * @param view - 現在のビューポート情報
 * @param getDatasetBounds - データセット境界計算関数
 * @param mergeState - 状態マージ関数
 * @param data - 静的データ（オプション）
 * @param provider - 動的プロバイダー（オプション）
 * @returns 統合されたプロバイダー状態
 *
 * ## 動作モード
 *
 * ### 静的データモード
 * - dataが指定され、providerがundefinedの場合
 * - 一度だけ境界計算を実行
 * - 更新なし、固定データ
 *
 * ### 動的プロバイダーモード
 * - providerが指定され、dataがundefinedの場合
 * - ビューポート変更を自動通知
 * - setFull/addPartialによる段階的更新
 *
 * ## 状態管理の特徴
 * - **React.useState**: 内部状態管理
 * - **useCallback**: 更新関数のメモ化
 * - **useEffect**: プロバイダー登録・ビュー通知
 * - **useMemo**: 最終状態の計算最適化
 */
export default function useProvider<T>(view: PlotViewport, getDatasetBounds: (data: Datasets<T>) => Bounds | undefined, mergeState: (a: ProviderState<T>, b: ProviderState<T>) => ProviderState<T>, data: Data<T> | undefined, provider: PlotDataProvider<T> | undefined): ProviderState<T> | undefined;
export {};

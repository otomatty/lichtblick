import { ChartDataset } from "chart.js";
import { TypedData, ObjectData } from "./types";
export type Point = {
    index: number;
    x: number;
    y: number;
    label?: string | undefined;
};
/**
 * iterateObjects iterates over ObjectData, yielding a `Point` for each entry.
 */
export declare function iterateObjects(dataset: ObjectData): Generator<Point>;
/**
 * ExtractPoint maps an object type with array properties to one with the
 * arrays replaced by their element type. For example:
 * type Foo = {
 *   foo: Float32Array;
 *   bar: number[];
 *   baz: string[];
 * }
 * would be mapped to:
 * ExtractPoint<Foo> == {
 *   foo: number;
 *   bar: number;
 *   baz: string;
 * }
 * It is used to go from `TypedData`'s various incarnations to what a single
 * point would look like as a `Datum`.
 *
 * These `any`s do not introduce anything unsafe; they are necessary for
 * specifying the type (which is ultimately type-checked at point of use.)
 */
export type ExtractPoint<T extends {
    [key: string]: Array<any> | Float32Array;
}> = {
    [P in keyof T]-?: NonNullable<T[P]>[0];
} & {
    index: number;
    label: string | undefined;
};
/**
 *   Iterate over a typed dataset one point at a time. This abstraction is
 *   necessary because the Plot panel extends TypedData with more fields; we
 *   still want those to be available while iterating.
 */
export declare function iterateTyped<T extends {
    [key: string]: Array<any> | Float32Array;
}>(dataset: T[]): Generator<ExtractPoint<T>>;
export type Indices = [slice: number, offset: number];
/**
 * Given a dataset and an index inside of that dataset, return the index of the
 * slice and offset inside of that slice.
 */
export declare function findIndices(dataset: TypedData[], index: number): Indices | undefined;
/**
 * チャートデータセットの基本設定
 *
 * Chart.jsのデータセットに対してLichtblick固有の
 * デフォルト設定を適用するためのユーティリティ関数群です。
 */
/**
 * データセットのデフォルト設定を作成
 *
 * 散布図用のデータセットに対して、一貫した見た目と
 * パフォーマンス設定を適用します。
 *
 * @param overrides - 上書きしたい設定項目
 * @returns 設定済みのデータセット
 */
export declare function createDefaultDataset(overrides?: Partial<ChartDataset<"scatter", ObjectData>>): ChartDataset<"scatter", ObjectData>;
/**
 * 複数のデータセットを作成
 *
 * 複数の系列データを表示する際に使用します。
 * 各データセットには自動的に異なる色が割り当てられます。
 *
 * @param count - 作成するデータセット数
 * @param baseConfig - 基本設定
 * @returns データセット配列
 */
export declare function createMultipleDatasets(count: number, baseConfig?: Partial<ChartDataset<"scatter", ObjectData>>): ChartDataset<"scatter", ObjectData>[];
/**
 * 状態遷移用のデータセット設定
 *
 * 状態遷移パネルで使用される特別なデータセット設定です。
 * ラベル表示とライン区間の色分けが有効になります。
 *
 * @param overrides - 上書きしたい設定項目
 * @returns 状態遷移用データセット
 */
export declare function createStateTransitionDataset(overrides?: Partial<ChartDataset<"scatter", ObjectData>>): ChartDataset<"scatter", ObjectData>;

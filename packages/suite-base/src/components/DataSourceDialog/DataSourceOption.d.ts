import { DataSourceOptionProps } from "@lichtblick/suite-base/components/DataSourceDialog/types";
/**
 * DataSourceOption コンポーネント
 *
 * 個別のデータソース選択オプションを表示するボタンコンポーネントです。
 * アイコン、メインテキスト、サブテキストを組み合わせて、
 * 視覚的に分かりやすいオプション選択UIを提供します。
 *
 * ## レンダリング構造
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │ [Icon] メインテキスト                     │
 * │        セカンダリテキスト                 │
 * └─────────────────────────────────────────┘
 * ```
 *
 * ## 条件付きレンダリング
 *
 * - **href指定あり**: Linkコンポーネントでラップして外部リンクとして機能
 * - **href指定なし**: 通常のButtonコンポーネントとして機能
 *
 * @param props - コンポーネントプロパティ（DataSourceOptionProps型）
 * @returns レンダリングされたデータソースオプションコンポーネント
 */
declare const DataSourceOption: (props: DataSourceOptionProps) => React.JSX.Element;
export default DataSourceOption;

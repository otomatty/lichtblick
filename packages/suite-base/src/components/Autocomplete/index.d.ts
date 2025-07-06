/**
 * @fileoverview Autocompleteコンポーネントのエクスポート
 *
 * @description Lichtblick独自の高性能オートコンプリートコンポーネントを提供する。
 * Material-UIのAutocompleteをベースに、以下の機能を追加：
 *
 * - fzfライブラリによる高速ファジーファインド検索
 * - react-windowによる仮想化リストでの大量アイテム対応
 * - 複数連続補完のサポート
 * - カスタムPopperによる幅制限解除
 *
 * @example
 * ```tsx
 * import { Autocomplete } from "@lichtblick/suite-base/components/Autocomplete";
 *
 * function MyComponent() {
 *   return (
 *     <Autocomplete
 *       items={["option1", "option2", "option3"]}
 *       onSelect={(value) => console.log(value)}
 *       placeholder="選択してください..."
 *     />
 *   );
 * }
 * ```
 */
export * from "./Autocomplete";

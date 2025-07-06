/// <reference types="react" />
import { AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { FzfResultItem } from "fzf";
/**
 * Autocompleteから渡される各子コンポーネントの型
 *
 * @description renderOptionから返されるタプルの型定義
 * [HTMLプロパティ, fzfの検索結果, オートコンプリートの状態]
 */
export type ListboxAdapterChild = [
    React.HTMLAttributes<HTMLLIElement>,
    FzfResultItem,
    AutocompleteRenderOptionState
];
/**
 * React-window仮想化リストをオートコンプリートのListboxComponentとして使用するアダプター
 *
 * @description 数千のアイテムを持つリストを、すべてをDOMに描画することなく
 * サポートするための仮想化リストアダプター。
 *
 * Autocompleteの親コンポーネントから子のリスト（ListboxAdapterChild型に準拠する必要がある）と
 * 外側のリストボックス要素に適用するプロパティを受け取る。
 *
 * @features
 * - **仮想化による高性能**: 大量のアイテムでもスムーズなスクロール
 * - **動的幅調整**: 最も長いアイテムに合わせて幅を自動調整
 * - **ハイライト対応**: ファジーファインドの検索結果をハイライト表示
 * - **Material-UI統合**: テーマシステムとの完全連動
 *
 * @example
 * ```tsx
 * // MuiAutocompleteのListboxComponentとして使用
 * <MuiAutocomplete
 *   ListboxComponent={ReactWindowListboxAdapter}
 *   renderOption={(props, option, state) => [props, option, state]}
 *   // ...その他のプロパティ
 * />
 * ```
 */
export declare const ReactWindowListboxAdapter: import("react").ForwardRefExoticComponent<import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLDivElement>>;

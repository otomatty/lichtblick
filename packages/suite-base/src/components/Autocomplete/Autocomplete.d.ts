import { TextFieldProps } from "@mui/material";
import * as React from "react";
import { CSSProperties } from "react";
/**
 * Autocompleteコンポーネントのプロパティ型定義
 *
 * @description Material-UIのAutocompleteをベースにしたLichtblick独自の高性能オートコンプリートコンポーネント用のプロパティ
 */
type AutocompleteProps = {
    /** コンポーネントに適用するCSSクラス名 */
    className?: string;
    /** 自動選択を無効にするかどうか */
    disableAutoSelect?: boolean;
    /** コンポーネントを無効化するかどうか */
    disabled?: boolean;
    /** フィルタリングに使用するテキスト（通常はvalueと同じ） */
    filterText?: string;
    /** エラー状態を表示するかどうか */
    hasError?: boolean;
    /** 入力フィールドに適用するインラインスタイル */
    inputStyle?: CSSProperties;
    /** オートコンプリートで表示するアイテムのリスト */
    items: readonly string[];
    /** ドロップダウンメニューに適用するインラインスタイル */
    menuStyle?: CSSProperties;
    /** ドロップダウンの最小幅 */
    minWidth?: number;
    /** フォーカスが外れた時のコールバック */
    onBlur?: () => void;
    /** 入力値が変更された時のコールバック */
    onChange?: (event: React.SyntheticEvent, text: string) => void;
    /** アイテムが選択された時のコールバック */
    onSelect: (value: string, autocomplete: IAutocomplete) => void;
    /** 入力フィールドのプレースホルダーテキスト */
    placeholder?: string;
    /** 読み取り専用モードにするかどうか */
    readOnly?: boolean;
    /** フォーカス時にテキストを選択するかどうか */
    selectOnFocus?: boolean;
    /** フィルタリング時にソートするかどうか */
    sortWhenFiltering?: boolean;
    /** 入力フィールドの現在の値 */
    value?: string;
    /** TextFieldのバリアント（filled, outlined, standard） */
    variant?: TextFieldProps["variant"];
};
/**
 * Autocompleteコンポーネントのインターフェース
 *
 * @description 親コンポーネントがAutocompleteを制御するためのメソッドを提供
 */
export interface IAutocomplete {
    /** 入力フィールドの選択範囲を設定 */
    setSelectionRange(selectionStart: number, selectionEnd: number): void;
    /** 入力フィールドにフォーカスを設定 */
    focus(): void;
    /** 入力フィールドからフォーカスを外す */
    blur(): void;
}
/**
 * Lichtblick独自の高性能オートコンプリートコンポーネント
 *
 * @description Material-UIのAutocompleteをベースにしたStudio専用のラッパーコンポーネント。
 * 以下の特徴を持つ：
 *
 * - **高性能ファジーファインド**: fzfライブラリを使用した高速検索
 * - **仮想化リスト**: react-windowによる大量アイテムの効率的な描画
 * - **複数連続補完**: Plotパネルなどで複雑な文字列を構築する際の
 *   シームレスな連続オートコンプリート対応
 * - **パフォーマンス最適化**: 1000件以上のアイテムで高速アルゴリズムに自動切り替え
 * - **カスタムPopper**: 長いパスを表示するための幅制限解除
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   items={topicNames}
 *   value={currentTopic}
 *   onSelect={(value, autocomplete) => {
 *     setCurrentTopic(value);
 *     autocomplete.blur(); // 連続補完を終了
 *   }}
 *   placeholder="トピック名を入力..."
 * />
 * ```
 */
export declare const Autocomplete: React.ForwardRefExoticComponent<AutocompleteProps & React.RefAttributes<IAutocomplete>>;
export {};

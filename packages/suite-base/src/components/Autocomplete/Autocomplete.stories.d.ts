/// <reference types="react" />
/**
 * @fileoverview Autocompleteコンポーネントのストーリーブック
 *
 * @description Autocompleteコンポーネントの様々な使用例とテストケースを提供する。
 * 以下のシナリオをカバー：
 *
 * - 基本的なフィルタリング機能
 * - エラー状態の表示
 * - 大量アイテムでのパフォーマンステスト
 * - 長いパスの表示テスト
 * - ライト/ダークテーマでの表示確認
 * - ソート機能のオン/オフ
 */
import { StoryFn, StoryObj } from "@storybook/react";
import { Autocomplete } from "./Autocomplete";
/**
 * Storybookのメタデータ設定
 */
declare const _default: {
    title: string;
    component: import("react").ForwardRefExoticComponent<{
        className?: string | undefined;
        disableAutoSelect?: boolean | undefined;
        disabled?: boolean | undefined;
        filterText?: string | undefined;
        hasError?: boolean | undefined;
        inputStyle?: import("react").CSSProperties | undefined;
        items: readonly string[];
        menuStyle?: import("react").CSSProperties | undefined;
        minWidth?: number | undefined;
        onBlur?: (() => void) | undefined;
        onChange?: ((event: import("react").SyntheticEvent<Element, Event>, text: string) => void) | undefined;
        onSelect: (value: string, autocomplete: import("./Autocomplete").IAutocomplete) => void;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        selectOnFocus?: boolean | undefined;
        sortWhenFiltering?: boolean | undefined;
        value?: string | undefined;
        variant?: "outlined" | "filled" | "standard" | undefined;
    } & import("react").RefAttributes<import("./Autocomplete").IAutocomplete>>;
    parameters: {
        colorScheme: string;
    };
    args: {
        onSelect: () => void;
    };
    decorators: ((Story: StoryFn) => React.JSX.Element)[];
};
export default _default;
type Story = StoryObj<typeof Autocomplete>;
/**
 * 'o'でフィルタリングするストーリー（エラー状態付き）
 */
export declare const FilteringToO: Story;
/**
 * 'o'でフィルタリングするストーリー（ライトテーマ）
 */
export declare const FilteringToOLight: Story;
/**
 * 制御されていない値のストーリー
 */
export declare const UncontrolledValue: Story;
/**
 * 制御されていない値のストーリー（ライトテーマ）
 */
export declare const UncontrolledValueLight: Story;
/**
 * フィルタリング時のソートを無効にしたストーリー
 */
export declare const SortWhenFilteringFalse: Story;
/**
 * 大量アイテムでのパフォーマンステスト
 */
export declare const ManyItems: Story;
/**
 * 長いパスをポップアップで表示するテスト
 */
export declare const LongPathInPopup: Story;

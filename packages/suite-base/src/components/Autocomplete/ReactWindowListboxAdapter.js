import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MenuItem from "@mui/material/MenuItem";
import { useMemo } from "react";
import { FixedSizeList } from "react-window";
import { makeStyles } from "tss-react/mui";
import { HighlightChars } from "@lichtblick/suite-base/components/HighlightChars";
/**
 * 定数定義
 */
const Constants = Object.freeze({
    /** リストボックスの内側パディング */
    LISTBOX_PADDING: 8,
    /** 各行の高さ（ピクセル） */
    ROW_HEIGHT: 26,
});
/**
 * スタイル定義
 */
const useStyles = makeStyles()((theme) => ({
    /** リストアイテムのスタイル */
    item: {
        padding: 6,
        cursor: "pointer",
        minHeight: "100%",
        lineHeight: "calc(100% - 10px)",
        overflowWrap: "break-word",
        color: theme.palette.text.primary,
        // オートコンプリートがPortal内にあるため、<mark />スタイルを再定義
        mark: {
            backgroundColor: "transparent",
            color: theme.palette.info.main,
            fontWeight: 700,
        },
    },
    /** ハイライト（選択中）されたアイテムのスタイル */
    itemHighlighted: {
        backgroundColor: theme.palette.action.hover,
    },
}));
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
export const ReactWindowListboxAdapter = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const { className, ...rest } = other;
    /** 子要素をListboxAdapterChild型にキャスト */
    const options = children;
    /**
     * 最も長い子要素を取得
     *
     * @description 親divの幅を最も長い子要素に合わせて拡張するために使用
     */
    const longestChild = useMemo(() => options.reduce((prev, item) => {
        if (item[1].item.length > prev.length) {
            return item[1].item;
        }
        return prev;
    }, ""), [options]);
    /**
     * リスト全体の高さを計算
     *
     * @description 最大16アイテムまでを表示し、それ以上はスクロール
     */
    const totalHeight = 2 * Constants.LISTBOX_PADDING + Constants.ROW_HEIGHT * Math.min(options.length, 16);
    return (_jsxs("div", { ref: ref, ...rest, children: [_jsx("div", { style: { visibility: "hidden", height: 0 }, children: longestChild }), _jsx(FixedSizeList, { height: totalHeight, itemCount: options.length, itemData: options, itemSize: Constants.ROW_HEIGHT, className: className, width: "100%", children: FixedSizeListRenderRow })] }));
});
/**
 * FixedSizeListの個別行をレンダリングする関数
 *
 * @param props - react-windowから提供されるプロパティ
 * @param props.data - 全アイテムの配列
 * @param props.index - 現在の行のインデックス
 * @param props.style - 特定のアイテムの位置スタイル
 * @returns レンダリングされた行要素
 */
function FixedSizeListRenderRow(props) {
    const { data, index, style } = props;
    const { classes, cx } = useStyles();
    const dataSet = data[index];
    if (!dataSet) {
        return ReactNull;
    }
    /** 上部パディングを考慮したインラインスタイル */
    const inlineStyle = {
        ...style,
        top: style.top + Constants.LISTBOX_PADDING,
    };
    const [optProps, item, opt] = dataSet;
    const itemValue = item.item;
    return (_jsx("div", { style: inlineStyle, children: _jsx(MenuItem, { ...optProps, dense: true, component: "span", "data-highlighted": opt.selected, "data-testid": "autocomplete-item", className: cx(classes.item, {
                [classes.itemHighlighted]: opt.selected,
            }), children: _jsx(HighlightChars, { str: itemValue, indices: item.positions }) }) }, itemValue));
}

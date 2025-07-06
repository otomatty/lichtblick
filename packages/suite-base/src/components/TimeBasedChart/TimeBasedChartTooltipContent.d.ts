import { PropsWithChildren } from "react";
import { Immutable } from "@lichtblick/suite";
/**
 * TimeBasedChartTooltipData - ツールチップ表示データ
 *
 * 単一のデータポイントに関する表示情報を格納する型定義
 */
export type TimeBasedChartTooltipData = {
    /** データセットのインデックス（色・ラベル特定用） */
    configIndex: number;
    /** 表示する値（数値、文字列、真偽値、BigInt対応） */
    value: number | bigint | boolean | string;
    /** 値に対応する定数名（オプション） */
    constantName?: string;
};
/**
 * Props - TimeBasedChartTooltipContentのプロパティ型定義
 */
type Props = Immutable<{
    /** データセット別カラーマップ（configIndex -> color） */
    colorsByConfigIndex?: Record<string, undefined | string>;
    /** 表示するツールチップデータ配列 */
    content: TimeBasedChartTooltipData[];
    /** データセット別ラベルマップ（configIndex -> label） */
    labelsByConfigIndex?: Record<string, undefined | string>;
    /** 複数データセットモードフラグ */
    multiDataset: boolean;
}>;
/**
 * TimeBasedChartTooltipContent - メインツールチップコンポーネント
 *
 * 単一・複数データセットに応じて適切なレイアウトでツールチップを表示する
 */
export default function TimeBasedChartTooltipContent(props: PropsWithChildren<Props>): React.ReactElement;
export {};

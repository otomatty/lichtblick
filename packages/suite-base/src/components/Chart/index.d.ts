/// <reference types="react" />
import { ChartOptions } from "chart.js";
import { TypedChartData, ChartData, RpcElement, RpcScales } from "./types";
/**
 * チャートクリック時のコールバック引数
 */
export type OnClickArg = {
    /** データラベル情報（存在する場合） */
    datalabel?: unknown;
    /** スケール上のX値 */
    x: number | undefined;
    /** スケール上のY値 */
    y: number | undefined;
};
/**
 * Chartコンポーネントのプロパティ
 */
type Props = {
    /** チャートデータ（オブジェクト形式） */
    data?: ChartData;
    /** チャートデータ（型付き配列形式） */
    typedData?: TypedChartData;
    /** Chart.jsオプション */
    options: ChartOptions;
    /** 境界リセットフラグ */
    isBoundsReset: boolean;
    /** チャートタイプ（現在は散布図のみサポート） */
    type: "scatter";
    /** チャートの高さ */
    height: number;
    /** チャートの幅 */
    width: number;
    /** チャートクリック時のコールバック */
    onClick?: (params: OnClickArg) => void;
    /** チャートスケールが更新された時のコールバック */
    onScalesUpdate?: (scales: RpcScales, opt: {
        userInteraction: boolean;
    }) => void;
    /** チャートが新しいデータのレンダリングを開始する時のコールバック */
    onStartRender?: () => void;
    /** チャートが新しいデータの更新を完了した時のコールバック */
    onFinishRender?: () => void;
    /** ユーザーが要素にホバーした時のコールバック */
    onHover?: (elements: RpcElement[]) => void;
};
declare function Chart(props: Props): React.JSX.Element;
export default Chart;

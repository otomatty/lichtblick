/// <reference types="react" />
import { RpcScales } from "@lichtblick/suite-base/components/Chart/types";
/**
 * VerticalBarWrapperProps - VerticalBarWrapperのプロパティ型定義
 */
type VerticalBarWrapperProps = {
    /** チャートの現在のスケール情報 */
    scales?: RpcScales;
    /** 垂直線を表示するX軸上の値 */
    xValue?: number;
};
/**
 * VerticalBarWrapper - 垂直線表示ラッパーコンポーネント
 *
 * チャート上に垂直線を表示するための低レベルコンポーネント。
 * スケール変換とピクセル位置計算を行い、子要素を適切な位置に配置します。
 * ホバーバーやプレイバックカーソルなどの実装に使用されます。
 *
 * @param children - 垂直線として表示する子要素
 * @param scales - チャートスケール情報
 * @param xValue - 表示位置のX軸値
 */
export declare function VerticalBarWrapper({ children, scales, xValue, }: React.PropsWithChildren<VerticalBarWrapperProps>): React.JSX.Element;
export {};

/// <reference types="react" />
import { Time } from "@lichtblick/rostime";
type Props = {
    /** 日付表示を無効化するかどうか */
    disableDate?: boolean;
    /** 水平レイアウトを使用するかどうか */
    horizontal?: boolean;
    /** 表示する時刻 */
    time: Time;
    /** ツールチップに表示するタイトル */
    title?: string;
};
export default function Timestamp(props: Props): React.JSX.Element;
export {};

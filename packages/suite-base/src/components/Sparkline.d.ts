/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
export type SparklinePoint = {
    value: number;
    timestamp: number;
};
type SparklineProps = {
    points: Immutable<SparklinePoint[]>;
    width: number;
    height: number;
    timeRange: number;
    maximum?: number;
    nowStamp?: number;
};
export declare function Sparkline(props: SparklineProps): React.JSX.Element;
export {};

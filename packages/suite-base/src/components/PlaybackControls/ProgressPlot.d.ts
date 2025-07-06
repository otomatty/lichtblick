/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { Range } from "@lichtblick/suite-base/util/ranges";
type ProgressProps = Immutable<{
    loading: boolean;
    availableRanges?: Range[];
}>;
export declare function ProgressPlot(props: ProgressProps): React.JSX.Element;
export {};

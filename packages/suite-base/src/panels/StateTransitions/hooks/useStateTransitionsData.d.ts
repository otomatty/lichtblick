import { Time } from "@lichtblick/rostime";
import { MessageDataItemsByPath } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { ChartDatasets } from "@lichtblick/suite-base/components/TimeBasedChart/types";
import { PathState, StateTransitionPath } from "@lichtblick/suite-base/panels/StateTransitions/types";
type UseStateTransitionsData = {
    pathState: PathState[];
    data: {
        datasets: ChartDatasets;
    };
    minY: number | undefined;
};
declare function useStateTransitionsData(paths: StateTransitionPath[], startTime: Readonly<Time> | undefined, itemsByPath: MessageDataItemsByPath, decodedBlocks: MessageDataItemsByPath[], showPoints: boolean): UseStateTransitionsData;
export default useStateTransitionsData;

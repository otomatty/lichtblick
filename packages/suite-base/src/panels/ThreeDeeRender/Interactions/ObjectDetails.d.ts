/// <reference types="react" />
import { RosValue } from "@lichtblick/suite-base/players/types";
import { InteractionData } from "./types";
type Props = {
    readonly interactionData?: InteractionData;
    readonly selectedObject?: RosValue;
    readonly timezone: string | undefined;
};
declare function ObjectDetails({ interactionData, selectedObject, timezone }: Props): React.JSX.Element;
export default ObjectDetails;

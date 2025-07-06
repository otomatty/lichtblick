/// <reference types="react" />
import { Time } from "@lichtblick/suite";
import { TimeDisplayMethod } from "@lichtblick/suite-base/types/panels";
type Props = {
    stamp: Time;
    timestampFormat: TimeDisplayMethod;
    timeZone: string | undefined;
};
declare function Stamp(props: Props): React.JSX.Element;
export default Stamp;

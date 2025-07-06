/// <reference types="react" />
import { MessageEvent } from "@lichtblick/suite-base/players/types";
type Props = {
    data: unknown;
    diffData: unknown;
    diff: unknown;
    datatype?: string;
    message: MessageEvent;
    diffMessage?: MessageEvent;
};
export default function Metadata({ data, diffData, diff, datatype, message, diffMessage, }: Props): React.JSX.Element;
export {};

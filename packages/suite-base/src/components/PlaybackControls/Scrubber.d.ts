/// <reference types="react" />
import { Time } from "@lichtblick/rostime";
type Props = {
    onSeek: (seekTo: Time) => void;
};
export default function Scrubber(props: Props): React.JSX.Element;
export {};

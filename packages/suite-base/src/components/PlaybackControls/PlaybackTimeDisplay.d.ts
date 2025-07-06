/// <reference types="react" />
import { Time } from "@lichtblick/rostime";
type Props = {
    onSeek: (seekTo: Time) => void;
    onPause: () => void;
};
export default function PlaybackTimeDisplay(props: Props): React.JSX.Element;
export {};

/// <reference types="react" />
import { Time } from "@lichtblick/rostime";
import { Player } from "@lichtblick/suite-base/players/types";
type PlaybackControlsProps = Readonly<{
    play: NonNullable<Player["startPlayback"]>;
    pause: NonNullable<Player["pausePlayback"]>;
    seek: NonNullable<Player["seekPlayback"]>;
    playUntil?: Player["playUntil"];
    isPlaying: boolean;
    getTimeInfo: () => {
        startTime?: Time;
        endTime?: Time;
        currentTime?: Time;
    };
}>;
export default function PlaybackControls({ play, pause, seek, playUntil, isPlaying, getTimeInfo, }: PlaybackControlsProps): React.JSX.Element;
export {};

/// <reference types="react" />
import { Time } from "@lichtblick/rostime";
import { IAppTimeFormat } from "@lichtblick/suite-base/hooks/useAppTimeFormat";
type PlaybackTimeDisplayMethodProps = {
    appTimeFormat: IAppTimeFormat;
    currentTime?: Time;
    startTime?: Time;
    endTime?: Time;
    timezone?: string;
    onSeek: (arg0: Time) => void;
    onPause: () => void;
    isPlaying: boolean;
};
export declare function UnconnectedPlaybackTimeDisplay({ appTimeFormat, currentTime, startTime, endTime, timezone, onSeek, onPause, isPlaying, }: PlaybackTimeDisplayMethodProps): React.JSX.Element;
export {};

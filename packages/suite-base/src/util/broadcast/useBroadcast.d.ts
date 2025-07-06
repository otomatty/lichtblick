import { Time } from "@lichtblick/suite";
type UseBroadcastProps = {
    play?: () => void;
    pause?: () => void;
    seek?: (time: Time) => void;
    playUntil?: (time: Time) => void;
};
declare const useBroadcast: ({ play, pause, seek, playUntil }: UseBroadcastProps) => void;
export default useBroadcast;

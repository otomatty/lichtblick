import { Time } from "@lichtblick/rostime";
type UseStateTransitionsTime = {
    startTime: Readonly<Time> | undefined;
    currentTimeSinceStart: number | undefined;
    endTimeSinceStart: number | undefined;
};
declare const useStateTransitionsTime: () => UseStateTransitionsTime;
export default useStateTransitionsTime;

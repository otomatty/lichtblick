import { Time } from "@lichtblick/rostime";
export declare const DIRECTION: {
    FORWARD: number;
    BACKWARD: number;
};
export declare const jumpSeek: (directionSign: (typeof DIRECTION)[keyof typeof DIRECTION], currentTime: Time, modifierKeys?: {
    altKey: boolean;
    shiftKey: boolean;
}) => Time;

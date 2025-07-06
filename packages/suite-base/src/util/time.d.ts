import { Time } from "@lichtblick/rostime";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
export type TimestampMethod = "receiveTime" | "headerStamp";
export declare function formatTimeRaw(stamp: Time): string;
export declare function isAbsoluteTime(time: Time): boolean;
export declare function formatFrame({ sec, nsec }: Time): string;
export declare function getTimestampForMessageEvent(messageEvent: MessageEvent, timestampMethod?: TimestampMethod): Time | undefined;
export declare function getTimestampForMessage(message: unknown): Time | undefined;

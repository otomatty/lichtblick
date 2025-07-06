import { Time } from "@lichtblick/rostime";
import { InitMetadata } from "@lichtblick/suite-base/players/IterablePlayer/shared/types";
export declare const setStartTime: (accumulated: Time, current: Time) => Time;
export declare const setEndTime: (accumulated: Time, current: Time) => Time;
export declare const mergeMetadata: (accumulated: InitMetadata, current: InitMetadata) => InitMetadata;
export declare const accumulateMap: <V>(accumulated: Map<string, V>, current: Map<string, V>) => Map<string, V>;
export declare const mergeTopicStats: (accumulated: Map<string, import("../../../types").TopicStats>, current: Map<string, import("../../../types").TopicStats>) => Map<string, import("../../../types").TopicStats>;

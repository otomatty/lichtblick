import { Time } from "@lichtblick/rostime";
export declare function getBagChunksOverlapCount(chunkInfos: readonly {
    startTime: Time;
    endTime: Time;
}[]): number;

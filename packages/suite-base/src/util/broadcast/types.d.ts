import { Time } from "@lichtblick/suite";
export type BroadcastMessageEvent = {
    type: "play" | "pause" | "seek" | "playUntil";
    time: Time;
};
export type ChannelListeners = Set<(message: BroadcastMessageEvent) => void>;

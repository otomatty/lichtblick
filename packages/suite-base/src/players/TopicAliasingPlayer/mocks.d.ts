import { MessageEvent } from "@lichtblick/suite";
import { PlayerState, PlayerStateActiveData } from "@lichtblick/suite-base/players/types";
export declare function mockMessage<T>(message: T, fields?: Partial<MessageEvent<T>>): MessageEvent<T>;
export declare function mockPlayerState(overrides?: Partial<PlayerState>, dataOverrides?: Partial<PlayerStateActiveData>): PlayerState;

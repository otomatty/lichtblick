import type { MessagePath } from "@lichtblick/message-path";
import type { Immutable } from "@lichtblick/suite";
import type { SubscribePayload, SubscriptionPreloadType } from "@lichtblick/suite-base/players/types";
export declare function pathToSubscribePayload(path: Immutable<MessagePath>, preloadType: SubscriptionPreloadType): SubscribePayload | undefined;

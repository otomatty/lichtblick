import { RosObject } from "@lichtblick/suite-base/players/types";
import { Marker } from "@lichtblick/suite-base/types/Messages";
export type InteractionData = {
    readonly topic: string | undefined;
    readonly highlighted?: boolean;
    readonly originalMessage: RosObject;
    readonly instanceDetails: RosObject | undefined;
};
export type Interactive<T> = T & {
    interactionData: InteractionData;
};
export type SelectedObject = {
    object: Marker;
    instanceIndex?: number;
};

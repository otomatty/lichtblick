import { Channel, ClientChannel, Service } from "@foxglove/ws-protocol";
import { ParsedChannel } from "@lichtblick/mcap-support";
import { MessageDefinition } from "@lichtblick/message-definition";
import { MessageWriter as Ros1MessageWriter } from "@lichtblick/rosmsg-serialization";
import { MessageWriter as Ros2MessageWriter } from "@lichtblick/rosmsg2-serialization";
export type ResolvedChannel = {
    channel: Channel;
    parsedChannel: ParsedChannel;
};
export type Publication = ClientChannel & {
    messageWriter?: Ros1MessageWriter | Ros2MessageWriter;
};
export type ResolvedService = {
    service: Service;
    parsedResponse: ParsedChannel;
    requestMessageWriter: MessageWriter;
};
export type MessageDefinitionMap = Map<string, MessageDefinition>;
export type FromWorkerMessage = {
    type: "open";
    protocol: string;
} | {
    type: "close";
    data: unknown;
} | {
    type: "error";
    error: unknown;
} | {
    type: "message";
    data: unknown;
};
export type ToWorkerMessage = {
    type: "open";
    data: {
        wsUrl: string;
        protocols?: string[] | string;
    };
} | {
    type: "close";
    data: undefined;
} | {
    type: "data";
    data: string | ArrayBuffer | ArrayBufferView;
};
export interface MessageWriter {
    writeMessage(message: unknown): Uint8Array;
}

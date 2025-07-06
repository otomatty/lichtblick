import { MessageWriter } from "./types";
export declare class JsonMessageWriter implements MessageWriter {
    writeMessage(message: unknown): Uint8Array;
}

import { ExtensionInfo } from "@lichtblick/suite-base/types/Extensions";
export type StoredExtension = {
    info: ExtensionInfo;
    content: Uint8Array;
};
export interface IExtensionStorage {
    readonly namespace: string;
    list(): Promise<ExtensionInfo[]>;
    get(id: string): Promise<undefined | StoredExtension>;
    put(extension: StoredExtension): Promise<StoredExtension>;
    delete(id: string): Promise<void>;
}

import { IExtensionStorage, StoredExtension } from "@lichtblick/suite-base/services/IExtensionStorage";
import { ExtensionInfo } from "@lichtblick/suite-base/types/Extensions";
export declare const METADATA_STORE_NAME = "metadata";
export declare const EXTENSION_STORE_NAME = "extensions";
export declare class IdbExtensionStorage implements IExtensionStorage {
    #private;
    namespace: string;
    constructor(namespace: string);
    list(): Promise<ExtensionInfo[]>;
    get(id: string): Promise<undefined | StoredExtension>;
    put(extension: StoredExtension): Promise<StoredExtension>;
    delete(id: string): Promise<void>;
}

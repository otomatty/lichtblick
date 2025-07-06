import { ExtensionInfo, ExtensionNamespace } from "@lichtblick/suite-base/types/Extensions";
/**
 * An extension loader is an object used by studio to list, install, and uninstall extensions
 * from a particular namespace.
 */
export interface ExtensionLoader {
    readonly namespace: ExtensionNamespace;
    getExtension(id: string): Promise<ExtensionInfo | undefined>;
    getExtensions(): Promise<ExtensionInfo[]>;
    loadExtension(id: string): Promise<string>;
    installExtension(foxeFileData: Uint8Array): Promise<ExtensionInfo>;
    uninstallExtension(id: string): Promise<void>;
}

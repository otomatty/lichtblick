import { ExtensionLoader } from "@lichtblick/suite-base/services/ExtensionLoader";
import { ExtensionInfo, ExtensionNamespace } from "@lichtblick/suite-base/types/Extensions";
export declare enum ALLOWED_FILES {
    EXTENSION = "dist/extension.js",
    PACKAGE = "package.json",
    README = "README.md",
    CHANGELOG = "CHANGELOG.md"
}
export declare function validatePackageInfo(info: Partial<ExtensionInfo>): ExtensionInfo;
export declare class IdbExtensionLoader implements ExtensionLoader {
    #private;
    readonly namespace: ExtensionNamespace;
    constructor(namespace: ExtensionNamespace);
    getExtension(id: string): Promise<ExtensionInfo | undefined>;
    getExtensions(): Promise<ExtensionInfo[]>;
    loadExtension(id: string): Promise<string>;
    installExtension(foxeFileData: Uint8Array): Promise<ExtensionInfo>;
    uninstallExtension(id: string): Promise<void>;
}

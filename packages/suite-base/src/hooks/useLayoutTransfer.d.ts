import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
type UseLayoutTransfer = {
    importLayout: () => Promise<void>;
    exportLayout: () => Promise<void>;
    parseAndInstallLayout: (file: File) => Promise<Layout | undefined>;
};
export declare function useLayoutTransfer(): UseLayoutTransfer;
export {};

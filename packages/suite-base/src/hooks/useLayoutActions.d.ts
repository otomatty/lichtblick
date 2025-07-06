/// <reference types="react" />
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
type UseLayoutActions = {
    onRenameLayout: (item: Layout, newName: string) => Promise<void>;
    onDuplicateLayout: (item: Layout) => Promise<void>;
    onDeleteLayout: (item: Layout) => Promise<void>;
    onRevertLayout: (item: Layout) => Promise<void>;
    onOverwriteLayout: (item: Layout) => Promise<void>;
    confirmModal: React.JSX.Element | undefined;
};
export declare function useLayoutActions(): UseLayoutActions;
export {};

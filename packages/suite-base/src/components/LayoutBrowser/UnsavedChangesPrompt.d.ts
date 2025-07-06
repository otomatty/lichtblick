/// <reference types="react" />
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
type UnsavedChangesResolution = {
    type: "cancel";
} | {
    type: "discard";
} | {
    type: "makePersonal";
    name: string;
} | {
    type: "overwrite";
};
export declare function UnsavedChangesPrompt({ layout, isOnline, onComplete, defaultSelectedKey, defaultPersonalCopyName, }: {
    layout: Layout;
    isOnline: boolean;
    onComplete: (_: UnsavedChangesResolution) => void;
    defaultSelectedKey?: Exclude<UnsavedChangesResolution["type"], "cancel">;
    defaultPersonalCopyName?: string;
}): React.JSX.Element;
export declare function useUnsavedChangesPrompt(): {
    unsavedChangesPrompt?: React.JSX.Element;
    openUnsavedChangesPrompt: (item: Layout) => Promise<UnsavedChangesResolution>;
};
export {};

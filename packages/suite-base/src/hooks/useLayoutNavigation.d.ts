import { MouseEvent, Dispatch } from "react";
import { LayoutSelectionState, LayoutSelectionAction } from "@lichtblick/suite-base/components/LayoutBrowser/types";
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
export type UseLayoutNavigation = {
    promptForUnsavedChanges: () => Promise<boolean>;
    onSelectLayout: (item: Layout, params?: {
        selectedViaClick?: boolean;
        event?: MouseEvent;
    }) => Promise<void>;
    state: LayoutSelectionState;
    dispatch: Dispatch<LayoutSelectionAction>;
    unsavedChangesPrompt: React.JSX.Element | undefined;
};
export declare function useLayoutNavigation(menuClose?: () => void): UseLayoutNavigation;

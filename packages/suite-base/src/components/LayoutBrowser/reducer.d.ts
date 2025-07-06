import { Dispatch } from "react";
import { LayoutSelectionState, LayoutSelectionAction } from "@lichtblick/suite-base/components/LayoutBrowser/types";
export declare function useLayoutBrowserReducer(props: Pick<LayoutSelectionState, "busy" | "error" | "online" | "lastSelectedId">): [LayoutSelectionState, Dispatch<LayoutSelectionAction>];

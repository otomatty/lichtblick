/// <reference types="react" />
import { DraggedMessagePath } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
type MessagePathSelectionContext = {
    getSelectedItems: () => DraggedMessagePath[];
};
export declare const MessagePathSelectionContextInternal: import("react").Context<MessagePathSelectionContext | undefined>;
/**
 * Holds state to support dragging multiple message paths at once.
 */
export declare function MessagePathSelectionProvider(props: React.PropsWithChildren<{
    getSelectedItems: () => DraggedMessagePath[];
}>): React.JSX.Element;
export {};

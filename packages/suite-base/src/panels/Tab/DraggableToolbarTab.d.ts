/// <reference types="react" />
import { TabActions } from "@lichtblick/suite-base/panels/Tab/TabDndContext";
type Props = {
    isActive: boolean;
    panelId: string;
    actions: TabActions;
    tabCount: number;
    tabIndex: number;
    tabTitle: string;
};
export declare function DraggableToolbarTab(props: Props): React.JSX.Element;
export {};

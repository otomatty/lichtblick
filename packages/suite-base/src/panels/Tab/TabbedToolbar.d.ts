/// <reference types="react" />
import { DraggingTabItem, TabActions } from "@lichtblick/suite-base/panels/Tab/TabDndContext";
import { TabConfig } from "@lichtblick/suite-base/types/layouts";
type Props = {
    panelId: string;
    actions: TabActions;
    tabs: TabConfig[];
    activeTabIdx: number;
    setDraggingTabState: (arg0: {
        isOver: boolean;
        item?: DraggingTabItem;
    }) => void;
};
export declare function TabbedToolbar(props: Props): React.JSX.Element;
export {};

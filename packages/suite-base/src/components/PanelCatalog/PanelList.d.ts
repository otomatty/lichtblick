/// <reference types="react" />
import { PanelInfo } from "@lichtblick/suite-base/context/PanelCatalogContext";
import { PanelSelection } from "./types";
type Props = {
    filteredPanels: PanelInfo[];
    onPanelSelect: (arg0: PanelSelection) => void;
    onDragStart?: () => void;
    selectedPanelType?: string;
    highlightedPanelIdx?: number;
    searchQuery?: string;
};
export declare function PanelList(props: Props): React.JSX.Element;
export {};

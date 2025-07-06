/// <reference types="react" />
import { PanelInfo } from "@lichtblick/suite-base/context/PanelCatalogContext";
type Props = {
    panel: PanelInfo;
    searchQuery: string;
    onClick: () => void;
};
export declare function PanelGridCard(props: Props): React.JSX.Element;
export {};

import { useCrash } from "@lichtblick/hooks";
import { PanelExtensionContext } from "@lichtblick/suite";
import "leaflet/dist/leaflet.css";
export declare function initPanel(crash: ReturnType<typeof useCrash>, context: PanelExtensionContext): () => void;

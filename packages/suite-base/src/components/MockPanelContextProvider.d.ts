import { ReactNode } from "react";
import { PanelContextType } from "@lichtblick/suite-base/components/PanelContext";
import { PanelConfig } from "@lichtblick/suite-base/types/panels";
type MockProps = Partial<PanelContextType<PanelConfig>>;
declare function MockPanelContextProvider({ children, ...rest }: MockProps & {
    children: ReactNode;
}): React.JSX.Element;
export default MockPanelContextProvider;

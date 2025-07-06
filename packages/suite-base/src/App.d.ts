/// <reference types="react" />
import { AppParametersInput } from "@lichtblick/suite-base/context/AppParametersContext";
import { LayoutLoader } from "@lichtblick/suite-base/services/ILayoutLoader";
import { CustomWindowControlsProps } from "./components/AppBar/CustomWindowControls";
import { IAppConfiguration } from "./context/AppConfigurationContext";
import { INativeAppMenu } from "./context/NativeAppMenuContext";
import { INativeWindow } from "./context/NativeWindowContext";
import { IDataSourceFactory } from "./context/PlayerSelectionContext";
import { ExtensionLoader } from "./services/ExtensionLoader";
export type AppProps = CustomWindowControlsProps & {
    appConfiguration: IAppConfiguration;
    appParameters: AppParametersInput;
    dataSources: IDataSourceFactory[];
    deepLinks: string[];
    extensionLoaders: readonly ExtensionLoader[];
    layoutLoaders: readonly LayoutLoader[];
    nativeAppMenu?: INativeAppMenu;
    nativeWindow?: INativeWindow;
    enableLaunchPreferenceScreen?: boolean;
    enableGlobalCss?: boolean;
    appBarLeftInset?: number;
    extraProviders?: React.JSX.Element[];
    onAppBarDoubleClick?: () => void;
};
export declare function App(props: AppProps): React.JSX.Element;

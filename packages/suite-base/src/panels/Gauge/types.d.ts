import { PanelExtensionContext, SettingsTreeAction } from "@lichtblick/suite";
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
export declare enum ColorMapConfig {
    RED_YELLOW_GREEN = "red-yellow-green",
    RAINBOW = "rainbow",
    TURBO = "turbo"
}
export declare enum ColorModeConfig {
    COLORMAP = "colormap",
    GRADIENT = "gradient"
}
export type GaugeConfig = {
    colorMap: ColorMapConfig;
    colorMode: ColorModeConfig;
    gradient: [string, string];
    maxValue: number;
    minValue: number;
    path: string;
    reverse: boolean;
};
export type ColorStops = {
    color: string;
    location: number;
};
export type GaugePanelAdapterProps = {
    config: GaugeConfig;
    saveConfig: SaveConfig<GaugeConfig>;
};
export type GaugeProps = {
    context: PanelExtensionContext;
};
export type BuildConicGradientProps = {
    config: Pick<GaugeConfig, "colorMap" | "colorMode" | "gradient" | "reverse">;
    gaugeAngle: number;
    height: number;
    width: number;
};
export type SettingsActionReducerProps = {
    prevConfig: GaugeConfig;
    action: SettingsTreeAction;
};
export type SettingsTreeNodesProps = {
    config: GaugeConfig;
    pathParseError: string | undefined;
    error: string | undefined;
};

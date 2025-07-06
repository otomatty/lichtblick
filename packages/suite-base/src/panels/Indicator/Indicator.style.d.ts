import { IndicatorStyle } from "@lichtblick/suite-base/panels/Indicator/types";
export declare const useStyles: (params: Partial<{
    style: IndicatorStyle;
    backgroundColor: string;
}>, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"typography" | "stack" | "bulb" | "indicatorStack", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};

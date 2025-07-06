import { PanelExtensionContext } from "@lichtblick/suite";
export type IndicatorOperator = "=" | "<" | "<=" | ">" | ">=";
export type IndicatorStyle = "bulb" | "background";
export type IndicatorRule = {
    color: string;
    label: string;
    operator: IndicatorOperator;
    rawValue: string;
};
export type RawValueIndicator = undefined | boolean | bigint | number | string | {
    data?: boolean | bigint | number | string;
};
export type IndicatorConfig = {
    fallbackColor: string;
    fallbackLabel: string;
    path: string;
    rules: IndicatorRule[];
    style: IndicatorStyle;
};
export type IndicatorProps = {
    context: PanelExtensionContext;
};

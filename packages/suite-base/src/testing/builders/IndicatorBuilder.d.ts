import { IndicatorConfig, IndicatorRule, IndicatorStyle, IndicatorOperator } from "@lichtblick/suite-base/panels/Indicator/types";
export default class IndicatorBuilder {
    static style(): IndicatorStyle;
    static operator(): IndicatorOperator;
    static rule(props?: Partial<IndicatorRule>): IndicatorRule;
    static rules(count?: number): IndicatorRule[];
    static config(props?: Partial<IndicatorConfig>): IndicatorConfig;
}

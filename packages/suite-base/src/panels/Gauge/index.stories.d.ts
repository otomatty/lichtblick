/// <reference types="react" />
import { StoryFn, StoryContext, StoryObj } from "@storybook/react";
declare const _default: {
    title: string;
    component: import("react").ComponentType<{
        childId?: string | undefined;
        overrideConfig?: {} | undefined;
        tabId?: string | undefined;
    } & Omit<import("./types").GaugePanelAdapterProps, "config" | "saveConfig">> & import("../../components/Panel").PanelStatics<{}>;
    decorators: ((StoryComponent: StoryFn, { parameters }: StoryContext) => React.JSX.Element)[];
};
export default _default;
export declare const EmptyState: StoryObj;
export declare const InvalidValue: StoryObj;
export declare const Rainbow: StoryObj;
export declare const Turbo: StoryObj;
export declare const TurboReverse: StoryObj;
export declare const CustomGradient: StoryObj;
export declare const CustomGradientReverse: StoryObj;
export declare const MinValue: StoryObj;
export declare const MaxValue: StoryObj;
export declare const TooLow: StoryObj;
export declare const TooHigh: StoryObj;
export declare const CustomRange: StoryObj;
export declare const MessagePathWithFilter: StoryObj;
export declare const StringValue: StoryObj;

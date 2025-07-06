/// <reference types="react" />
import { StoryObj, StoryFn } from "@storybook/react";
import { PlaybackControlsTooltipContent } from "@lichtblick/suite-base/components/PlaybackControls/PlaybackControlsTooltipContent";
declare function Wrapper(Wrapped: StoryFn): React.JSX.Element;
declare const _default: {
    component: typeof PlaybackControlsTooltipContent;
    title: string;
    decorators: (typeof Wrapper)[];
};
export default _default;
export declare const Default: StoryObj;
export declare const WithEvents: StoryObj;

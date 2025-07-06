import { AlertProps } from "@mui/material";
import { StoryObj } from "@storybook/react";
declare const _default: import("@storybook/core/csf").ComponentAnnotations<import("@storybook/react/dist/types-5617c98e").R, AlertProps & {
    showTitle?: boolean | undefined;
}>;
export default _default;
type Story = StoryObj<AlertProps & {
    showTitle?: boolean;
}>;
export declare const StandardVariant: Story;
export declare const OutlinedVariant: Story;
export declare const FilledVariant: Story;
export declare const Description: Story;

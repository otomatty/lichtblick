/// <reference types="react" />
import { StoryObj } from "@storybook/react";
declare const _default: import("@storybook/core/csf").ComponentAnnotations<import("@storybook/react/dist/types-5617c98e").R, {
    alt?: string | undefined;
    children?: import("react").ReactNode;
    classes?: Partial<import("@mui/material").AvatarClasses> | undefined;
    imgProps?: (import("react").ImgHTMLAttributes<HTMLImageElement> & {
        sx?: import("@mui/material").SxProps<import("@mui/material").Theme> | undefined;
    }) | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme> | undefined;
    variant?: import("@mui/types").OverridableStringUnion<"square" | "circular" | "rounded", import("@mui/material").AvatarPropsVariantOverrides> | undefined;
} & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    ref?: ((instance: HTMLDivElement | null) => void) | import("react").RefObject<HTMLDivElement> | null | undefined;
}, keyof import("@mui/material/OverridableComponent").CommonProps | "children" | "sx" | "variant" | "alt" | "src" | "sizes" | "srcSet" | "imgProps">>;
export default _default;
export declare const Default: StoryObj;

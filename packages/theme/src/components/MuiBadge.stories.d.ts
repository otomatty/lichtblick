/// <reference types="react" />
import { StoryObj } from "@storybook/react";
declare const _default: import("@storybook/core/csf").ComponentAnnotations<import("@storybook/react/dist/types-5617c98e").R, {
    anchorOrigin?: import("@mui/material").BadgeOrigin | undefined;
    classes?: Partial<import("@mui/material").BadgeClasses> | undefined;
    className?: string | undefined;
    color?: import("@mui/types").OverridableStringUnion<"success" | "info" | "warning" | "error" | "default" | "primary" | "secondary", import("@mui/material").BadgePropsColorOverrides> | undefined;
    componentsProps?: {
        root?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").BadgeRootSlotPropsOverrides, {
            badgeContent: import("react").ReactNode;
            children?: import("react").ReactNode;
            invisible: boolean;
            max: number;
            slotProps?: any | undefined;
            slots?: import("@mui/base").BadgeSlots | undefined;
            showZero: boolean;
        }> | undefined;
        badge?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").BadgeBadgeSlotPropsOverrides, {
            badgeContent: import("react").ReactNode;
            children?: import("react").ReactNode;
            invisible: boolean;
            max: number;
            slotProps?: any | undefined;
            slots?: import("@mui/base").BadgeSlots | undefined;
            showZero: boolean;
        }> | undefined;
    } | undefined;
    components?: {
        Root?: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements> | undefined;
        Badge?: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements> | undefined;
    } | undefined;
    overlap?: "circular" | "rectangular" | undefined;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme> | undefined;
    variant?: import("@mui/types").OverridableStringUnion<"standard" | "dot", import("@mui/material").BadgePropsVariantOverrides> | undefined;
} & import("@mui/base").BadgeOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: ((instance: HTMLSpanElement | null) => void) | import("react").RefObject<HTMLSpanElement> | null | undefined;
}, keyof import("@mui/material/OverridableComponent").CommonProps | "sx" | "variant" | "color" | "components" | "componentsProps" | "anchorOrigin" | "overlap" | keyof import("@mui/base").BadgeOwnProps>>;
export default _default;
export declare const Default: StoryObj;

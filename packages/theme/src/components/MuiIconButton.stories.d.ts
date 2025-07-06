/// <reference types="react" />
import { StoryObj } from "@storybook/react";
declare const _default: import("@storybook/core/csf").ComponentAnnotations<import("@storybook/react/dist/types-5617c98e").R, {
    children?: import("react").ReactNode;
    classes?: Partial<import("@mui/material").IconButtonClasses> | undefined;
    color?: import("@mui/types").OverridableStringUnion<"success" | "info" | "warning" | "error" | "inherit" | "default" | "primary" | "secondary", import("@mui/material").IconButtonPropsColorOverrides> | undefined;
    disabled?: boolean | undefined;
    disableFocusRipple?: boolean | undefined;
    edge?: false | "end" | "start" | undefined;
    size?: import("@mui/types").OverridableStringUnion<"small" | "medium" | "large", import("@mui/material").IconButtonPropsSizeOverrides> | undefined;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme> | undefined;
} & Omit<{
    action?: import("react").Ref<import("@mui/material").ButtonBaseActions> | undefined;
    centerRipple?: boolean | undefined;
    children?: import("react").ReactNode;
    classes?: Partial<import("@mui/material").ButtonBaseClasses> | undefined;
    disabled?: boolean | undefined;
    disableRipple?: boolean | undefined;
    disableTouchRipple?: boolean | undefined;
    focusRipple?: boolean | undefined;
    focusVisibleClassName?: string | undefined;
    LinkComponent?: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements> | undefined;
    onFocusVisible?: import("react").FocusEventHandler<any> | undefined;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme> | undefined;
    tabIndex?: number | undefined;
    TouchRippleProps?: Partial<import("@mui/material/ButtonBase/TouchRipple").TouchRippleProps> | undefined;
    touchRippleRef?: import("react").Ref<import("@mui/material/ButtonBase/TouchRipple").TouchRippleActions> | undefined;
}, "classes"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & {
    ref?: ((instance: HTMLButtonElement | null) => void) | import("react").RefObject<HTMLButtonElement> | null | undefined;
}, keyof import("@mui/material/OverridableComponent").CommonProps | "children" | "sx" | "tabIndex" | "color" | "action" | "disabled" | "size" | "centerRipple" | "disableRipple" | "disableTouchRipple" | "focusRipple" | "focusVisibleClassName" | "LinkComponent" | "onFocusVisible" | "TouchRippleProps" | "touchRippleRef" | "disableFocusRipple" | "edge">>;
export default _default;
export declare const Default: StoryObj;
export declare const Sizes: StoryObj;
export declare const Color: StoryObj;

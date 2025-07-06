/// <reference types="react" />
export declare const StyledListItem: import("@emotion/styled").StyledComponent<{
    button?: false | undefined;
} & import("@mui/material").ListItemBaseProps & {
    components?: {
        Root?: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements> | undefined;
    } | undefined;
    componentsProps?: {
        root?: (import("react").HTMLAttributes<HTMLDivElement> & import("@mui/material").ListItemComponentsPropsOverrides) | undefined;
    } | undefined;
    slotProps?: {
        root?: (import("react").HTMLAttributes<HTMLDivElement> & import("@mui/material").ListItemComponentsPropsOverrides) | undefined;
    } | undefined;
    slots?: {
        root?: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements> | undefined;
    } | undefined;
} & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & {
    ref?: ((instance: HTMLLIElement | null) => void) | import("react").RefObject<HTMLLIElement> | null | undefined;
}, "children" | "button" | "style" | "divider" | "alignItems" | "className" | "classes" | "autoFocus" | "disabled" | "sx" | "selected" | "components" | "componentsProps" | "slotProps" | "slots" | "dense" | "disablePadding" | "ContainerComponent" | "ContainerProps" | "disableGutters" | "secondaryAction"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
    editingName: boolean;
    hasModifications: boolean;
    deletedOnServer: boolean;
}, {}, {}>;
export declare const StyledMenuItem: import("@emotion/styled").StyledComponent<{
    autoFocus?: boolean | undefined;
    classes?: Partial<import("@mui/material").MenuItemClasses> | undefined;
    dense?: boolean | undefined;
    disabled?: boolean | undefined;
    disableGutters?: boolean | undefined;
    divider?: boolean | undefined;
    selected?: boolean | undefined;
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
}, "classes"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & {
    ref?: ((instance: HTMLLIElement | null) => void) | import("react").RefObject<HTMLLIElement> | null | undefined;
}, "children" | "action" | "divider" | keyof import("@mui/material/OverridableComponent").CommonProps | "autoFocus" | "tabIndex" | "centerRipple" | "disabled" | "disableRipple" | "disableTouchRipple" | "focusRipple" | "focusVisibleClassName" | "LinkComponent" | "onFocusVisible" | "sx" | "TouchRippleProps" | "touchRippleRef" | "selected" | "dense" | "disableGutters"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
    debug?: boolean | undefined;
}, {}, {}>;

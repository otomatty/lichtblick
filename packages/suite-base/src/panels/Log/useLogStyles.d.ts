declare const _default: (params: void, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"error" | "warn" | "info" | "debug" | "fatal", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};
export default _default;

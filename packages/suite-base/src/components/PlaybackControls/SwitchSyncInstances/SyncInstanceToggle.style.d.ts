type UseStyleProps = {
    syncInstances: boolean;
};
export declare const useStyles: (params: UseStyleProps, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"button" | "textWrapper" | "syncText" | "onOffText", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};
export {};

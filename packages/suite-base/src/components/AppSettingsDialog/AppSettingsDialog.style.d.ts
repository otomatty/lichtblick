/**
 * AppSettingsDialogスタイルフック
 *
 * tss-react/muiを使用してMaterial-UIテーマと連動したスタイルを定義。
 * レスポンシブデザインとテーマ変数を活用して、
 * 一貫性のあるUIを提供します。
 *
 * @returns スタイルクラスとテーマユーティリティ
 */
export declare const useStyles: (params: void, styleOverrides?: {
    props: any;
    ownerState?: Record<string, unknown> | undefined;
} | undefined) => {
    classes: Record<"checkbox" | "tab" | "dialogActions" | "indicator" | "logo" | "dialogTitle" | "layoutGrid" | "tabPanel" | "tabPanelActive" | "formControlLabel", string>;
    theme: import("@mui/material").Theme;
    css: import("tss-react").Css;
    cx: import("tss-react").Cx;
};

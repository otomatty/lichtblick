import * as en from "./en";
import * as ja from "./ja";
export declare const translations: {
    en: typeof en;
    ja: typeof ja;
};
export type Language = keyof typeof translations;
export declare const defaultNS = "general";
export declare function initI18n(options?: {
    context?: "browser" | "electron-main";
}): Promise<void>;
export declare const sharedI18nObject: import("i18next").i18n;

import { SettingsTreeNodes } from "@lichtblick/suite";
import { DiagnosticSummaryConfig } from "@lichtblick/suite-base/panels/DiagnosticSummary/types";
export declare const MAX_STRING_LENGTH = 5000;
export declare const DEFAULT_SECONDS_UNTIL_STALE = 5;
export declare const LEVELS: {
    OK: 0;
    WARN: 1;
    ERROR: 2;
    STALE: 3;
};
export declare const LEVEL_NAMES: Record<string, string>;
export declare const KNOWN_LEVELS: number[];
export declare const ALLOWED_DATATYPES: string[];
export declare const MESSAGE_COLORS: Record<number, string>;
export declare const DEFAULT_CONFIG: DiagnosticSummaryConfig;
export declare const DEFAULT_SETTINGS_TREE_NODE: SettingsTreeNodes;

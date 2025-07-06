import { DiagnosticStatusMessage, FormattedKeyValue } from "@lichtblick/suite-base/panels/DiagnosticStatus/types";
export declare const getFormattedKeyValues: ((state: DiagnosticStatusMessage) => FormattedKeyValue[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: DiagnosticStatusMessage) => FormattedKeyValue[];
    memoizedResultFunc: ((resultFuncArgs_0: DiagnosticStatusMessage) => FormattedKeyValue[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => FormattedKeyValue[];
    dependencies: [(message: DiagnosticStatusMessage) => DiagnosticStatusMessage];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};

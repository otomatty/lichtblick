import ts from "typescript/lib/typescript";
import { Diagnostic } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
export declare const transformDiagnosticToMarkerData: (diagnostic: ts.Diagnostic) => Diagnostic;
export declare const baseCompilerOptions: {
    strict: boolean;
    target: ts.ScriptTarget;
    module: ts.ModuleKind;
};

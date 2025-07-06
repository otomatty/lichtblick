import type { SourceFile, TypeChecker } from "typescript";
import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { MessageEvent, Topic } from "@lichtblick/suite-base/players/types";
import { RosDatatypes } from "@lichtblick/suite-base/types/RosDatatypes";
import { DIAGNOSTIC_SEVERITY, SOURCES } from "./constants";
export type Diagnostic = {
    severity: (typeof DIAGNOSTIC_SEVERITY)[keyof typeof DIAGNOSTIC_SEVERITY];
    message: string;
    source: (typeof SOURCES)[keyof typeof SOURCES];
    startLineNumber?: number;
    startColumn?: number;
    endLineNumber?: number;
    endColumn?: number;
    code: number;
};
export type ScriptData = {
    name: string;
    sourceCode: string;
    transpiledCode: string;
    projectCode: Map<string, string> | undefined;
    diagnostics: readonly Diagnostic[];
    inputTopics: readonly string[];
    outputTopic: string;
    outputDatatype: string;
    datatypes: RosDatatypes;
    sourceFile?: SourceFile;
    typeChecker?: TypeChecker;
    rosLib: string;
    typesLib: string;
    globalVariables: readonly string[];
};
export type ScriptRegistration = {
    scriptId: string;
    scriptData: ScriptData;
    inputs: readonly string[];
    output: Topic;
    processBlockMessage: (messageEvent: MessageEvent, globalVariables: GlobalVariables) => Promise<MessageEvent | undefined>;
    processMessage: (messageEvent: MessageEvent, globalVariables: GlobalVariables) => Promise<MessageEvent | undefined>;
    terminate: () => void;
};
export type ScriptDataTransformer = (scriptData: ScriptData, topics: Topic[]) => ScriptData;
export type UserScriptLog = {
    source: "registerScript" | "processMessage";
    value: unknown;
};
export type RegistrationOutput = {
    error?: string;
    userScriptLogs: UserScriptLog[];
    userScriptDiagnostics: Diagnostic[];
};
export type ProcessMessageOutput = {
    message: Record<string, unknown> | undefined;
    error?: string;
    userScriptLogs: UserScriptLog[];
    userScriptDiagnostics: Diagnostic[];
};

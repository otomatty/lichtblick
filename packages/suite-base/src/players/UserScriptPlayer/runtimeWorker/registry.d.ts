import { GlobalVariables } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { ProcessMessageOutput, RegistrationOutput } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
export declare const containsFuncDeclaration: (args: unknown[]) => boolean;
export declare const stringifyFuncsInObject: (arg: unknown) => unknown;
export declare const requireImplementation: (id: string, projectCode: Map<string, string>) => unknown;
export declare const registerScript: ({ scriptCode, projectCode, }: {
    scriptCode: string;
    projectCode: Map<string, string>;
}) => RegistrationOutput;
export declare const processMessage: ({ message, globalVariables, }: {
    message: unknown;
    globalVariables: GlobalVariables;
}) => ProcessMessageOutput;

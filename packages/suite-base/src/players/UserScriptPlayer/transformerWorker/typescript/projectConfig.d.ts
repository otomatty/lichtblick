import { UserScriptProjectConfig, UserScriptProjectFile } from "@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/typescript/types";
/**
 * Generates virtual ts files for each type exported by the @foxglove/schemas package.
 */
export declare function generateFoxgloveSchemaDeclarations(): UserScriptProjectFile[];
export declare function getUserScriptProjectConfig(): UserScriptProjectConfig;

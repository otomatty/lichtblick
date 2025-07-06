/**
 * Defines a predefined file & code we make available for imports in user scripts.
 */
export type UserScriptProjectFile = {
    fileName: string;
    filePath: string;
    sourceCode: string;
};
/**
 * Defines a project configuration for a user script, including types we make available
 * for use in user script code.
 */
export type UserScriptProjectConfig = {
    defaultLibFileName: string;
    declarations: UserScriptProjectFile[];
    utilityFiles: UserScriptProjectFile[];
    rosLib: UserScriptProjectFile;
};

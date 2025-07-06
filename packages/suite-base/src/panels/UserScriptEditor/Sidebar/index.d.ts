/// <reference types="react" />
import { Script } from "@lichtblick/suite-base/panels/UserScriptEditor/script";
import { UserScript, UserScripts } from "@lichtblick/suite-base/types/panels";
type SidebarProps = {
    addNewScript: (sourceCode?: string) => void;
    selectScript: (scriptId: string) => void;
    deleteScript: (scriptId: string) => void;
    setScriptOverride: (script: Script, maxDepth?: number) => void;
    setUserScripts: (scripts: Partial<UserScripts>) => void;
    userScripts: UserScripts;
    selectedScriptId?: string;
    selectedScript?: UserScript;
    script?: Script;
};
export declare function Sidebar({ userScripts, selectScript, deleteScript, selectedScriptId, selectedScript, setScriptOverride, setUserScripts, script, addNewScript: addNewNode, }: SidebarProps): React.JSX.Element;
export {};

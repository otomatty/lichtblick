/// <reference types="react" />
import { UserScript, UserScripts } from "@lichtblick/suite-base/types/panels";
type ScriptsListProps = {
    scripts: UserScripts;
    addNewScript: () => void;
    selectScript: (id: string) => void;
    deleteScript: (id: string) => void;
    onClose: () => void;
    selectedScriptId?: string;
    selectedScript?: UserScript;
    setUserScripts: (scripts: Partial<UserScripts>) => void;
};
export declare function ScriptsList({ scripts, addNewScript, selectScript, deleteScript, onClose, selectedScriptId, selectedScript, setUserScripts, }: ScriptsListProps): React.JSX.Element;
export {};

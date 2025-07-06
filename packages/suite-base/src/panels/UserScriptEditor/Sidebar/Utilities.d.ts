/// <reference types="react" />
import { Script } from "@lichtblick/suite-base/panels/UserScriptEditor/script";
export declare function Utilities({ onClose, gotoUtils, script, }: {
    onClose: () => void;
    gotoUtils: (filePath: string) => void;
    script?: Script;
}): React.JSX.Element;

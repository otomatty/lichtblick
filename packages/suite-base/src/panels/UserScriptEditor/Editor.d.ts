import { ReactElement } from "react";
import { Script } from "@lichtblick/suite-base/panels/UserScriptEditor/script";
type Props = {
    script?: Script;
    setScriptCode: (code: string) => void;
    autoFormatOnSave: boolean;
    rosLib: string;
    typesLib: string;
    save: (code: string) => void;
    setScriptOverride: (script: Script) => void;
};
declare const Editor: ({ autoFormatOnSave, script, setScriptCode, save, setScriptOverride, rosLib, typesLib, }: Props) => ReactElement | ReactNull;
export default Editor;

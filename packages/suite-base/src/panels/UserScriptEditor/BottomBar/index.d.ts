import { ReactElement } from "react";
import { Diagnostic, UserScriptLog } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
type Props = {
    diagnostics: readonly Diagnostic[];
    isSaved: boolean;
    logs: readonly UserScriptLog[];
    scriptId?: string;
    onChangeTab: () => void;
    save: () => void;
};
declare const BottomBar: ({ diagnostics, isSaved, logs, scriptId, onChangeTab, save, }: Props) => ReactElement;
export default BottomBar;

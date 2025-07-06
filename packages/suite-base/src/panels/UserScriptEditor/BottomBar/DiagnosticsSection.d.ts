import { ReactElement } from "react";
import { Diagnostic } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
type Props = {
    diagnostics: readonly Diagnostic[];
};
declare const DiagnosticsSection: ({ diagnostics }: Props) => ReactElement;
export default DiagnosticsSection;

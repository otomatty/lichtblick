import { UserScriptLog } from "@lichtblick/suite-base/players/UserScriptPlayer/types";
declare const LogsSection: ({ logs }: {
    logs: readonly UserScriptLog[];
}) => React.JSX.Element;
export default LogsSection;

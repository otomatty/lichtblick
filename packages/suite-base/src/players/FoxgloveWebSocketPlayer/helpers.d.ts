import { StatusLevel } from "@foxglove/ws-protocol";
import { PlayerAlert } from "@lichtblick/suite-base/players/types";
export declare function dataTypeToFullName(dataType: string): string;
export declare function statusLevelToAlertSeverity(level: StatusLevel): PlayerAlert["severity"];

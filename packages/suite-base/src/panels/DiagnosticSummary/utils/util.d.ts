import { Time } from "@lichtblick/rostime";
import { DiagnosticId, DiagnosticInfo, DiagnosticStatusMessage } from "@lichtblick/suite-base/panels/DiagnosticStatus/types";
import { DiagnosticsById } from "@lichtblick/suite-base/panels/DiagnosticSummary/types";
export declare function getDiagnosticId(hardwareId: string, name?: string): DiagnosticId;
export declare function computeDiagnosticInfo(status: DiagnosticStatusMessage, stamp: Time): DiagnosticInfo;
export declare function getDiagnosticsByLevel(diagnosticsByHardwareId: Map<string, DiagnosticsById>): Map<number, DiagnosticInfo[]>;
export declare const filterAndSortDiagnostics: (nodes: DiagnosticInfo[], hardwareIdFilter: string, pinnedIds: DiagnosticId[]) => DiagnosticInfo[];

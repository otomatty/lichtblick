import { Time } from "@lichtblick/rostime";
import { UseDiagnosticsResult } from "@lichtblick/suite-base/panels/DiagnosticSummary/hooks/useDiagnostics";
export declare function getDiagnosticsWithStales(diagnosticsByHardwareId: UseDiagnosticsResult | undefined, staleTime: Time): UseDiagnosticsResult;

import { DiagnosticsById } from "@lichtblick/suite-base/panels/DiagnosticSummary/types";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
export type UseDiagnosticsResult = Map<string, DiagnosticsById>;
export declare function addMessages(prev: UseDiagnosticsResult, messageEvents: readonly MessageEvent[]): UseDiagnosticsResult;
export default function useDiagnostics(topic?: string): UseDiagnosticsResult;

import { UseAvailableDiagnosticResult } from "@lichtblick/suite-base/panels/DiagnosticStatus/types";
import { MessageEvent } from "@lichtblick/suite-base/players/types";
export declare function addMessages(previousAvailableDiagnostics: UseAvailableDiagnosticResult, messages: readonly MessageEvent[]): UseAvailableDiagnosticResult;
export default function useAvailableDiagnostics(topic?: string): UseAvailableDiagnosticResult;

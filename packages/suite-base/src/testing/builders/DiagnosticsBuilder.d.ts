import { DiagnosticInfo, DiagnosticStatusArrayMsg, DiagnosticStatusConfig, DiagnosticStatusMessage, KeyValue } from "@lichtblick/suite-base/panels/DiagnosticStatus/types";
import { DiagnosticSummaryConfig } from "@lichtblick/suite-base/panels/DiagnosticSummary/types";
import { Header } from "@lichtblick/suite-base/types/Messages";
declare class DiagnosticsBuilder {
    static statusConfig(props?: Partial<DiagnosticStatusConfig>): DiagnosticStatusConfig;
    static summaryConfig(props?: Partial<DiagnosticSummaryConfig>): DiagnosticSummaryConfig;
    static header(props?: Partial<Header>): Header;
    static keyValue(props?: Partial<KeyValue>): KeyValue;
    static keyValues(count?: number): KeyValue[];
    static statusMessage(props?: Partial<DiagnosticStatusMessage>): DiagnosticStatusMessage;
    static statusMessages(count?: number): DiagnosticStatusMessage[];
    static statusArrayMsg(props?: Partial<DiagnosticStatusArrayMsg>): DiagnosticStatusArrayMsg;
    static info(props?: Partial<DiagnosticInfo>): DiagnosticInfo;
}
export default DiagnosticsBuilder;

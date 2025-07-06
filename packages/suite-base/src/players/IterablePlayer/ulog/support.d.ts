import { MessageDefinition } from "@lichtblick/message-definition";
import { MessageDefinition as ULogMessageDefinition, ULog, LogLevel } from "@lichtblick/ulog";
export declare function messageIdToTopic(msgId: number, ulog: ULog): string | undefined;
export declare function messageDefinitionToRos(msgDef: ULogMessageDefinition): MessageDefinition;
export declare function logLevelToRosout(level: LogLevel): number;

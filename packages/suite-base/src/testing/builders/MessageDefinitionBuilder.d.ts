import { MessageDefinition, MessageDefinitionField } from "@lichtblick/message-definition";
export default class MessageDefinitionBuilder {
    static messageDefinitionField(props?: Partial<MessageDefinitionField>): MessageDefinitionField;
    static messageDefinitionFields(count?: number): MessageDefinitionField[];
    static messageDefinition(props?: Partial<MessageDefinition>): MessageDefinition;
}

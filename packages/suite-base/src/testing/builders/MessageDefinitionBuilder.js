// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class MessageDefinitionBuilder {
    static messageDefinitionField(props = {}) {
        return defaults(props, {
            type: BasicBuilder.string(),
            name: BasicBuilder.string(),
            isComplex: BasicBuilder.boolean(),
            isArray: BasicBuilder.boolean(),
            arrayLength: BasicBuilder.number(),
            isConstant: BasicBuilder.boolean(),
            value: BasicBuilder.string(),
            defaultValue: BasicBuilder.string(),
            arrayUpperBound: BasicBuilder.number(),
            upperBound: BasicBuilder.number(),
            valueText: BasicBuilder.string(),
        });
    }
    static messageDefinitionFields(count = 3) {
        return BasicBuilder.multiple(MessageDefinitionBuilder.messageDefinitionField, count);
    }
    static messageDefinition(props = {}) {
        return defaults(props, {
            name: BasicBuilder.string(),
            definitions: MessageDefinitionBuilder.messageDefinitionFields(),
        });
    }
}

// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import MessageDefinitionBuilder from "@lichtblick/suite-base/testing/builders/MessageDefinitionBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class RosDatatypesBuilder {
    static optionalMessageDefinition(props = {}) {
        return defaults(props, {
            definitions: MessageDefinitionBuilder.messageDefinitionFields(),
            name: BasicBuilder.string(),
        });
    }
}

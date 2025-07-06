// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import RosTimeBuilder from "@lichtblick/suite-base/testing/builders/RosTimeBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
class MessageEventBuilder {
    static messageEvent(props = {}) {
        return defaults(props, {
            message: BasicBuilder.stringMap(),
            publishTime: RosTimeBuilder.time(),
            receiveTime: RosTimeBuilder.time(),
            schemaName: BasicBuilder.string(),
            sizeInBytes: BasicBuilder.number(),
            topic: BasicBuilder.string(),
            topicConfig: BasicBuilder.stringMap(),
        });
    }
    static messageEvents(count = 3) {
        return BasicBuilder.multiple(MessageEventBuilder.messageEvent, count);
    }
}
export default MessageEventBuilder;

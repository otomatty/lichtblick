// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import RosTimeBuilder from "@lichtblick/suite-base/testing/builders/RosTimeBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
class DiagnosticsBuilder {
    static statusConfig(props = {}) {
        return defaults(props, {
            topicToRender: BasicBuilder.string(),
        });
    }
    static summaryConfig(props = {}) {
        return defaults(props, {
            hardwareIdFilter: BasicBuilder.string(),
            minLevel: BasicBuilder.number(),
            pinnedIds: BasicBuilder.strings(),
            topicToRender: BasicBuilder.string(),
        });
    }
    static header(props = {}) {
        return defaults(props, {
            frame_id: BasicBuilder.string(),
            stamp: RosTimeBuilder.time(),
            seq: BasicBuilder.number(),
        });
    }
    static keyValue(props = {}) {
        return defaults(props, {
            key: BasicBuilder.string(),
            value: BasicBuilder.string(),
        });
    }
    static keyValues(count = 3) {
        return BasicBuilder.multiple(DiagnosticsBuilder.keyValue, count);
    }
    static statusMessage(props = {}) {
        return defaults(props, {
            name: BasicBuilder.string(),
            hardware_id: BasicBuilder.string(),
            level: BasicBuilder.number({ min: 0, max: 3 }), // see LEVELS in DiagnosticSummary/constants.ts
            message: BasicBuilder.string(),
            values: DiagnosticsBuilder.keyValues(),
        });
    }
    static statusMessages(count = 3) {
        return BasicBuilder.multiple(DiagnosticsBuilder.statusMessage, count);
    }
    static statusArrayMsg(props = {}) {
        return defaults(props, {
            header: DiagnosticsBuilder.header(),
            status: DiagnosticsBuilder.statusMessages(),
        });
    }
    static info(props = {}) {
        return defaults(props, {
            displayName: BasicBuilder.string(),
            id: BasicBuilder.string(),
            status: DiagnosticsBuilder.statusMessage(),
            stamp: RosTimeBuilder.time(),
        });
    }
}
export default DiagnosticsBuilder;

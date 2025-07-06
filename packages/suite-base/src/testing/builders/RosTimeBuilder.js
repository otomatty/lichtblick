// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class RosTimeBuilder {
    static time(props = {}) {
        return defaults(props, {
            nsec: BasicBuilder.number(),
            sec: BasicBuilder.number(),
        });
    }
}

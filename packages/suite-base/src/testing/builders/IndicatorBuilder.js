// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { defaults } from "@lichtblick/suite-base/testing/builders/utilities";
export default class IndicatorBuilder {
    static style() {
        return BasicBuilder.sample(["bulb", "background"]);
    }
    static operator() {
        return BasicBuilder.sample(["=", "<", "<=", ">", ">="]);
    }
    static rule(props = {}) {
        return defaults(props, {
            color: BasicBuilder.string(),
            label: BasicBuilder.string(),
            operator: IndicatorBuilder.operator(),
            rawValue: BasicBuilder.string(),
        });
    }
    static rules(count = 3) {
        return BasicBuilder.multiple(IndicatorBuilder.rule, count);
    }
    static config(props = {}) {
        return defaults(props, {
            fallbackColor: BasicBuilder.string(),
            fallbackLabel: BasicBuilder.string(),
            path: BasicBuilder.string(),
            rules: IndicatorBuilder.rules(),
            style: IndicatorBuilder.style(),
        });
    }
}

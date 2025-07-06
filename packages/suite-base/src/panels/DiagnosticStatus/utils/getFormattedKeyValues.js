// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { createSelector } from "reselect";
import { ALLOWED_TAGS } from "@lichtblick/suite-base/panels/DiagnosticStatus/constants";
import { sanitize } from "@lichtblick/suite-base/panels/DiagnosticStatus/utils/sanitize";
const HAS_ANY_HTML = new RegExp(`<(${ALLOWED_TAGS.join("|")})`);
// preliminary check to avoid expensive operations when there is no html
export const getFormattedKeyValues = createSelector((message) => message, (message) => {
    return message.values.map(({ key, value }) => {
        return {
            key,
            keyHtml: HAS_ANY_HTML.test(key) ? sanitize(key) : undefined,
            value,
            valueHtml: HAS_ANY_HTML.test(value) ? sanitize(value) : undefined,
        };
    });
});

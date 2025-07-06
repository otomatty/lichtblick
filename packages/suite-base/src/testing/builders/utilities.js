// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as _ from "lodash-es";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaults(props, fallbackProps) {
    return _.defaults({ ...props }, fallbackProps);
}

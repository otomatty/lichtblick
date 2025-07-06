import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import ICONS from "@lichtblick/suite-base/theme/icons";
export function BuiltinIcon(props) {
    if (props.name == undefined) {
        return _jsx(_Fragment, {});
    }
    return ICONS[props.name];
}

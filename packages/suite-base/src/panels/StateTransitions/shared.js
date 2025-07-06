// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import * as R from "ramda";
function presence(value) {
    if (value === "") {
        return undefined;
    }
    return value ?? undefined;
}
export function stateTransitionPathDisplayName(path, index) {
    return presence(path.label) ?? presence(path.value) ?? `Series ${index + 1}`;
}
export function datasetContainsArray(dataset) {
    // We need to detect when the path produces more than one data point,
    // since that is invalid input
    const dataCounts = R.pipe(R.chain((data) => {
        if (data == undefined) {
            return [];
        }
        return data.map((message) => message.queriedData.length);
    }), R.uniq)(dataset);
    return dataCounts.length > 0 && dataCounts.every((numPoints) => numPoints > 1);
}

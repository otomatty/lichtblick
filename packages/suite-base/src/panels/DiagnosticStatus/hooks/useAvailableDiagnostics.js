// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useMemo } from "react";
import { useMessageReducer } from "@lichtblick/suite-base/PanelAPI";
import { mightActuallyBePartial } from "@lichtblick/suite-base/util/mightActuallyBePartial";
export function addMessages(previousAvailableDiagnostics, messages) {
    // If we detect new hardware ids or names we need to create a new instance of available diagnostics
    // so downstream consumers know it changed by observing the object reference changing
    let modified = false;
    for (const message of messages) {
        const { status: statusArray } = message.message;
        if (statusArray.length === 0) {
            continue;
        }
        for (const status of statusArray) {
            const hardwareId = mightActuallyBePartial(status).hardware_id ?? "";
            const name = status.name;
            const nameSet = previousAvailableDiagnostics.get(hardwareId);
            if (!nameSet) {
                modified = true;
                previousAvailableDiagnostics.set(hardwareId, new Set([name]));
            }
            else if (!nameSet.has(name) && name) {
                modified = true;
                nameSet.add(name);
            }
        }
    }
    return modified ? new Map(previousAvailableDiagnostics) : previousAvailableDiagnostics;
}
const EmptyMap = () => new Map();
export default function useAvailableDiagnostics(topic) {
    const topics = useMemo(() => {
        if (topic) {
            return [topic];
        }
        return [];
    }, [topic]);
    return useMessageReducer({
        topics,
        restore: EmptyMap,
        addMessages,
    });
}

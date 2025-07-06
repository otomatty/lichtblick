// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.
import { useMemo } from "react";
import { useMessagePipeline, } from "@lichtblick/suite-base/components/MessagePipeline";
function selectDatatypes(ctx) {
    return ctx.datatypes;
}
function selectTopics(ctx) {
    return ctx.sortedTopics;
}
function selectStartTime(ctx) {
    return ctx.playerState.activeData?.startTime;
}
function selectCapabilities(ctx) {
    return ctx.playerState.capabilities;
}
function selectPlayerId(ctx) {
    return ctx.playerState.playerId;
}
/**
 * Data source info" encapsulates **rarely-changing** metadata about the source from which
 * Lichtblick Suite is loading data.
 *
 * A data source might be a local file, a remote file, or a streaming source.
 */
export function useDataSourceInfo() {
    const datatypes = useMessagePipeline(selectDatatypes);
    const topics = useMessagePipeline(selectTopics);
    const startTime = useMessagePipeline(selectStartTime);
    const capabilities = useMessagePipeline(selectCapabilities);
    const playerId = useMessagePipeline(selectPlayerId);
    // we want the returned object to have a stable identity
    return useMemo(() => {
        return {
            topics,
            datatypes,
            capabilities,
            startTime,
            playerId,
        };
    }, [capabilities, datatypes, playerId, startTime, topics]);
}

// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import * as _ from "lodash-es";
import memoizeWeak from "memoize-weak";
import { filterMap } from "@lichtblick/den/collection";
import { compare, toSec } from "@lichtblick/rostime";
import { EMPTY_GLOBAL_VARIABLES, } from "@lichtblick/suite-base/hooks/useGlobalVariables";
import { collateTopicSchemaConversions, convertMessage, forEachSortedArrays, mapDifference, } from "./messageProcessing";
const EmptyParameters = new Map();
/**
 * initRenderStateBuilder creates a function that transforms render state input into a new
 * RenderState
 *
 * This function tracks previous input to determine what parts of the existing render state to
 * update or whether there are any updates
 *
 * @returns a function that accepts render state input and returns a new RenderState to render or
 * undefined if there's no update for rendering
 */
function initRenderStateBuilder() {
    let prevVariables = EMPTY_GLOBAL_VARIABLES;
    let prevBlocks;
    let prevSeekTime;
    let prevSortedTopics;
    let prevMessageConverters;
    let prevSharedPanelState;
    let prevCurrentFrame;
    let prevCollatedConversions;
    const lastMessageByTopic = new Map();
    // Pull these memoized versions into the closure so they are scoped to the lifetime of
    // the panel.
    const memoMapDifference = memoizeWeak(mapDifference);
    const memoCollateTopicSchemaConversions = memoizeWeak(collateTopicSchemaConversions);
    const prevRenderState = {};
    function updateRenderStateField(field, newValue, prevValue, shouldRender) {
        if (newValue !== prevValue) {
            prevRenderState[field] = newValue;
            shouldRender.value = true;
        }
    }
    return function buildRenderState(input) {
        const { appSettings, colorScheme, currentFrame, globalVariables, hoverValue, messageConverters, playerState, sharedPanelState, sortedTopics, subscriptions, watchedFields, config, } = input;
        const configTopics = config?.topics ?? {};
        const topicToSchemaNameMap = _.mapValues(_.keyBy(sortedTopics, "name"), ({ schemaName }) => schemaName);
        // Should render indicates whether any fields of render state are updated
        const shouldRender = { value: false };
        // Hoisted active data to shorten some of the code below that repeatedly uses active data
        const activeData = playerState?.activeData;
        // The render state starts with the previous render state and changes are applied as detected
        const renderState = prevRenderState;
        const collatedConversions = memoCollateTopicSchemaConversions(subscriptions, sortedTopics, messageConverters);
        const { unconvertedSubscriptionTopics, topicSchemaConverters } = collatedConversions;
        const conversionsChanged = prevCollatedConversions !== collatedConversions;
        const newConverters = memoMapDifference(topicSchemaConverters, prevCollatedConversions?.topicSchemaConverters);
        if (prevSeekTime !== activeData?.lastSeekTime) {
            lastMessageByTopic.clear();
        }
        if (watchedFields.has("didSeek")) {
            updateRenderStateField("didSeek", prevSeekTime !== activeData?.lastSeekTime, renderState.didSeek, shouldRender);
            prevSeekTime = activeData?.lastSeekTime;
        }
        if (watchedFields.has("parameters")) {
            updateRenderStateField("parameters", activeData?.parameters ?? EmptyParameters, renderState.parameters, shouldRender);
        }
        if (watchedFields.has("sharedPanelState")) {
            updateRenderStateField("sharedPanelState", sharedPanelState, prevSharedPanelState, shouldRender);
        }
        if (watchedFields.has("variables")) {
            if (globalVariables !== prevVariables) {
                shouldRender.value = true;
                prevVariables = globalVariables;
                renderState.variables = new Map(Object.entries(globalVariables));
            }
        }
        if (watchedFields.has("topics")) {
            if (sortedTopics !== prevSortedTopics || prevMessageConverters !== messageConverters) {
                shouldRender.value = true;
                const topics = sortedTopics.map((topic) => {
                    const newTopic = {
                        name: topic.name,
                        schemaName: topic.schemaName ?? "",
                    };
                    if (messageConverters) {
                        const convertibleTo = [];
                        // find any converters that can convert _from_ the schema name of the topic
                        // the _to_ names of the converter become additional schema names for the topic entry
                        for (const converter of messageConverters) {
                            if (converter.fromSchemaName === topic.schemaName) {
                                if (!convertibleTo.includes(converter.toSchemaName)) {
                                    convertibleTo.push(converter.toSchemaName);
                                }
                            }
                        }
                        if (convertibleTo.length > 0) {
                            newTopic.convertibleTo = convertibleTo;
                        }
                    }
                    return newTopic;
                });
                renderState.topics = topics;
                prevSortedTopics = sortedTopics;
            }
        }
        if (watchedFields.has("currentFrame")) {
            if (currentFrame && currentFrame !== prevCurrentFrame) {
                // If we have a new frame, emit that frame and process all messages on that frame.
                // Unconverted messages are only processed on a new frame.
                const postProcessedFrame = [];
                for (const messageEvent of currentFrame) {
                    if (unconvertedSubscriptionTopics.has(messageEvent.topic)) {
                        postProcessedFrame.push(messageEvent);
                    }
                    const schemaName = topicToSchemaNameMap[messageEvent.topic];
                    if (schemaName) {
                        convertMessage({ ...messageEvent, topicConfig: configTopics[messageEvent.topic] }, topicSchemaConverters, postProcessedFrame);
                    }
                    lastMessageByTopic.set(messageEvent.topic, messageEvent);
                }
                renderState.currentFrame = postProcessedFrame;
                shouldRender.value = true;
            }
            else if (conversionsChanged) {
                // If we don't have a new frame but our conversions have changed, run
                // only the new conversions on our most recent message on each topic.
                const postProcessedFrame = [];
                for (const messageEvent of lastMessageByTopic.values()) {
                    const schemaName = topicToSchemaNameMap[messageEvent.topic];
                    if (schemaName) {
                        convertMessage({ ...messageEvent, topicConfig: configTopics[messageEvent.topic] }, newConverters, postProcessedFrame);
                    }
                }
                renderState.currentFrame = postProcessedFrame;
                shouldRender.value = true;
            }
            else if (currentFrame !== prevCurrentFrame) {
                // Otherwise if we're replacing a non-empty frame with an empty frame and
                // conversions haven't changed, include the empty frame in the new render state.
                renderState.currentFrame = currentFrame;
                shouldRender.value = true;
            }
            prevCurrentFrame = currentFrame;
        }
        if (watchedFields.has("allFrames")) {
            // Rebuild allFrames if we have new blocks or if our conversions have changed.
            const newBlocks = playerState?.progress.messageCache?.blocks;
            if ((newBlocks != undefined && prevBlocks !== newBlocks) || conversionsChanged) {
                shouldRender.value = true;
                const blocksToProcess = newBlocks ?? prevBlocks ?? [];
                const frames = (renderState.allFrames = []);
                // only populate allFrames with topics that the panel wants to preload
                const topicsToPreloadForPanel = Array.from(new Set(filterMap(subscriptions, (sub) => (sub.preload === true ? sub.topic : undefined))));
                for (const block of blocksToProcess) {
                    if (!block) {
                        continue;
                    }
                    // Given that messagesByTopic should be in order by receiveTime, we need to
                    // combine all of the messages into a single array and sorted by receive time.
                    forEachSortedArrays(topicsToPreloadForPanel.map((topic) => block.messagesByTopic[topic] ?? []), (a, b) => compare(a.receiveTime, b.receiveTime), (messageEvent) => {
                        // Message blocks may contain topics that we are not subscribed to so we
                        // need to filter those out. We use unconvertedSubscriptionTopics to
                        // determine if we should include the message event. Clients expect
                        // allFrames to be a complete set of messages for all subscribed topics so
                        // we include all unconverted and converted messages, unlike in
                        // currentFrame.
                        if (unconvertedSubscriptionTopics.has(messageEvent.topic)) {
                            frames.push(messageEvent);
                        }
                        const schemaName = topicToSchemaNameMap[messageEvent.topic];
                        if (schemaName) {
                            convertMessage({ ...messageEvent, topicConfig: configTopics[messageEvent.topic] }, topicSchemaConverters, frames);
                        }
                    });
                }
            }
            prevBlocks = newBlocks;
        }
        if (watchedFields.has("currentTime")) {
            updateRenderStateField("currentTime", activeData?.currentTime, renderState.currentTime, shouldRender);
        }
        if (watchedFields.has("startTime")) {
            updateRenderStateField("startTime", activeData?.startTime, renderState.startTime, shouldRender);
        }
        if (watchedFields.has("endTime")) {
            updateRenderStateField("endTime", activeData?.endTime, renderState.endTime, shouldRender);
        }
        if (watchedFields.has("previewTime")) {
            const startTime = activeData?.startTime;
            const newPreviewTime = startTime != undefined && hoverValue != undefined
                ? toSec(startTime) + hoverValue.value
                : undefined;
            updateRenderStateField("previewTime", newPreviewTime, renderState.previewTime, shouldRender);
        }
        if (watchedFields.has("colorScheme")) {
            updateRenderStateField("colorScheme", colorScheme, renderState.colorScheme, shouldRender);
        }
        if (watchedFields.has("appSettings")) {
            updateRenderStateField("appSettings", appSettings, renderState.appSettings, shouldRender);
        }
        // Update the prev fields with the latest values at the end of all the watch steps
        // Several of the watch steps depend on the comparison against prev and new values
        prevMessageConverters = messageConverters;
        prevCollatedConversions = collatedConversions;
        if (!shouldRender.value) {
            return undefined;
        }
        return renderState;
    };
}
export { initRenderStateBuilder };

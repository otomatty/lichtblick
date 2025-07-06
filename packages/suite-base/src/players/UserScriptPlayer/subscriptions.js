// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import * as R from "ramda";
import { mergeSubscriptions } from "@lichtblick/suite-base/components/MessagePipeline/subscriptions";
/**
 * Calculates a mapping from topic name to a SubscribePayload containing the
 * minimum `preloadType` necessary to fulfill that request.
 */
export function getPreloadTypes(subscriptions) {
    return R.pipe(
    // Gather all of the payloads into subscriptions for the same topic
    R.groupBy((v) => v.topic), 
    // Consolidate subscriptions to the same topic down to a single payload
    // and ignore `fields`
    R.mapObjIndexed((payloads, topic) => {
        // If at least one preloadType is explicitly "full", we need "full",
        // but default to "partial"
        const hasFull = (payloads ?? []).some((v) => v.preloadType === "full");
        return {
            topic,
            preloadType: hasFull ? "full" : "partial",
        };
    }))(subscriptions);
}
/**
 * Rewrites the provided array of subscriptions to omit subscriptions to
 * virtual topics and subscribe only to the inputs to those topics, then
 * deduplicates.
 */
export function remapVirtualSubscriptions(subscriptions, inputsByOutputTopic) {
    // Pair all subscriptions with their user script input topics (if any)
    const payloadInputsPairs = R.pipe(R.map((v) => [v, inputsByOutputTopic.get(v.topic)]), R.filter(([, topics]) => topics?.length !== 0))(subscriptions);
    return R.pipe(R.chain(([subscription, topics]) => {
        const preloadType = subscription.preloadType ?? "partial";
        // Leave the subscription unmodified if it is not a user script topic
        if (topics == undefined) {
            return [subscription];
        }
        // Subscribe to all fields for all topics used by this user script
        // because we can't know what fields the user script actually uses
        // (for now)
        return topics.map((v) => ({
            topic: v,
            preloadType,
        }));
    }), mergeSubscriptions)(payloadInputsPairs);
}

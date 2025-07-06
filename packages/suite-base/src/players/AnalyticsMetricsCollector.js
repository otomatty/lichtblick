// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import Log from "@lichtblick/log";
import { AppEvent } from "@lichtblick/suite-base/services/IAnalytics";
const log = Log.getLogger(__filename);
export default class AnalyticsMetricsCollector {
    #metadata = {};
    #analytics;
    constructor(analytics) {
        log.debug("New AnalyticsMetricsCollector");
        this.#analytics = analytics;
    }
    setProperty(key, value) {
        this.#metadata[key] = value;
    }
    logEvent(event, data) {
        void this.#analytics.logEvent(event, { ...this.#metadata, ...data });
    }
    playerConstructed() {
        this.logEvent(AppEvent.PLAYER_CONSTRUCTED);
    }
}

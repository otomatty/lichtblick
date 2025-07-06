// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { compare } from "@lichtblick/rostime";
import { mergeAsyncIterators } from "@lichtblick/suite-base/players/IterablePlayer/shared/utils/mergeAsyncIterators";
import { accumulateMap, mergeMetadata, mergeTopicStats, setEndTime, setStartTime, } from "@lichtblick/suite-base/players/IterablePlayer/shared/utils/mergeInitialization";
import { validateAndAddNewTopics, validateAndAddNewDatatypes, } from "@lichtblick/suite-base/players/IterablePlayer/shared/utils/validateInitialization";
export class MultiIterableSource {
    SourceConstructor;
    dataSource;
    sourceImpl = [];
    constructor(dataSource, SourceConstructor) {
        this.dataSource = dataSource;
        this.SourceConstructor = SourceConstructor;
    }
    async loadMultipleSources() {
        const { type } = this.dataSource;
        const sources = type === "files"
            ? this.dataSource.files.map((file) => new this.SourceConstructor({ type: "file", file }))
            : this.dataSource.urls.map((url) => new this.SourceConstructor({ type: "url", url }));
        this.sourceImpl.push(...sources);
        const initializations = await Promise.all(sources.map(async (source) => await source.initialize()));
        return initializations;
    }
    async initialize() {
        const initializations = await this.loadMultipleSources();
        const resultInit = this.mergeInitializations(initializations);
        this.sourceImpl.sort((a, b) => compare(a.getStart(), b.getStart()));
        return resultInit;
    }
    async *messageIterator(opt) {
        const iterators = this.sourceImpl.map((source) => source.messageIterator(opt));
        yield* mergeAsyncIterators(iterators);
    }
    async getBackfillMessages(args) {
        const backfillMessages = await Promise.all(this.sourceImpl.map(async (source) => await source.getBackfillMessages(args)));
        return backfillMessages.flat();
    }
    mergeInitializations(initializations) {
        const resultInit = {
            start: { sec: Number.MAX_SAFE_INTEGER, nsec: Number.MAX_SAFE_INTEGER },
            end: { sec: Number.MIN_SAFE_INTEGER, nsec: Number.MIN_SAFE_INTEGER },
            datatypes: new Map(),
            metadata: [],
            alerts: [],
            profile: "",
            publishersByTopic: new Map(),
            topics: [],
            topicStats: new Map(),
        };
        for (const init of initializations) {
            resultInit.start = setStartTime(resultInit.start, init.start);
            resultInit.end = setEndTime(resultInit.end, init.end);
            resultInit.profile = init.profile ?? resultInit.profile;
            resultInit.publishersByTopic = accumulateMap(resultInit.publishersByTopic, init.publishersByTopic);
            resultInit.topicStats = mergeTopicStats(resultInit.topicStats, init.topicStats);
            resultInit.metadata = mergeMetadata(resultInit.metadata, init.metadata);
            resultInit.alerts.push(...init.alerts);
            // These methos validate and add to avoid lopp through all topics and datatypes once again
            validateAndAddNewDatatypes(resultInit, init);
            validateAndAddNewTopics(resultInit, init);
        }
        return resultInit;
    }
}

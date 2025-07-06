// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { IterablePlayer, WorkerIterableSource, } from "@lichtblick/suite-base/players/IterablePlayer";
import SampleNuscenesLayout from "./SampleNuscenesLayout.json";
class SampleNuscenesDataSourceFactory {
    id = "sample-nuscenes";
    type = "sample";
    displayName = "Sample: Nuscenes";
    iconName = "FileASPX";
    hidden = true;
    sampleLayout = SampleNuscenesLayout;
    initialize(args) {
        const bagUrl = "https://assets.foxglove.dev/NuScenes-v1.0-mini-scene-0061-df24c12.mcap";
        const source = new WorkerIterableSource({
            initWorker: () => {
                return new Worker(
                // foxglove-depcheck-used: babel-plugin-transform-import-meta
                new URL("@lichtblick/suite-base/players/IterablePlayer/Mcap/McapIterableSourceWorker.worker", import.meta.url));
            },
            initArgs: { url: bagUrl },
        });
        return new IterablePlayer({
            source,
            isSampleDataSource: true,
            name: "Adapted from nuScenes dataset. Copyright © 2020 nuScenes. https://www.nuscenes.org/terms-of-use",
            metricsCollector: args.metricsCollector,
            // Use blank url params so the data source is set in the url
            urlParams: {},
            sourceId: this.id,
        });
    }
}
export default SampleNuscenesDataSourceFactory;

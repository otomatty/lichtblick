// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import RosbridgePlayer from "@lichtblick/suite-base/players/RosbridgePlayer";
class RosbridgeDataSourceFactory {
    id = "rosbridge-websocket";
    type = "connection";
    displayName = "Rosbridge";
    iconName = "Flow";
    docsLinks = [
        { url: "https://docs.foxglove.dev/docs/connecting-to-data/frameworks/ros1#rosbridge" },
    ];
    description = "Connect to a ROS 1 or ROS 2 system using the Rosbridge WebSocket protocol.";
    formConfig = {
        fields: [
            {
                id: "url",
                label: "WebSocket URL",
                defaultValue: "ws://localhost:9090",
                validate: (newValue) => {
                    try {
                        const url = new URL(newValue);
                        if (url.protocol !== "ws:" && url.protocol !== "wss:") {
                            return new Error(`Invalid protocol: ${url.protocol}`);
                        }
                        return undefined;
                    }
                    catch (err) {
                        console.error(err);
                        return new Error("Enter a valid url");
                    }
                },
            },
        ],
    };
    initialize(args) {
        const url = args.params?.url;
        if (!url) {
            return;
        }
        return new RosbridgePlayer({ url, metricsCollector: args.metricsCollector, sourceId: this.id });
    }
}
export default RosbridgeDataSourceFactory;

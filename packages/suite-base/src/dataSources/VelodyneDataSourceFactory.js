// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import VelodynePlayer from "@lichtblick/suite-base/players/VelodynePlayer";
class VelodyneDataSourceFactory {
    id = "velodyne-device";
    type = "connection";
    displayName = "Velodyne Lidar";
    iconName = "GenericScan";
    description = "Connect directly to Velodyne Lidar hardware to inspect incoming sensor data.";
    docsLinks = [{ url: "https://foxglove.dev/docs/studio/connection/velodyne" }];
    formConfig = {
        fields: [{ id: "port", label: "UDP Port", defaultValue: "2369" }],
    };
    initialize(args) {
        const portStr = args.params?.port;
        if (portStr == undefined) {
            return;
        }
        const port = parseInt(portStr);
        return new VelodynePlayer({ port, metricsCollector: args.metricsCollector });
    }
}
export default VelodyneDataSourceFactory;

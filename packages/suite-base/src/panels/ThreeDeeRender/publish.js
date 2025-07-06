// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { ros1, ros2galactic } from "@lichtblick/rosmsg-msgs-common";
import { fromDate } from "@lichtblick/rostime";
import { makeCovarianceArray } from "@lichtblick/suite-base/util/geometry";
export const PublishRos1Datatypes = new Map([
    "geometry_msgs/Point",
    "geometry_msgs/PointStamped",
    "geometry_msgs/Pose",
    "geometry_msgs/PoseStamped",
    "geometry_msgs/PoseWithCovariance",
    "geometry_msgs/PoseWithCovarianceStamped",
    "geometry_msgs/Quaternion",
    "std_msgs/Header",
].map((type) => [type, ros1[type]]));
export const PublishRos2Datatypes = new Map([
    "geometry_msgs/Point",
    "geometry_msgs/PointStamped",
    "geometry_msgs/Pose",
    "geometry_msgs/PoseStamped",
    "geometry_msgs/PoseWithCovariance",
    "geometry_msgs/PoseWithCovarianceStamped",
    "geometry_msgs/Quaternion",
    "std_msgs/Header",
].map((type) => [type, ros2galactic[type]]));
export function makePointMessage(point, frameId) {
    const time = fromDate(new Date());
    return {
        // seq is omitted since it is not present in ros2
        header: { stamp: time, frame_id: frameId },
        point: { x: point.x, y: point.y, z: 0 },
    };
}
export function makePoseMessage(pose, frameId) {
    const time = fromDate(new Date());
    return {
        // seq is omitted since it is not present in ros2
        header: { stamp: time, frame_id: frameId },
        pose,
    };
}
export function makePoseEstimateMessage(pose, frameId, xDev, yDev, thetaDev) {
    const time = fromDate(new Date());
    return {
        // seq is omitted since it is not present in ros2
        header: { stamp: time, frame_id: frameId },
        pose: {
            covariance: makeCovarianceArray(xDev, yDev, thetaDev),
            pose,
        },
    };
}

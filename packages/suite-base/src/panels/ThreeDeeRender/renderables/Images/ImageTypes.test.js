// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { getFrameIdFromImage, getTimestampFromImage, } from "./ImageTypes";
describe("ImageTypes utility functions", () => {
    const mockTime = { sec: 123, nsec: 456000000 };
    const mockHeader = { stamp: mockTime, frame_id: "ros_frame" };
    const mockData = new Uint8Array([1, 2, 3]);
    const rosImage = {
        header: mockHeader,
        height: 10,
        width: 20,
        encoding: "rgb8",
        is_bigendian: false,
        step: 60,
        data: mockData,
    };
    const rosCompressedImage = {
        header: mockHeader,
        format: "jpeg",
        data: mockData,
    };
    const rawImage = {
        timestamp: mockTime,
        frame_id: "foxglove_frame",
        height: 10,
        width: 20,
        encoding: "rgb8",
        step: 60,
        data: mockData,
    };
    const compressedImage = {
        timestamp: mockTime,
        frame_id: "foxglove_frame",
        format: "png",
        data: mockData,
    };
    const compressedVideo = {
        timestamp: mockTime,
        frame_id: "foxglove_frame",
        format: "h264",
        data: mockData,
    };
    const testCases = [
        {
            name: "RosImage",
            image: rosImage,
            expectedFrameId: "ros_frame",
            expectedTime: mockTime,
        },
        {
            name: "RosCompressedImage",
            image: rosCompressedImage,
            expectedFrameId: "ros_frame",
            expectedTime: mockTime,
        },
        {
            name: "RawImage",
            image: rawImage,
            expectedFrameId: "foxglove_frame",
            expectedTime: mockTime,
        },
        {
            name: "CompressedImage",
            image: compressedImage,
            expectedFrameId: "foxglove_frame",
            expectedTime: mockTime,
        },
        {
            name: "CompressedVideo",
            image: compressedVideo,
            expectedFrameId: "foxglove_frame",
            expectedTime: mockTime,
        },
    ];
    describe("getFrameIdFromImage", () => {
        testCases.forEach(({ name, image, expectedFrameId }) => {
            it(`should return the correct frame_id for ${name}`, () => {
                expect(getFrameIdFromImage(image)).toBe(expectedFrameId);
            });
        });
    });
    describe("getTimestampFromImage", () => {
        testCases.forEach(({ name, image, expectedTime }) => {
            it(`should return the correct timestamp for ${name}`, () => {
                expect(getTimestampFromImage(image)).toEqual(expectedTime);
            });
        });
    });
});

/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { renderHook } from "@testing-library/react";
import { toSec } from "@lichtblick/rostime";
import { useMessagePipelineGetter } from "@lichtblick/suite-base/components/MessagePipeline";
import { subtractTimes } from "@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/typescript/userUtils/time";
import useStateTransitionsTime from "./useStateTransitionsTime";
jest.mock("@lichtblick/suite-base/components/MessagePipeline");
jest.mock("@lichtblick/rostime");
jest.mock("@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/typescript/userUtils/time");
describe("useStateTransitionsTime", () => {
    const mockUseMessagePipelineGetter = useMessagePipelineGetter;
    const mockToSec = toSec;
    const mockSubtractTimes = subtractTimes;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it.each([{}, undefined])("should return undefined values when there is no active data or it is undefined. (testing with %s)", () => {
        mockUseMessagePipelineGetter.mockReturnValue((activeDataValue) => ({
            playerState: { activeData: activeDataValue },
        }));
        const { result } = renderHook(() => useStateTransitionsTime());
        expect(result.current.startTime).toBeUndefined();
        expect(result.current.currentTimeSinceStart).toBeUndefined();
        expect(result.current.endTimeSinceStart).toBeUndefined();
    });
    it("should calculate currentTimeSinceStart correctly", () => {
        const startTime = { sec: 1, nsec: 0 };
        const currentTime = { sec: 3, nsec: 0 };
        mockUseMessagePipelineGetter.mockReturnValue(() => ({
            playerState: { activeData: { startTime, currentTime } },
        }));
        mockSubtractTimes.mockReturnValue({ sec: 2, nsec: 0 });
        mockToSec.mockReturnValue(2);
        const { result } = renderHook(() => useStateTransitionsTime());
        expect(result.current.startTime).toEqual(startTime);
        expect(result.current.currentTimeSinceStart).toBe(2);
        expect(result.current.endTimeSinceStart).toBeUndefined();
    });
    it("should calculate endTimeSinceStart correctly", () => {
        const startTime = { sec: 1, nsec: 0 };
        const endTime = { sec: 5, nsec: 0 };
        mockUseMessagePipelineGetter.mockReturnValue(() => ({
            playerState: { activeData: { startTime, endTime } },
        }));
        mockSubtractTimes.mockReturnValue({ sec: 4, nsec: 0 });
        mockToSec.mockReturnValue(4);
        const { result } = renderHook(() => useStateTransitionsTime());
        expect(result.current.startTime).toEqual(startTime);
        expect(result.current.currentTimeSinceStart).toBeUndefined();
        expect(result.current.endTimeSinceStart).toBe(4);
    });
    it("should calculate both currentTimeSinceStart and endTimeSinceStart correctly", () => {
        const startTime = { sec: 1, nsec: 0 };
        const currentTime = { sec: 3, nsec: 0 };
        const endTime = { sec: 5, nsec: 0 };
        mockUseMessagePipelineGetter.mockReturnValue(() => ({
            playerState: { activeData: { startTime, currentTime, endTime } },
        }));
        mockSubtractTimes
            .mockReturnValueOnce({ sec: 2, nsec: 0 })
            .mockReturnValueOnce({ sec: 4, nsec: 0 });
        mockToSec.mockReturnValueOnce(2).mockReturnValueOnce(4);
        const { result } = renderHook(() => useStateTransitionsTime());
        expect(result.current.startTime).toEqual(startTime);
        expect(result.current.currentTimeSinceStart).toBe(2);
        expect(result.current.endTimeSinceStart).toBe(4);
    });
});

/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/* eslint-disable @typescript-eslint/unbound-method */
import { renderHook, act } from "@testing-library/react";
import { debouncePromise } from "@lichtblick/den/async";
import { toSec } from "@lichtblick/rostime";
import { useMessagePipelineGetter } from "@lichtblick/suite-base/components/MessagePipeline";
import { useSetHoverValue, useClearHoverValue, } from "@lichtblick/suite-base/context/TimelineInteractionStateContext";
import { DEFAULT_PLOT_CONFIG } from "@lichtblick/suite-base/panels/Plot/constants";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import PlotBuilder from "@lichtblick/suite-base/testing/builders/PlotBuilder";
import RosTimeBuilder from "@lichtblick/suite-base/testing/builders/RosTimeBuilder";
import usePlotInteractionHandlers from "./usePlotInteractionHandlers";
jest.mock("@lichtblick/den/async", () => ({
    debouncePromise: jest.fn(),
}));
jest.mock("@lichtblick/suite-base/context/TimelineInteractionStateContext", () => ({
    useSetHoverValue: jest.fn(),
    useClearHoverValue: jest.fn(),
    useTimelineInteractionState: jest.fn(),
}));
jest.mock("@lichtblick/suite-base/components/MessagePipeline", () => ({
    useMessagePipelineGetter: jest.fn(),
}));
describe("usePlotInteractionHandlers", () => {
    const mockCoordinator = {
        addInteractionEvent: jest.fn(),
        getCsvData: jest.fn(),
        getXValueAtPixel: jest.fn(() => BasicBuilder.number()),
        resetBounds: jest.fn(),
        setZoomMode: jest.fn(),
    };
    const mockSetActiveTooltip = jest.fn();
    const mockSetHoverValue = jest.fn();
    const mockClearHoverValue = jest.fn();
    const mockSeekPlayback = jest.fn();
    const mockBuildTooltip = jest.fn();
    const setup = ({ config, coordinator = undefined, draggingRef, renderer, setActiveTooltip = jest.fn(), shouldSync, subscriberId, } = {}) => {
        useSetHoverValue.mockReturnValue(mockSetHoverValue);
        useClearHoverValue.mockReturnValue(mockClearHoverValue);
        useMessagePipelineGetter.mockReturnValueOnce(jest.fn(() => ({
            seekPlayback: mockSeekPlayback,
            playerState: { activeData: { startTime: RosTimeBuilder.time() } },
        })));
        const props = {
            config: {
                ...DEFAULT_PLOT_CONFIG,
                ...config,
            },
            coordinator,
            draggingRef: { current: false, ...draggingRef },
            renderer: {
                getElementsAtPixel: jest.fn(),
                // eslint-disable-next-line @typescript-eslint/no-misused-spread
                ...renderer,
            },
            setActiveTooltip,
            shouldSync: shouldSync ?? false,
            subscriberId: subscriberId ?? BasicBuilder.string(),
        };
        return {
            ...renderHook(() => usePlotInteractionHandlers(props)),
            props,
        };
    };
    const triggerMouseMove = async (result) => {
        const boundingClientRect = {
            left: BasicBuilder.number(),
            top: BasicBuilder.number(),
        };
        const event = {
            clientX: BasicBuilder.number(),
            clientY: BasicBuilder.number(),
            currentTarget: {
                getBoundingClientRect: jest.fn(() => ({
                    left: boundingClientRect.left,
                    top: boundingClientRect.top,
                })),
            },
        };
        const expectedCanvasX = event.clientX - boundingClientRect.left;
        const expectedCanvasY = event.clientY - boundingClientRect.top;
        await act(async () => {
            result.current.onMouseMove(event);
        });
        return {
            ...event,
            expectedCanvasX,
            expectedCanvasY,
        };
    };
    const triggerWheel = (result, boundingRect) => {
        const event = {
            deltaX: BasicBuilder.number(),
            deltaY: BasicBuilder.number(),
            clientX: BasicBuilder.number(),
            clientY: BasicBuilder.number(),
            currentTarget: {
                getBoundingClientRect: jest.fn(() => boundingRect),
            },
        };
        act(() => {
            result.current.onWheel(event);
        });
        return event;
    };
    beforeEach(() => {
        jest.clearAllMocks();
        debouncePromise.mockReturnValue(mockBuildTooltip);
    });
    describe("setActiveTooltip", () => {
        it("clears active tooltip if no tooltip items are found", async () => {
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, props } = setup();
            (props.renderer?.getElementsAtPixel).mockReturnValueOnce([]);
            await triggerMouseMove(result);
            expect(props.setActiveTooltip).toHaveBeenCalledWith(undefined);
            expect(props.setActiveTooltip).toHaveBeenCalledTimes(1);
        });
        it("set active tooltip if tooltip items are found with correct data", async () => {
            const elements = [
                PlotBuilder.hoverElement({ data: PlotBuilder.datum({ value: BasicBuilder.number() }) }),
            ];
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, props } = setup();
            (props.renderer?.getElementsAtPixel).mockReturnValueOnce(elements);
            const mouseMoved = await triggerMouseMove(result);
            const expectedResult = {
                x: mouseMoved.clientX,
                y: mouseMoved.clientY,
                data: [
                    {
                        configIndex: elements[0].configIndex,
                        value: elements[0].data.value,
                    },
                ],
            };
            expect(props.setActiveTooltip).toHaveBeenCalledWith(expectedResult);
            expect(props.setActiveTooltip).toHaveBeenCalledTimes(1);
        });
        it("set active tooltip if tooltip items are found when value is a time object", async () => {
            const elements = [
                PlotBuilder.hoverElement({ data: PlotBuilder.datum({ value: RosTimeBuilder.time() }) }),
            ];
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, props } = setup();
            (props.renderer?.getElementsAtPixel).mockReturnValueOnce(elements);
            const mouseMoved = await triggerMouseMove(result);
            const expectedResult = {
                x: mouseMoved.clientX,
                y: mouseMoved.clientY,
                data: [
                    { configIndex: elements[0].configIndex, value: toSec(elements[0].data.value) },
                ],
            };
            expect(props.setActiveTooltip).toHaveBeenCalledWith(expectedResult);
            expect(props.setActiveTooltip).toHaveBeenCalledTimes(1);
        });
        it("set active tooltip if tooltip items are found when value is undefined", async () => {
            const elements = PlotBuilder.hoverElements(1);
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, props } = setup();
            (props.renderer?.getElementsAtPixel).mockReturnValueOnce(elements);
            const mouseMoved = await triggerMouseMove(result);
            const expectedResult = {
                x: mouseMoved.clientX,
                y: mouseMoved.clientY,
                data: [{ configIndex: elements[0].configIndex, value: elements[0].data.y }],
            };
            expect(props.setActiveTooltip).toHaveBeenCalledWith(expectedResult);
            expect(props.setActiveTooltip).toHaveBeenCalledTimes(1);
        });
        it("set active tooltip if tooltip items are found when having multiple hover elements", async () => {
            const elements = [
                PlotBuilder.hoverElement({ data: PlotBuilder.datum({ value: BasicBuilder.number() }) }),
                PlotBuilder.hoverElement({ data: PlotBuilder.datum({ value: BasicBuilder.number() }) }),
                PlotBuilder.hoverElement({ data: PlotBuilder.datum({ value: BasicBuilder.number() }) }),
            ];
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, props } = setup();
            (props.renderer?.getElementsAtPixel).mockReturnValueOnce(elements);
            const mouseMoved = await triggerMouseMove(result);
            const expectedResult = {
                x: mouseMoved.clientX,
                y: mouseMoved.clientY,
                data: elements.map((element) => ({
                    configIndex: element.configIndex,
                    value: element.data.value,
                })),
            };
            expect(props.setActiveTooltip).toHaveBeenCalledWith(expectedResult);
            expect(props.setActiveTooltip).toHaveBeenCalledTimes(1);
        });
    });
    describe("onMouseMove", () => {
        it("sets hover value when xAxisMode is timestamp", async () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            const mouseMoved = await triggerMouseMove(result);
            expect(result.current.onMouseMove).toBeDefined();
            expect(props.coordinator?.getXValueAtPixel).toHaveBeenCalledWith(mouseMoved.expectedCanvasX);
            expect(mockBuildTooltip).toHaveBeenCalledWith({
                clientX: mouseMoved.clientX,
                clientY: mouseMoved.clientY,
                canvasX: mouseMoved.expectedCanvasX,
                canvasY: mouseMoved.expectedCanvasY,
            });
            expect(mockSetHoverValue).toHaveBeenCalledWith({
                componentId: props.subscriberId,
                value: expect.any(Number),
                type: "PLAYBACK_SECONDS",
            });
        });
        it("sets hover value with type 'other' when xAxisMode is not timestamp", async () => {
            const { result, props } = setup({
                config: { xAxisVal: "other" },
                coordinator: mockCoordinator,
            });
            const mouseMoved = await triggerMouseMove(result);
            expect(result.current.onMouseMove).toBeDefined();
            expect(props.coordinator?.getXValueAtPixel).toHaveBeenCalledWith(mouseMoved.expectedCanvasX);
            expect(mockBuildTooltip).toHaveBeenCalledWith({
                clientX: mouseMoved.clientX,
                clientY: mouseMoved.clientY,
                canvasX: mouseMoved.expectedCanvasX,
                canvasY: mouseMoved.expectedCanvasY,
            });
            expect(mockSetHoverValue).toHaveBeenCalledWith({
                componentId: props.subscriberId,
                value: expect.any(Number),
                type: "OTHER",
            });
        });
        it("should return early when coordinator is not provided", async () => {
            const { result } = setup();
            await triggerMouseMove(result);
            expect(mockCoordinator.getXValueAtPixel).not.toHaveBeenCalled();
            expect(mockSetHoverValue).not.toHaveBeenCalled();
        });
        describe("when using actual debouncePromise", () => {
            it("calls debouncePromise with correct arguments", async () => {
                const { result, props } = setup({ coordinator: mockCoordinator });
                const mouseMoved = await triggerMouseMove(result);
                expect(props.coordinator?.getXValueAtPixel).toHaveBeenCalledWith(mouseMoved.expectedCanvasX);
                expect(mockSetHoverValue).toHaveBeenCalledWith({
                    componentId: props.subscriberId,
                    value: expect.any(Number),
                    type: "PLAYBACK_SECONDS",
                });
            });
            it("clears active tooltip if no tooltip items are found", async () => {
                debouncePromise.mockImplementationOnce((fn) => fn);
                const { result, props } = setup({ coordinator: mockCoordinator });
                (props.renderer?.getElementsAtPixel).mockReturnValueOnce([]);
                await triggerMouseMove(result);
                expect(props.setActiveTooltip).toHaveBeenCalledWith(undefined);
                expect(mockSetHoverValue).toHaveBeenCalled();
            });
            it("does not clear active tooltip if tooltip items are found", async () => {
                const { result, props } = setup({ coordinator: mockCoordinator });
                (props.renderer?.getElementsAtPixel).mockReturnValueOnce([]);
                await triggerMouseMove(result);
                expect(props.setActiveTooltip).not.toHaveBeenCalledWith(undefined);
                expect(mockSetHoverValue).toHaveBeenCalled();
            });
        });
        it("does not set active tooltip if isMounted is false", async () => {
            debouncePromise.mockImplementationOnce((fn) => fn);
            const { result, unmount } = setup();
            unmount();
            await triggerMouseMove(result);
            expect(mockSetActiveTooltip).not.toHaveBeenCalled();
        });
    });
    describe("onMouseOut", () => {
        it("clears hover value", () => {
            const { result, props } = setup();
            act(() => {
                result.current.onMouseOut();
            });
            expect(props.setActiveTooltip).toHaveBeenCalledWith(undefined);
            expect(mockClearHoverValue).toHaveBeenCalledWith(props.subscriberId);
        });
        it("sets mousePresentRef to false", () => {
            const { result, props } = setup();
            act(() => {
                result.current.onMouseOut();
            });
            expect(props.draggingRef.current).toBe(false);
        });
    });
    describe("onWheel", () => {
        it("handles wheel event correctly", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            const boundingRect = {
                left: BasicBuilder.number(),
                top: BasicBuilder.number(),
                toJSON: jest.fn().mockReturnValue({
                    left: BasicBuilder.number(),
                    top: BasicBuilder.number(),
                }),
            };
            const wheel = triggerWheel(result, boundingRect);
            expect(props.coordinator?.addInteractionEvent).toHaveBeenCalledWith({
                type: "wheel",
                cancelable: false,
                deltaX: wheel.deltaX,
                deltaY: wheel.deltaY,
                clientX: wheel.clientX,
                clientY: wheel.clientY,
                boundingClientRect: boundingRect.toJSON(),
            });
        });
        it("should onWheel return early when coordinator is not provided", () => {
            const { result } = setup();
            triggerWheel(result, {
                left: BasicBuilder.number(),
                top: BasicBuilder.number(),
            });
            expect(mockCoordinator.addInteractionEvent).not.toHaveBeenCalled();
        });
    });
    describe("onResetView", () => {
        it("should onResetView return early when coordinator is not provided", () => {
            const { result } = setup();
            act(() => {
                result.current.onResetView();
            });
            expect(mockCoordinator.resetBounds).not.toHaveBeenCalled();
        });
        it("resets coordinator bounds", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            act(() => {
                result.current.onResetView();
            });
            expect(props.coordinator?.resetBounds).toHaveBeenCalled();
        });
    });
    describe("key handlers", () => {
        it("sets zoom mode to 'y' on key down 'v'", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            act(() => {
                result.current.keyDownHandlers.v();
            });
            expect(props.coordinator?.setZoomMode).toHaveBeenCalledWith("y");
        });
        it("sets zoom mode to 'xy' on key down 'b'", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            act(() => {
                result.current.keyDownHandlers.b();
            });
            expect(props.coordinator?.setZoomMode).toHaveBeenCalledWith("xy");
        });
        it("sets zoom mode to 'x' on key up 'v'", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            act(() => {
                result.current.keyUphandlers.v();
            });
            expect(props.coordinator?.setZoomMode).toHaveBeenCalledWith("x");
        });
        it("sets zoom mode to 'x' on key up 'b'", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            act(() => {
                result.current.keyUphandlers.b();
            });
            expect(props.coordinator?.setZoomMode).toHaveBeenCalledWith("x");
        });
    });
    describe("onClick", () => {
        function buildClickEvent() {
            return {
                clientX: BasicBuilder.number(),
                currentTarget: {
                    getBoundingClientRect: jest.fn(() => ({ left: BasicBuilder.number() })),
                },
            };
        }
        it("should return early if draggingRef is true", () => {
            const { result } = setup({ draggingRef: { current: true } });
            act(() => {
                result.current.onClick(buildClickEvent());
            });
            expect(mockSeekPlayback).not.toHaveBeenCalled();
        });
        it("should return early if xAxisMode is not 'timestamp'", () => {
            const { result } = setup({
                config: {
                    xAxisVal: "other",
                },
            });
            act(() => {
                result.current.onClick(buildClickEvent());
            });
            expect(mockSeekPlayback).not.toHaveBeenCalled();
        });
        it("should return early if seekPlayback or startTime is undefined", () => {
            useMessagePipelineGetter.mockReturnValueOnce({
                seekPlayback: jest.fn(),
                playerState: { activeData: { startTime: RosTimeBuilder.time() } },
            });
            const { result } = setup();
            act(() => {
                result.current.onClick(buildClickEvent());
            });
            expect(mockSeekPlayback).not.toHaveBeenCalled();
        });
        it("should call seekPlayback when seekSeconds greater than 0", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            const seekSeconds = BasicBuilder.number();
            (props.coordinator?.getXValueAtPixel).mockReturnValueOnce(seekSeconds);
            act(() => {
                result.current.onClick(buildClickEvent());
            });
            expect(mockSeekPlayback).toHaveBeenCalledTimes(1);
        });
        it("should not normalize time if seekSeconds is negative", () => {
            const { result, props } = setup({ coordinator: mockCoordinator });
            const seekSeconds = -1;
            (props.coordinator?.getXValueAtPixel).mockReturnValue(seekSeconds);
            act(() => {
                result.current.onClick(buildClickEvent());
            });
            expect(mockSeekPlayback).not.toHaveBeenCalled();
        });
    });
});

// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import { openSiblingStateTransitionsPanel } from "./openSiblingStateTransitionsPanel";
describe("openSiblingStateTransitionsPanel", () => {
    let mockOpenSiblingPanel;
    const topicName = BasicBuilder.string();
    beforeEach(() => {
        jest.clearAllMocks();
        mockOpenSiblingPanel = jest.fn();
    });
    function setup({ config = {} } = {}) {
        return {
            topicName,
            config: {
                paths: [],
                isSynced: false,
                ...config,
            },
        };
    }
    it("should call openSiblingPanel with correct parameters", () => {
        const config = { paths: [], isSynced: false };
        openSiblingStateTransitionsPanel(mockOpenSiblingPanel, topicName);
        const siblingConfigCreator = mockOpenSiblingPanel.mock.calls[0][0]
            .siblingConfigCreator;
        const newConfig = siblingConfigCreator(config);
        expect(mockOpenSiblingPanel).toHaveBeenCalledWith({
            panelType: "StateTransitions",
            updateIfExists: true,
            siblingConfigCreator: expect.any(Function),
        });
        expect(newConfig.paths).toEqual([{ value: topicName, timestampMethod: "receiveTime" }]);
    });
    it("should not duplicate paths in the config", () => {
        const { config } = setup({
            config: {
                paths: [{ value: topicName, timestampMethod: "receiveTime" }],
                isSynced: false,
            },
        });
        openSiblingStateTransitionsPanel(mockOpenSiblingPanel, topicName);
        const siblingConfigCreator = mockOpenSiblingPanel.mock.calls[0][0]
            .siblingConfigCreator;
        const newConfig = siblingConfigCreator(config);
        expect(newConfig.paths).toEqual([{ value: topicName, timestampMethod: "receiveTime" }]);
    });
});

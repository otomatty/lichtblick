import { DEFAULT_SETTINGS_TREE_NODE } from "@lichtblick/suite-base/panels/DiagnosticSummary/constants";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import DiagnosticsBuilder from "@lichtblick/suite-base/testing/builders/DiagnosticsBuilder";
import { buildSettingsTree } from "./buildSettingsTree";
describe("buildSettingsTree", () => {
    it("should build settings tree with valid topicToRender", () => {
        // Given
        const topics = BasicBuilder.strings({ count: 2 });
        const config = DiagnosticsBuilder.summaryConfig({
            sortByLevel: BasicBuilder.boolean(),
            secondsUntilStale: BasicBuilder.number(),
        });
        // When
        const result = buildSettingsTree({
            availableTopics: topics,
            config,
            topicToRender: topics[0],
        });
        // Then
        const { label: defaultLabel, fields: defaultFields } = DEFAULT_SETTINGS_TREE_NODE.general;
        const { fields: fieldsResult } = result.general;
        expect(result.general?.label).toEqual(defaultLabel);
        expect(fieldsResult?.topicToRender).toEqual({
            input: "select",
            label: defaultFields?.topicToRender.label,
            value: topics[0],
            error: undefined,
            options: [
                { label: topics[0], value: topics[0] },
                { label: topics[1], value: topics[1] },
            ],
        });
        expect(fieldsResult?.sortByLevel).toEqual({
            input: "boolean",
            label: defaultFields?.sortByLevel.label,
            value: config.sortByLevel,
        });
        expect(fieldsResult?.secondsUntilStale).toEqual({
            input: "number",
            label: defaultFields?.secondsUntilStale.label,
            help: defaultFields?.secondsUntilStale.help,
            min: (defaultFields?.secondsUntilStale).min,
            placeholder: (defaultFields?.secondsUntilStale).placeholder,
            precision: (defaultFields?.secondsUntilStale).precision,
            step: (defaultFields?.secondsUntilStale).step,
            value: config.secondsUntilStale,
        });
    });
    it("should include topicToRender in options and set error if topic is not available", () => {
        // Given
        const config = DiagnosticsBuilder.summaryConfig({
            sortByLevel: BasicBuilder.boolean(),
            secondsUntilStale: BasicBuilder.number(),
        });
        const topics = BasicBuilder.strings({ count: 3 });
        // When
        const result = buildSettingsTree({
            availableTopics: [topics[1], topics[2]],
            config,
            topicToRender: topics[0],
        });
        // Then
        const { fields: fieldsResult } = result.general;
        expect(fieldsResult?.topicToRender?.error).toEqual(`Topic ${topics[0]} is not available`);
    });
    it("should handle empty availableTopics array", () => {
        // Given
        const config = DiagnosticsBuilder.summaryConfig({
            sortByLevel: BasicBuilder.boolean(),
            secondsUntilStale: BasicBuilder.number(),
        });
        const topicToRender = BasicBuilder.string();
        // When
        const result = buildSettingsTree({
            availableTopics: [],
            config,
            topicToRender,
        });
        // Then
        const topicToRenderResult = result.general?.fields?.topicToRender;
        expect(topicToRenderResult.options).toEqual([{ value: topicToRender, label: topicToRender }]);
        expect(topicToRenderResult.error).toEqual(`Topic ${topicToRender} is not available`);
    });
});

/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import * as _ from "lodash-es";
import BasicBuilder from "@lichtblick/suite-base/testing/builders/BasicBuilder";
import GaugeBuilder from "@lichtblick/suite-base/testing/builders/GaugeBuilder";
import { settingsActionReducer } from "./settingsActionReducer";
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
describe("settingsActionReducer", () => {
    function buildUpdateAction({ path, value, } = {}) {
        return {
            action: "update",
            payload: {
                input: "autocomplete",
                path: path ?? BasicBuilder.strings(),
                value: value ?? BasicBuilder.string(),
            },
        };
    }
    function buildPerformNodeAction() {
        return {
            action: "perform-node-action",
            payload: {
                id: BasicBuilder.string(),
                path: BasicBuilder.strings(),
            },
        };
    }
    function setup(propsOverride = {}) {
        const settingsTreeAction = BasicBuilder.sample([
            "perform-node-action",
            "update",
        ]);
        const action = buildPerformNodeAction();
        if (settingsTreeAction === "update") {
            _.merge(action, buildUpdateAction());
        }
        const props = {
            prevConfig: GaugeBuilder.config(),
            action,
            ...propsOverride,
        };
        return { props };
    }
    it("should throw an error for 'perform-node-action' action", () => {
        const { props } = setup({
            action: buildPerformNodeAction(),
        });
        expect(() => settingsActionReducer(props)).toThrow(`Unhandled node action: ${props.action.payload.id}`);
    });
    it("should update a general property when path is 'general'", () => {
        const value = BasicBuilder.string();
        const path = ["general", ...BasicBuilder.strings()];
        const action = buildUpdateAction({ path, value });
        const { props } = setup({ action });
        const result = settingsActionReducer(props);
        expect(result).toHaveProperty(path[1]);
        expect(result[path[1]]).toBe(value);
    });
    it("should throw an error for an unexpected path[0]", () => {
        const action = buildUpdateAction();
        const { props } = setup({ action });
        expect(() => settingsActionReducer(props)).toThrow(`Unexpected payload.path[0]: ${props.action.payload.path[0]}`);
    });
    it("Immer should return the same config if the action type is not handled", () => {
        const action = {
            action: "unknown-action",
            payload: {},
        };
        const { props } = setup({ action });
        const result = settingsActionReducer({ prevConfig: props.prevConfig, action });
        expect(result).toEqual(props.prevConfig);
    });
});

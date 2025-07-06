import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/** @jest-environment jsdom */
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { act, fireEvent, render, screen } from "@testing-library/react";
import { usePrompt } from "./usePrompt";
describe("usePrompt", () => {
    it("cleans up extra nodes added", async () => {
        let prompt;
        const Test = () => {
            let promptModal;
            [prompt, promptModal] = usePrompt();
            return _jsx(_Fragment, { children: promptModal });
        };
        const root = render(_jsx(Test, {}));
        const start = document.body.childNodes.length;
        let promise;
        act(() => {
            promise = prompt({ title: "Hello" });
        });
        expect(promise).toBeDefined();
        expect(document.body.childNodes.length).toEqual(start + 1);
        root.unmount();
        expect(document.body.childNodes.length).toEqual(start);
        await expect(promise).resolves.toBeUndefined();
    });
    it("should support a title and placeholder", async () => {
        let prompt;
        const Test = () => {
            let promptModal;
            [prompt, promptModal] = usePrompt();
            return _jsx(_Fragment, { children: promptModal });
        };
        const root = render(_jsx(Test, {}));
        act(() => {
            void prompt({
                title: "test-title",
                placeholder: "test-placeholder",
            });
        });
        await expect(screen.findByText("test-title")).resolves.not.toBeUndefined();
        const input = await screen.findByPlaceholderText("test-placeholder");
        expect(input.value).toEqual("");
        root.unmount();
    });
    it("should return entered value", async () => {
        let prompt;
        const Test = () => {
            let promptModal;
            [prompt, promptModal] = usePrompt();
            return _jsx(_Fragment, { children: promptModal });
        };
        const root = render(_jsx(Test, {}));
        let valPromise;
        act(() => {
            valPromise = prompt({
                title: "test-title",
                placeholder: "test-placeholder",
            });
        });
        expect(valPromise).toBeDefined();
        const input = await screen.findByPlaceholderText("test-placeholder");
        fireEvent.change(input, { target: { value: "something" } });
        const submitButton = screen.getByText("OK");
        act(() => {
            submitButton.click();
        });
        await expect(valPromise).resolves.toEqual("something");
        root.unmount();
    });
    it("should use an initial value", async () => {
        let prompt;
        const Test = () => {
            let promptModal;
            [prompt, promptModal] = usePrompt();
            return _jsx(_Fragment, { children: promptModal });
        };
        const root = render(_jsx(Test, {}));
        let valPromise;
        act(() => {
            valPromise = prompt({
                title: "test-title",
                initialValue: "initial-value",
                placeholder: "some-placeholder",
            });
        });
        expect(valPromise).toBeDefined();
        const input = await screen.findByPlaceholderText("some-placeholder");
        expect(input.value).toEqual("initial-value");
        const submitButton = screen.getByText("OK");
        act(() => {
            submitButton.click();
        });
        await expect(valPromise).resolves.toEqual("initial-value");
        root.unmount();
    });
});

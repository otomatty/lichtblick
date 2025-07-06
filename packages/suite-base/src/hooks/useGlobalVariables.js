// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { useCurrentLayoutActions, useCurrentLayoutSelector, } from "@lichtblick/suite-base/context/CurrentLayoutContext";
export const EMPTY_GLOBAL_VARIABLES = Object.freeze({});
const globalVariablesSelector = (state) => state.selectedLayout?.data?.globalVariables ?? EMPTY_GLOBAL_VARIABLES;
export default function useGlobalVariables() {
    const { setGlobalVariables, overwriteGlobalVariables } = useCurrentLayoutActions();
    const globalVariables = useCurrentLayoutSelector(globalVariablesSelector);
    return { setGlobalVariables, overwriteGlobalVariables, globalVariables };
}

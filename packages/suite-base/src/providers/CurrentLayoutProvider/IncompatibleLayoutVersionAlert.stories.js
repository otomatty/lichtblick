// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { IncompatibleLayoutVersionAlert } from "./IncompatibleLayoutVersionAlert";
export default {
    title: "components/IncompatibleLayoutVersionAlert",
    component: IncompatibleLayoutVersionAlert,
    parameters: {
        colorScheme: "light",
    },
};
export const Default = {};
export const Desktop = {
    args: {
        isDesktop: true,
    },
};

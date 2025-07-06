// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
export const MATH_FUNCTIONS = {
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    ceil: Math.ceil,
    cos: Math.cos,
    log: Math.log,
    log1p: Math.log1p,
    log2: Math.log2,
    log10: Math.log10,
    round: Math.round,
    sign: Math.sign,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    trunc: Math.trunc,
};
export const DEFAULT_SIDEBAR_DIMENSION = 240;
export const DEFAULT_ANNOTATION = {
    type: "line",
    display: true,
    drawTime: "beforeDatasetsDraw",
    scaleID: "y",
    borderWidth: 1,
    borderDash: [5, 5],
};
export const DEFAULT_PLOT_CONFIG = {
    paths: [],
    minYValue: undefined,
    maxYValue: undefined,
    showXAxisLabels: true,
    showYAxisLabels: true,
    showLegend: true,
    legendDisplay: "floating",
    showPlotValuesInLegend: false,
    isSynced: true,
    xAxisVal: "timestamp",
    sidebarDimension: DEFAULT_SIDEBAR_DIMENSION,
};
export const DEFAULT_PLOT_PATH = Object.freeze({
    timestampMethod: "receiveTime",
    value: "",
    enabled: true,
});

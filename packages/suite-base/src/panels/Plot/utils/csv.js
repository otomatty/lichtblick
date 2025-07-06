// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { downloadFiles } from "@lichtblick/suite-base/util/download";
import { formatTimeRaw } from "@lichtblick/suite-base/util/time";
function getCSVRow(label, data) {
    const { x, receiveTime, headerStamp, value } = data;
    const receiveTimeFloat = formatTimeRaw(receiveTime);
    const stampTime = headerStamp ? formatTimeRaw(headerStamp) : "";
    return [x, receiveTimeFloat, stampTime, label, value];
}
const getCSVColName = (xAxisVal) => {
    switch (xAxisVal) {
        case "custom":
        case "currentCustom":
            return "x value";
        case "index":
            return "index";
        case "timestamp":
            return "elapsed time";
    }
    return "x";
};
function generateCSV(datasets, xAxisVal) {
    const headLine = [getCSVColName(xAxisVal), "receive time", "header.stamp", "topic", "value"];
    const combinedLines = [headLine];
    for (const dataset of datasets) {
        for (const datum of dataset.data) {
            combinedLines.push(getCSVRow(dataset.label, datum));
        }
    }
    return combinedLines.join("\n");
}
function downloadCSV(filename, datasets, xAxisVal) {
    const csvData = generateCSV(datasets, xAxisVal);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    downloadFiles([{ blob, fileName: `${filename}.csv` }]);
}
export { downloadCSV, generateCSV };

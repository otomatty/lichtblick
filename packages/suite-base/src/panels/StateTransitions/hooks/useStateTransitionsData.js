// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { useMemo } from "react";
import { messagesToDataset } from "@lichtblick/suite-base/panels/StateTransitions/messagesToDataset";
import { datasetContainsArray } from "@lichtblick/suite-base/panels/StateTransitions/shared";
function useStateTransitionsData(paths, startTime, itemsByPath, decodedBlocks, 
// eslint-disable-next-line @lichtblick/no-boolean-parameters
showPoints) {
    return useMemo(() => {
        // ignore all data when we don't have a start time
        if (!startTime) {
            return {
                data: { datasets: [] },
                minY: undefined,
                pathState: [],
            };
        }
        let outMinY;
        const outDatasets = [];
        const outPathState = [];
        paths.forEach((path, pathIndex) => {
            const y = (pathIndex + 1) * 6 * -1;
            outMinY = Math.min(outMinY ?? y, y - 3);
            const blocksForPath = decodedBlocks.map((decodedBlock) => decodedBlock[path.value]);
            const newBlockDataSet = messagesToDataset({
                blocks: blocksForPath,
                path,
                pathIndex,
                startTime,
                y,
                showPoints,
            });
            const items = itemsByPath[path.value];
            const isArray = datasetContainsArray([...blocksForPath, items]);
            outPathState.push({
                path,
                isArray,
            });
            outDatasets.push(newBlockDataSet);
            if (items == undefined) {
                return;
            }
            const newPathDataSet = messagesToDataset({
                blocks: [items],
                path,
                pathIndex,
                startTime,
                y,
                showPoints,
            });
            outDatasets.push(newPathDataSet);
        });
        return {
            data: { datasets: outDatasets },
            minY: outMinY,
            pathState: outPathState,
        };
    }, [decodedBlocks, itemsByPath, paths, startTime, showPoints]);
}
export default useStateTransitionsData;

// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { useEffect } from "react";
import { useTimelineInteractionState, } from "@lichtblick/suite-base/context/TimelineInteractionStateContext";
const selectGlobalBounds = (store) => store.globalBounds;
const selectSetGlobalBounds = (store) => store.setGlobalBounds;
const useGlobalSync = (coordinator, setCanReset, { shouldSync }, subscriberId) => {
    const globalBounds = useTimelineInteractionState(selectGlobalBounds);
    const setGlobalBounds = useTimelineInteractionState(selectSetGlobalBounds);
    useEffect(() => {
        if (globalBounds?.sourceId === subscriberId || !shouldSync) {
            return;
        }
        coordinator?.setGlobalBounds(globalBounds);
    }, [coordinator, globalBounds, shouldSync, subscriberId]);
    useEffect(() => {
        if (!coordinator) {
            return;
        }
        const onTimeseriesBounds = (newBounds) => {
            setGlobalBounds({
                min: newBounds.min,
                max: newBounds.max,
                sourceId: subscriberId,
                userInteraction: true,
            });
        };
        coordinator.on("timeseriesBounds", onTimeseriesBounds);
        coordinator.on("viewportChange", setCanReset);
        return () => {
            coordinator.off("timeseriesBounds", onTimeseriesBounds);
            coordinator.off("viewportChange", setCanReset);
        };
    }, [coordinator, setCanReset, setGlobalBounds, shouldSync, subscriberId]);
};
export default useGlobalSync;

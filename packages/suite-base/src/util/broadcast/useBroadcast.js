// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { useEffect } from "react";
import { useWorkspaceStore } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
import BroadcastManager from "./BroadcastManager";
// Listener for broadcast messages from other players
const useBroadcast = ({ play, pause, seek, playUntil }) => {
    const syncInstances = useWorkspaceStore((store) => store.playbackControls.syncInstances);
    useEffect(() => {
        BroadcastManager.setShouldSync({ shouldSync: syncInstances });
    }, [syncInstances]);
    useEffect(() => {
        const handler = (message) => {
            if (message.type === "playUntil") {
                playUntil?.(message.time);
                return;
            }
            if (message.type === "play") {
                seek?.(message.time);
                play?.();
            }
            if (message.type === "pause") {
                pause?.();
                seek?.(message.time);
            }
            if (message.type === "seek") {
                seek?.(message.time);
            }
        };
        BroadcastManager.getInstance().addListener(handler);
        return () => {
            BroadcastManager.getInstance().removeListener(handler);
        };
    }, [play, pause, seek, playUntil]);
};
export default useBroadcast;

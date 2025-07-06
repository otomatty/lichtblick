// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { useEffect } from "react";
import { usePanelContext } from "@lichtblick/suite-base/components/PanelContext";
const useMessagePathDropConfig = (saveConfig) => {
    const { setMessagePathDropConfig } = usePanelContext();
    useEffect(() => {
        setMessagePathDropConfig({
            getDropStatus(draggedPaths) {
                if (draggedPaths.some((path) => !path.isLeaf)) {
                    return { canDrop: false };
                }
                return { canDrop: true, effect: "add" };
            },
            handleDrop(draggedPaths) {
                saveConfig((prevConfig) => ({
                    ...prevConfig,
                    paths: [
                        ...prevConfig.paths,
                        ...draggedPaths.map((path) => ({
                            value: path.path,
                            enabled: true,
                            timestampMethod: "receiveTime",
                        })),
                    ],
                }));
            },
        });
    }, [saveConfig, setMessagePathDropConfig]);
};
export default useMessagePathDropConfig;

import { Dispatch, SetStateAction } from "react";
import { PlotCoordinator } from "@lichtblick/suite-base/panels/Plot/PlotCoordinator";
declare const useGlobalSync: (coordinator: PlotCoordinator | undefined, setCanReset: Dispatch<SetStateAction<boolean>>, { shouldSync }: {
    shouldSync: boolean;
}, subscriberId: string) => void;
export default useGlobalSync;

import { MarkOptional } from "ts-essentials";
import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
/**
 * Perform any necessary migrations on old layout data.
 */
export declare function migratePanelsState(data: MarkOptional<LayoutData, "configById">): LayoutData;

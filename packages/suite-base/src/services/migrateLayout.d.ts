import { MarkOptional } from "ts-essentials";
import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext/actions";
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
/**
 * Perform any necessary migrations on old layout data.
 */
export declare function migratePanelsState(data: MarkOptional<LayoutData, "configById">): LayoutData;
/**
 * Import a layout from storage, transferring old properties to the current expected format.
 *
 * Layouts created before we stored both working/baseline copies were stored with a "data" field;
 * migrate this to a baseline layout.
 */
export declare function migrateLayout(value: unknown): Layout;

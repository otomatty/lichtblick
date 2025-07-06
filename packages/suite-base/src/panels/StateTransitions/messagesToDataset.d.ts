import { MessageAndData, MessagePathDataItem } from "@lichtblick/suite-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { ChartDataset } from "@lichtblick/suite-base/components/TimeBasedChart/types";
import { MessageDatasetArgs, ValidQueriedDataValue } from "./types";
export declare const baseColors: string[];
/**
 * Processes messages into datasets. For performance reasons all values are condensed into a single
 * dataset with different labels and colors applied per-point.
 */
export declare function messagesToDataset(args: MessageDatasetArgs): ChartDataset;
export declare function extractQueriedData(itemByPath: MessageAndData): MessagePathDataItem | undefined;
export declare function isValidValue(value: unknown): value is number | string | bigint | boolean;
export declare function getColor(value: ValidQueriedDataValue): string;
export declare function createLabel(constantName: string | undefined, value: ValidQueriedDataValue): string;

import { AccessorKeyColumnDef, DisplayColumnDef } from "@tanstack/react-table";
export type CellValue = Record<string, unknown>;
export type MergedColumnsType = Array<AccessorKeyColumnDef<CellValue> | DisplayColumnDef<CellValue>>;

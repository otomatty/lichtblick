import { LayoutInfo } from "@lichtblick/suite-base/types/layouts";
/**
 * LayoutLoader is an object used by lichtblick to load local layouts.
 */
export interface LayoutLoader {
    readonly namespace: "local";
    fetchLayouts: () => Promise<LayoutInfo[]>;
}

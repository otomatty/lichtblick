/// <reference types="react" />
import type { VerticalBarsProps } from "./types";
/**
 * Display vertical bars at the currentTime & the hovered time.
 *
 * This is a separate component in order to limit the scope of what needs to re-render when time and scale change.
 */
export declare const VerticalBars: import("react").NamedExoticComponent<VerticalBarsProps>;

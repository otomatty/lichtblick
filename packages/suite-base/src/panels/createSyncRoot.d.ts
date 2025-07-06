/// <reference types="react" />
/**
 * Creates a root for rendering React components.
 *
 * This function is designed to centralize the creation of React roots
 * for rendering components within a given HTML element.
 *
 * @param component The JSX element to be rendered within the root.
 * @param panelElement The HTML element to serve as the container for the root.
 * @returns A function to unmount the root when needed.
 */
export declare function createSyncRoot(component: React.JSX.Element, panelElement: HTMLDivElement): () => void;

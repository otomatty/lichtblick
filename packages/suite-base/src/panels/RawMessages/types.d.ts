export declare enum NodeState {
    Collapsed = "c",
    Expanded = "e"
}
export type NodeExpansion = "all" | "none" | Record<string, NodeState>;
export type RawMessagesPanelConfig = {
    diffEnabled: boolean;
    diffMethod: "custom" | "previous message";
    diffTopicPath: string;
    expansion?: NodeExpansion;
    showFullMessageForDiff: boolean;
    topicPath: string;
    fontSize: number | undefined;
};

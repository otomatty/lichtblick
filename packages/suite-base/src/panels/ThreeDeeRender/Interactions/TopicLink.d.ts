/// <reference types="react" />
import type { LayoutActions } from "@lichtblick/suite";
type Props = {
    topic: string;
    addPanel: LayoutActions["addPanel"];
    onShowTopicSettings?: (topic: string) => void;
};
export default function TopicLink({ addPanel, onShowTopicSettings, topic, }: Props): React.JSX.Element;
export {};

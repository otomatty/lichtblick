import { CSSProperties, PropsWithChildren } from "react";
type Props = {
    style?: CSSProperties;
    allowMarkdownHtml?: boolean;
};
export default function TextContent(props: PropsWithChildren<Props>): React.ReactElement | ReactNull;
export {};

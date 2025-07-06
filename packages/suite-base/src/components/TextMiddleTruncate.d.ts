import { CSSProperties } from "react";
type Props = {
    text: string;
    endTextLength?: number;
    className?: string;
    style?: CSSProperties;
};
export default function TextMiddleTruncate({ text, endTextLength, className, style, }: Props): React.JSX.Element;
export {};

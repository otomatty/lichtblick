import { ErrorInfo } from "react";
type ErrorDisplayProps = {
    title?: string;
    error?: Error;
    errorInfo?: ErrorInfo;
    content?: React.JSX.Element;
    actions?: React.JSX.Element;
    showErrorDetails?: boolean;
    hideErrorSourceLocations?: boolean;
};
declare function ErrorDisplay(props: ErrorDisplayProps): React.JSX.Element;
export default ErrorDisplay;

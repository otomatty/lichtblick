/// <reference types="react" />
type Props = {
    allowedExtensions?: string[];
    onDrop?: (event: {
        files?: File[];
        handles?: FileSystemFileHandle[];
    }) => void;
};
export default function DocumentDropListener(props: Props): React.JSX.Element;
export {};

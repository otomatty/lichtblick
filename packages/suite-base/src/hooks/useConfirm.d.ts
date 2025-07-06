/// <reference types="react" />
type ConfirmVariant = "danger" | "primary";
type ConfirmAction = "ok" | "cancel";
type ConfirmOptions = {
    title: string;
    prompt?: string | React.JSX.Element;
    ok?: string;
    cancel?: string | false;
    variant?: ConfirmVariant;
};
export declare function useConfirm(): [
    confirm: (options: ConfirmOptions) => Promise<ConfirmAction>,
    confirmModal: React.JSX.Element | undefined
];
export {};

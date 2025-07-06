/// <reference types="react" />
type PromptOptions = {
    title: string;
    subText?: string;
    placeholder?: string;
    initialValue?: string;
    label?: string;
    transformer?: (value: string) => string;
};
export declare function usePrompt(): [
    prompt: (options: PromptOptions) => Promise<string | undefined>,
    promptModal: React.JSX.Element | undefined
];
export type { PromptOptions };

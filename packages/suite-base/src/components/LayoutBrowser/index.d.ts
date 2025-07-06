/// <reference types="react" />
export default function LayoutBrowser({ currentDateForStorybook, }: React.PropsWithChildren<{
    menuClose?: () => void;
    currentDateForStorybook?: Date;
}>): React.JSX.Element;

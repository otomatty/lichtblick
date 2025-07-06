/// <reference types="react" />
type PanelSettingsProps = React.PropsWithChildren<{
    disableToolbar?: boolean;
    selectedPanelIdsForTests?: readonly string[];
}>;
export default function PanelSettings({ disableToolbar, selectedPanelIdsForTests, }: PanelSettingsProps): React.JSX.Element;
export {};

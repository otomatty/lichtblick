import { SettingsTreeNode, SettingsTreeNodeAction, SettingsTreeNodeActionDivider, SettingsTreeNodeActionItem } from "@lichtblick/suite";
export default class SettingsTreeNodeBuilder {
    static nodeAction(props?: Partial<SettingsTreeNodeActionItem>): SettingsTreeNodeActionItem;
    static nodeActions(count?: number): SettingsTreeNodeAction[];
    static nodeDivider(props?: Partial<SettingsTreeNodeActionDivider>): SettingsTreeNodeActionDivider;
    static settingsTreeNode(props?: Partial<SettingsTreeNode>): SettingsTreeNode;
    static settingsTreeNodeNoChildren(props?: Partial<SettingsTreeNode>): SettingsTreeNode;
}

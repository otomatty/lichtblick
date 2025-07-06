/// <reference types="react" />
import { NodeActionsMenuProps } from "@lichtblick/suite-base/components/SettingsTreeEditor/types";
/**
 * ノードアクションメニューコンポーネント
 *
 * 設定ツリーのノードに対する各種アクションを提供するドロップダウンメニューです。
 * "More actions"ボタンをクリックすると、利用可能なアクションのリストが表示されます。
 *
 * @param actions - 表示するアクション項目の配列
 * @param onSelectAction - アクション選択時のコールバック関数
 * @returns ノードアクションメニューコンポーネント
 */
export declare function NodeActionsMenu({ actions, onSelectAction, }: NodeActionsMenuProps): React.JSX.Element;

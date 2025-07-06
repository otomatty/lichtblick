/// <reference types="react" />
import { MenuProps } from "@mui/material";
import { DraggedMessagePath } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
/**
 * ContextMenu - TopicList用右クリックコンテキストメニュー
 *
 * @description
 * このコンポーネントは、TopicListで右クリックした際に表示されるコンテキストメニューです。
 * 選択されたトピックやメッセージパスに応じて、適切なコピー機能を提供します。
 *
 * **主要機能:**
 * - 📋 トピック名のクリップボードコピー
 * - 📋 メッセージパスのクリップボードコピー
 * - 📋 スキーマ名のクリップボードコピー
 * - 🔢 複数選択時の一括コピー
 * - 🌐 多言語対応（i18n）
 *
 * **メニュー項目の動的生成:**
 * 選択されたアイテムの種類と数に応じて、メニュー項目が動的に決定されます：
 *
 * **単一トピック選択時:**
 * - "Copy Topic Name" - トピック名をコピー
 * - "Copy Schema Name" - スキーマ名をコピー
 *
 * **複数トピック選択時:**
 * - "Copy Topic Names" - 複数のトピック名を改行区切りでコピー
 *
 * **単一メッセージパス選択時:**
 * - "Copy Message Path" - メッセージパスをコピー
 *
 * **複数メッセージパス選択時:**
 * - "Copy Message Paths" - 複数のメッセージパスを改行区切りでコピー
 *
 * **混合選択時:**
 * - トピックとメッセージパスが混在している場合、メッセージパス扱いとなる
 *
 * **使用例:**
 * ```typescript
 * <ContextMenu
 *   messagePaths={[
 *     { path: "/odom", isTopic: true, rootSchemaName: "nav_msgs/Odometry" },
 *     { path: "/odom.pose.position.x", isTopic: false, isLeaf: true }
 *   ]}
 *   anchorPosition={{ left: 100, top: 200 }}
 *   onClose={() => setContextMenuOpen(false)}
 * />
 * ```
 *
 * **依存関係:**
 * - useCopyToClipboard: クリップボードコピー機能
 * - useTranslation: 多言語対応
 * - Material-UI Menu: メニューUI
 *
 * @param props - コンポーネントのプロパティ
 * @param props.messagePaths - 選択されたメッセージパスの配列
 * @param props.anchorPosition - メニュー表示位置（マウス座標）
 * @param props.onClose - メニューを閉じる際のコールバック
 * @returns コンテキストメニューのJSX要素
 */
export declare function ContextMenu(props: {
    messagePaths: DraggedMessagePath[];
    anchorPosition: NonNullable<MenuProps["anchorPosition"]>;
    onClose: () => void;
}): React.JSX.Element;

/**
 * @fileoverview アイコン関連の型定義
 *
 * このファイルは、Lichtblickアプリケーションで使用される
 * 登録済みアイコンの型定義を提供します。
 *
 * これらのアイコンは、UIコンポーネント、パネル、ツールバー、
 * メニューなどで一貫したビジュアルデザインを提供するために使用されます。
 */
/**
 * 登録済みアイコン名の統合型
 *
 * @description Lichtblickアプリケーションで使用可能な全てのアイコン名を定義します。
 * この型により、存在しないアイコン名の使用を防ぎ、型安全性を確保します。
 *
 * アイコンカテゴリ:
 * - 操作系: Add, AddIn, Cancel, Delete, Edit
 * - ファイル系: OpenFile, FileASPX
 * - 設定系: Settings, PanelSettings, DatabaseSettings
 * - 表示系: FiveTileGrid, Flow, RectangularClipping
 * - 状態系: ErrorBadge, BookStar, Sparkle
 * - 技術系: ROS, GenericScan, Variable2
 * - その他: BacklogList, Blockhead, BlockheadFilled
 *
 * @example
 * ```typescript
 * // アイコンコンポーネントでの使用
 * interface IconProps {
 *   name: RegisteredIconNames;
 *   size?: number;
 * }
 *
 * // 使用例
 * const saveIcon: RegisteredIconNames = "Add";
 * const deleteIcon: RegisteredIconNames = "Delete";
 * const settingsIcon: RegisteredIconNames = "Settings";
 * ```
 *
 * @note 新しいアイコンを追加する場合は、この型定義を更新し、
 * 対応するアイコンファイルも追加する必要があります。
 */
export type RegisteredIconNames = "Add" | "AddIn" | "BacklogList" | "Blockhead" | "BlockheadFilled" | "BookStar" | "Cancel" | "DatabaseSettings" | "Delete" | "Edit" | "ErrorBadge" | "FileASPX" | "FiveTileGrid" | "Flow" | "GenericScan" | "OpenFile" | "PanelSettings" | "RectangularClipping" | "Settings" | "Sparkle" | "Variable2" | "ROS";

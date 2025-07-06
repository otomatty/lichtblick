/// <reference types="react" />
/**
 * Storybook Decorator - AppBar用Storybookデコレーター
 *
 * AppBarコンポーネントのStorybookストーリーで使用する共通デコレーター。
 * 必要なプロバイダーとMock環境を提供し、AppBarが正常に動作するための
 * 依存関係を全て満たします。
 *
 * 提供機能：
 * - ドラッグ&ドロップ機能（DndProvider）
 * - ワークスペース状態管理（WorkspaceContextProvider）
 * - パネルカタログ（PanelCatalogContext）
 * - レイアウト管理（MockCurrentLayoutProvider）
 * - メッセージパイプライン（MockMessagePipelineProvider）
 *
 * 技術仕様：
 * - React DnD による HTML5 ドラッグ&ドロップ
 * - Mock実装による依存関係の分離
 * - パネル情報の模擬データ提供
 * - Context階層の適切な構築
 *
 * @example
 * ```typescript
 * // 他のStorybookファイルでの使用例
 * export default {
 *   decorators: [StorybookDecorator],
 * } satisfies Meta<typeof MyComponent>;
 * ```
 */
import { StoryFn } from "@storybook/react";
/**
 * Default Export - デフォルトエクスポート
 *
 * Storybookのメタデータ定義。
 * StorybookDecoratorを他のストーリーから除外するための設定を含みます。
 */
declare const _default: {
    title: string;
    excludeStories: string[];
};
export default _default;
/**
 * Storybook Decorator - Storybookデコレーター
 *
 * AppBarコンポーネントのストーリーで使用する共通デコレーター関数。
 * 必要な全てのプロバイダーとMock環境を階層的に提供します。
 *
 * プロバイダー階層：
 * 1. DndProvider - ドラッグ&ドロップ機能
 * 2. WorkspaceContextProvider - ワークスペース状態
 * 3. PanelCatalogContext - パネルカタログ
 * 4. MockCurrentLayoutProvider - レイアウト管理
 * 5. MockMessagePipelineProvider - メッセージパイプライン
 *
 * @param Wrapped - ラップするストーリーコンポーネント
 * @returns 全プロバイダーでラップされたコンポーネント
 */
export declare function StorybookDecorator(Wrapped: StoryFn): React.JSX.Element;

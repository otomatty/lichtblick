/**
 * AppBar Storybook Stories - AppBarコンポーネントの総合Storybookストーリー
 *
 * AppBarコンポーネントの様々な状態と機能をテストするためのストーリー集。
 * プレイヤー状態、データソース、ウィンドウコントロール、多言語対応の確認が可能です。
 *
 * 主なテストケース：
 * - デフォルト表示状態
 * - カスタムウィンドウコントロール（デスクトップアプリ用）
 * - プレイヤー状態の変化（接続・エラー・バッファリング等）
 * - データソースの種類別表示
 * - アラート表示機能
 * - 多言語対応（日本語、中国語、英語）
 * - デバッグ機能（ドラッグ領域の可視化）
 *
 * 技術仕様：
 * - MockMessagePipelineProvider による状態管理
 * - PlayerPresence による接続状態制御
 * - Storybook Actions による操作確認
 * - グリッドレイアウトによる比較表示
 * - 複数言語・テーマの組み合わせテスト
 *
 * @example
 * ```bash
 * # Storybookでの確認方法
 * npm run storybook
 * # AppBar を選択
 * ```
 */
import { StoryObj } from "@storybook/react";
import { AppBar } from ".";
import { StorybookDecorator } from "./StorybookDecorator.stories";
/**
 * Meta Configuration - Storybookメタ設定
 *
 * AppBarストーリーの基本設定と共通デコレーターを定義。
 * ウィンドウコントロールのアクション監視と両カラムテーマ表示を提供します。
 */
declare const _default: {
    title: string;
    component: typeof AppBar;
    decorators: (typeof StorybookDecorator)[];
    args: {
        onMinimizeWindow: import("storybook/actions").HandlerFunction;
        onMaximizeWindow: import("storybook/actions").HandlerFunction;
        onUnmaximizeWindow: import("storybook/actions").HandlerFunction;
        onCloseWindow: import("storybook/actions").HandlerFunction;
    };
    parameters: {
        colorScheme: string;
    };
};
export default _default;
type Story = StoryObj<typeof AppBar>;
/**
 * Default Story - デフォルト表示ストーリー
 *
 * AppBarの基本的な表示状態を確認するストーリー。
 * 標準的なWebアプリケーション表示での使用パターンを確認できます。
 */
export declare const Default: Story;
/**
 * Default Chinese - デフォルト表示（中国語）
 *
 * 中国語ローカライゼーションでのAppBar表示テスト。
 * 中国語文字の表示とレイアウト調整を確認できます。
 */
export declare const DefaultChinese: Story;
/**
 * Default Japanese - デフォルト表示（日本語）
 *
 * 日本語ローカライゼーションでのAppBar表示テスト。
 * 日本語文字の表示とレイアウト調整を確認できます。
 */
export declare const DefaultJapanese: Story;
/**
 * Custom Window Controls - カスタムウィンドウコントロール
 *
 * デスクトップアプリケーション用のカスタムウィンドウコントロール表示。
 * 最小化・最大化・閉じるボタンの表示と機能を確認できます。
 */
export declare const CustomWindowControls: Story;
/**
 * Custom Window Controls Maximized - カスタムウィンドウコントロール（最大化状態）
 *
 * ウィンドウが最大化された状態でのコントロール表示。
 * 最大化解除ボタンの表示と機能を確認できます。
 */
export declare const CustomWindowControlsMaximized: Story;
/**
 * Custom Window Controls Drag Region - ドラッグ領域デバッグ表示
 *
 * ウィンドウのドラッグ可能領域を可視化するデバッグストーリー。
 * WebkitAppRegionの適用範囲を確認できます。
 */
export declare const CustomWindowControlsDragRegion: Story;
/**
 * Player States - プレイヤー状態一覧
 *
 * 様々なプレイヤー接続状態でのAppBar表示を確認するストーリー。
 * 接続状態に応じたUI変化とアラート表示を確認できます。
 *
 * テスト状態：
 * - NOT_PRESENT: 未接続状態
 * - INITIALIZING: 初期化中
 * - RECONNECTING: 再接続中
 * - BUFFERING: バッファリング中
 * - PRESENT: 接続済み
 * - ERROR: エラー状態
 */
export declare const PlayerStates: Story;
/**
 * Player States Chinese - プレイヤー状態一覧（中国語）
 *
 * 中国語ローカライゼーションでのプレイヤー状態表示テスト。
 */
export declare const PlayerStatesChinese: Story;
/**
 * Player States Japanese - プレイヤー状態一覧（日本語）
 *
 * 日本語ローカライゼーションでのプレイヤー状態表示テスト。
 */
export declare const PlayerStatesJapanese: Story;
/**
 * Data Sources - データソース一覧
 *
 * 様々なデータソースタイプでのAppBar表示を確認するストーリー。
 * ファイル、リモート接続、デバイス接続の表示パターンを確認できます。
 *
 * テストケース：
 * - サンプルデータセット（nuScenes）
 * - ローカルファイル（MCAP、ROS Bag、ULog）
 * - リモート接続（ROS、Rosbridge、Foxglove WebSocket）
 * - デバイス接続（Velodyne Lidar）
 * - エラー状態とアラート表示
 */
export declare const DataSources: Story;
/**
 * Data Sources Chinese - データソース一覧（中国語）
 *
 * 中国語ローカライゼーションでのデータソース表示テスト。
 */
export declare const DataSourcesChinese: Story;
/**
 * Data Sources Japanese - データソース一覧（日本語）
 *
 * 日本語ローカライゼーションでのデータソース表示テスト。
 */
export declare const DataSourcesJapanese: Story;

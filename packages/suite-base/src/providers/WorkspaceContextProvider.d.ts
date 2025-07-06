import { ReactNode } from "react";
import { StoreApi } from "zustand";
import { WorkspaceContextStore } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
/**
 * ワークスペースストアの初期状態を作成
 *
 * @returns WorkspaceContextStore - ワークスペースの初期状態オブジェクト
 *
 * @description
 * アプリケーション起動時のデフォルト設定を定義：
 * - ダイアログ（データソース、設定）の初期状態
 * - フィーチャーツアーの管理状態
 * - サイドバー（左右）の表示・非表示とサイズ設定
 * - 再生コントロールの設定（リピート、同期）
 *
 * @structure
 * - dialogs: モーダルダイアログの開閉状態管理
 * - featureTours: 機能紹介ツアーの進行状況管理
 * - sidebars: 左右サイドバーの表示状態とサイズ管理
 * - playbackControls: メディア再生の制御設定
 */
export declare function makeWorkspaceContextInitialState(): WorkspaceContextStore;
/**
 * ワークスペースの状態管理を提供するReact Context Provider
 *
 * @description
 * このProviderは以下の機能を提供します：
 * - ワークスペース全体の状態管理（ダイアログ、サイドバー、ツアー等）
 * - Zustandストアを使用した効率的な状態管理
 * - localStorage への永続化（選択的）
 * - テスト・Storybook環境での柔軟な設定
 * - バージョン管理とマイグレーション対応
 *
 * @features
 * - **状態管理**: Zustandベースの高性能状態管理
 * - **永続化**: 重要な設定のみをlocalStorageに保存
 * - **マイグレーション**: バージョン間の互換性を保つ
 * - **テスト対応**: Storybook等での永続化無効化
 * - **カスタマイズ**: 初期状態とストア作成のカスタマイズ可能
 *
 * @usage
 * ```tsx
 * // 基本的な使用
 * <WorkspaceContextProvider>
 *   <App />
 * </WorkspaceContextProvider>
 *
 * // カスタム初期状態
 * <WorkspaceContextProvider initialState={{ sidebars: { left: { open: false } } }}>
 *   <App />
 * </WorkspaceContextProvider>
 *
 * // Storybook環境
 * <WorkspaceContextProvider disablePersistenceForStorybook>
 *   <Story />
 * </WorkspaceContextProvider>
 * ```
 *
 * @context WorkspaceContext - ワークスペース状態のZustandストアを提供
 */
export default function WorkspaceContextProvider(props: {
    children?: ReactNode;
    /** Storybook環境での永続化無効化フラグ */
    disablePersistenceForStorybook?: boolean;
    /** ワークスペース状態の初期値（部分的なオーバーライド） */
    initialState?: Partial<WorkspaceContextStore>;
    /** カスタムストア作成関数（テスト用） */
    workspaceStoreCreator?: (initialState?: Partial<WorkspaceContextStore>, options?: {
        disablePersistenceForStorybook?: boolean;
    }) => StoreApi<WorkspaceContextStore>;
}): React.JSX.Element;

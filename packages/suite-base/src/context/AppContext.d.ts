/// <reference types="react" />
import { DeepPartial } from "ts-essentials";
import { StoreApi } from "zustand";
import { Immutable, SettingsTreeField, SettingsTreeNode } from "@lichtblick/suite";
import { AppBarMenuItem } from "@lichtblick/suite-base/components/AppBar/types";
import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { WorkspaceContextStore } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
import type { SceneExtensionConfig } from "@lichtblick/suite-base/panels/ThreeDeeRender/SceneExtensionConfig";
import type { Player } from "@lichtblick/suite-base/players/types";
/**
 * AppContext - アプリケーション機能の統合ポイント
 *
 * このコンテキストは、プラットフォーム固有の機能やカスタマイズ可能な
 * コンポーネントを統合するためのインターフェースを提供します。
 * Web版とDesktop版で異なる実装を注入することができます。
 *
 * 主な責任:
 * - UIコンポーネントのカスタマイズ
 * - 機能フラグの管理
 * - プレイヤーの拡張
 * - プラットフォーム固有機能の統合
 */
interface IAppContext {
    /** アプリバーのレイアウトボタン - カスタムレイアウト選択UI */
    appBarLayoutButton?: React.JSX.Element;
    /** アプリバーのメニューアイテム - 追加メニュー項目 */
    appBarMenuItems?: readonly AppBarMenuItem[];
    /** イベント作成関数 - カスタムイベント作成機能 */
    createEvent?: (args: {
        deviceId: string;
        timestamp: string;
        durationNanos: string;
        metadata: Record<string, string>;
    }) => Promise<void>;
    /** 注入された機能 - プラットフォーム固有の機能フラグ */
    injectedFeatures?: InjectedFeatures;
    /** レイアウトファイルインポート関数 - カスタムレイアウト読み込み */
    importLayoutFile?: (fileName: string, data: LayoutData) => Promise<void>;
    /** レイアウト空状態コンポーネント - レイアウトがない時の表示 */
    layoutEmptyState?: React.JSX.Element;
    /** レイアウトブラウザーコンポーネント - レイアウト選択UI */
    layoutBrowser?: () => React.JSX.Element;
    /** サイドバーアイテム - 追加サイドバー項目 */
    sidebarItems?: readonly [[string, {
        iconName: string;
        title: string;
    }]];
    /** 同期アダプター - データ同期コンポーネント */
    syncAdapters?: readonly React.JSX.Element[];
    /** ワークスペース拡張 - ワークスペース機能拡張 */
    workspaceExtensions?: readonly React.JSX.Element[];
    /** 拡張設定コンポーネント - 拡張機能設定UI */
    extensionSettings?: React.JSX.Element;
    /** 設定ステータスボタンレンダラー - 設定項目のステータス表示 */
    renderSettingsStatusButton?: (nodeOrField: Immutable<SettingsTreeNode | SettingsTreeField>) => React.JSX.Element | undefined;
    /** ワークスペースストア作成関数 - カスタムワークスペース状態管理 */
    workspaceStoreCreator?: (initialState?: Partial<WorkspaceContextStore>) => StoreApi<WorkspaceContextStore>;
    /** パフォーマンスサイドバーコンポーネント - パフォーマンス監視UI */
    PerformanceSidebarComponent?: React.ComponentType;
    /** プレイヤーラッパー関数 - プレイヤーの機能拡張 */
    wrapPlayer: (child: Player) => Player;
}
/**
 * 注入可能な機能のキー定義
 *
 * 現在サポートされている機能:
 * - customSceneExtensions: 3Dシーン拡張のカスタマイズ
 */
export declare const INJECTED_FEATURE_KEYS: {
    readonly customSceneExtensions: "ThreeDeeRender.customSceneExtensions";
};
/**
 * 注入された機能のマップ型定義
 *
 * 各機能キーに対応する設定オブジェクトの型を定義
 */
export type InjectedFeatureMap = {
    [INJECTED_FEATURE_KEYS.customSceneExtensions]?: {
        customSceneExtensions: DeepPartial<SceneExtensionConfig>;
    };
};
/**
 * 注入された機能の統合型
 *
 * 利用可能な機能の集合を表現
 */
export type InjectedFeatures = {
    availableFeatures: InjectedFeatureMap;
};
/**
 * AppContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト実装:
 * - wrapPlayer: パススルー（何も変更しない）
 */
declare const AppContext: import("react").Context<IAppContext>;
/**
 * useAppContext - AppContextの値を取得するカスタムフック
 *
 * @returns IAppContext - アプリケーションコンテキストの値
 *
 * 使用例:
 * ```typescript
 * const { wrapPlayer, layoutBrowser } = useAppContext();
 * const wrappedPlayer = wrapPlayer(basePlayer);
 * ```
 */
export declare function useAppContext(): IAppContext;
export { AppContext };
export type { IAppContext };

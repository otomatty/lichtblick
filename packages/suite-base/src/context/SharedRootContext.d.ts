/// <reference types="react" />
import { AppBarProps } from "@lichtblick/suite-base/components/AppBar";
import { CustomWindowControlsProps } from "@lichtblick/suite-base/components/AppBar/CustomWindowControls";
import { IAppConfiguration } from "@lichtblick/suite-base/context/AppConfigurationContext";
import { INativeAppMenu } from "@lichtblick/suite-base/context/NativeAppMenuContext";
import { INativeWindow } from "@lichtblick/suite-base/context/NativeWindowContext";
import { IDataSourceFactory } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { ExtensionLoader } from "@lichtblick/suite-base/services/ExtensionLoader";
/**
 * SharedRootContext - アプリケーション全体の最上位コンテキスト
 *
 * このコンテキストは、Lichtblick Suiteアプリケーション全体で共有される
 * 基本的な設定とサービスを提供します。プラットフォーム固有の機能や
 * 拡張機能の統合ポイントとして機能します。
 *
 * 主な責任:
 * - データソースファクトリーの管理
 * - 拡張機能ローダーの統合
 * - ネイティブアプリ機能の提供
 * - プラットフォーム固有のUI要素の管理
 */
interface ISharedRootContext {
    /** ディープリンクの配列 - アプリケーション起動時に処理されるURL */
    deepLinks: readonly string[];
    /** アプリケーション設定サービス - 永続化された設定の管理 */
    appConfiguration?: IAppConfiguration;
    /** データソースファクトリー配列 - 利用可能なデータソースの定義 */
    dataSources: IDataSourceFactory[];
    /** 拡張機能ローダー配列 - 拡張機能の読み込みと管理 */
    extensionLoaders: readonly ExtensionLoader[];
    /** ネイティブアプリメニュー - デスクトップアプリのメニューバー */
    nativeAppMenu?: INativeAppMenu;
    /** ネイティブウィンドウ制御 - ウィンドウの状態管理 */
    nativeWindow?: INativeWindow;
    /** 起動設定画面の有効化フラグ */
    enableLaunchPreferenceScreen?: boolean;
    /** グローバルCSSの有効化フラグ */
    enableGlobalCss?: boolean;
    /** アプリバーの左側インセット - プラットフォーム固有のレイアウト調整 */
    appBarLeftInset?: number;
    /** 追加のプロバイダー - プラットフォーム固有のコンテキストプロバイダー */
    extraProviders?: readonly React.JSX.Element[];
    /** カスタムウィンドウコントロールのプロパティ */
    customWindowControlProps?: CustomWindowControlsProps;
    /** アプリバーダブルクリック時のハンドラー */
    onAppBarDoubleClick?: () => void;
    /** カスタムアプリバーコンポーネント */
    AppBarComponent?: (props: AppBarProps) => React.JSX.Element;
}
/**
 * SharedRootContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト値:
 * - deepLinks: 空配列
 * - dataSources: 空配列
 * - extensionLoaders: 空配列
 */
declare const SharedRootContext: import("react").Context<ISharedRootContext>;
/**
 * useSharedRootContext - SharedRootContextの値を取得するカスタムフック
 *
 * @returns ISharedRootContext - 共有ルートコンテキストの値
 *
 * 使用例:
 * ```typescript
 * const { dataSources, extensionLoaders } = useSharedRootContext();
 * ```
 */
export declare function useSharedRootContext(): ISharedRootContext;
export { SharedRootContext };
export type { ISharedRootContext };

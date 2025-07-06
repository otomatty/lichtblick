/// <reference types="react" />
import { StoreApi } from "zustand";
import { CameraModelsMap } from "@lichtblick/den/image/types";
import { ExtensionPanelRegistration, Immutable, PanelSettings, RegisterMessageConverterArgs } from "@lichtblick/suite";
import { ExtensionSettings } from "@lichtblick/suite-base/components/PanelSettings/types";
import { TopicAliasFunctions } from "@lichtblick/suite-base/players/TopicAliasingPlayer/TopicAliasingPlayer";
import { ExtensionInfo, ExtensionNamespace } from "@lichtblick/suite-base/types/Extensions";
/**
 * ## RegisteredPanel
 *
 * **登録済みパネル拡張の情報**
 *
 * ### 概要
 * - 拡張機能によって提供されるパネルの登録情報
 * - パネルの識別・実行に必要なメタデータを保持
 * - 拡張機能の名前空間とパネル実装を関連付け
 */
export type RegisteredPanel = {
    /** 拡張機能の一意識別子 */
    extensionId: string;
    /** 拡張機能の表示名 */
    extensionName: string;
    /** 拡張機能の名前空間（オプション） */
    extensionNamespace?: ExtensionNamespace;
    /** パネルの登録情報と実装 */
    registration: ExtensionPanelRegistration;
};
/**
 * ## InstallExtensionsResult
 *
 * **拡張機能インストール結果**
 *
 * ### 概要
 * - 拡張機能のインストール処理の結果を表現
 * - 成功・失敗の状態とエラー情報を提供
 * - バッチインストール時の個別結果を管理
 */
export type InstallExtensionsResult = {
    /** インストールの成功・失敗 */
    success: boolean;
    /** インストールされた拡張機能の情報（成功時） */
    info?: ExtensionInfo;
    /** エラー情報（失敗時） */
    error?: unknown;
};
/**
 * ## ExtensionCatalog
 *
 * **拡張機能カタログの統合管理インターフェース**
 *
 * ### 概要
 * - 拡張機能の全ライフサイクル管理を提供
 * - パネル、メッセージコンバーター、設定などの拡張ポイントを統合
 * - Zustandストアによる状態管理とリアクティブ更新
 *
 * ### 主な機能
 * - **拡張機能管理**: ダウンロード、インストール、アンインストール
 * - **状態追跡**: インストール済み拡張機能の状態管理
 * - **コントリビューション統合**: 各拡張ポイントの統合管理
 * - **リフレッシュ**: 全拡張機能の再読み込み
 *
 * ### 拡張ポイント
 * - **panels**: カスタムパネル
 * - **messageConverters**: メッセージ変換器
 * - **topicAliasFunctions**: トピック別名関数
 * - **panelSettings**: パネル設定
 * - **cameraModels**: カメラモデル
 *
 * ### 使用例
 * ```typescript
 * // 拡張機能の基本操作
 * const catalog = useExtensionCatalog((state) => state);
 *
 * // 拡張機能のダウンロード
 * const extensionData = await catalog.downloadExtension("https://example.com/extension.foxe");
 *
 * // 拡張機能のインストール
 * const results = await catalog.installExtensions("user", [extensionData]);
 * results.forEach(result => {
 *   if (result.success) {
 *     console.log("Installed:", result.info?.name);
 *   } else {
 *     console.error("Failed to install:", result.error);
 *   }
 * });
 *
 * // インストール状態の確認
 * const isInstalled = catalog.isExtensionInstalled("my-extension-id");
 *
 * // 拡張機能のアンインストール
 * await catalog.uninstallExtension("user", "my-extension-id");
 *
 * // 全拡張機能の更新
 * await catalog.refreshAllExtensions();
 * ```
 *
 * ### 状態管理
 * - **loadedExtensions**: 読み込み済み拡張機能のSet
 * - **installedExtensions**: インストール済み拡張機能の配列
 * - **installedPanels**: インストール済みパネルの辞書
 * - **installedMessageConverters**: インストール済みメッセージコンバーターの配列
 * - **installedTopicAliasFunctions**: インストール済みトピック別名関数
 * - **installedCameraModels**: インストール済みカメラモデル
 * - **panelSettings**: パネル設定の辞書
 *
 * @see ExtensionInfo - 拡張機能の基本情報
 * @see ExtensionNamespace - 拡張機能の名前空間
 * @see ContributionPoints - 拡張ポイントの定義
 */
export type ExtensionCatalog = Immutable<{
    /** 拡張機能をダウンロード */
    downloadExtension: (url: string) => Promise<Uint8Array>;
    /** 拡張機能をインストール */
    installExtensions: (namespace: ExtensionNamespace, data: Uint8Array[]) => Promise<InstallExtensionsResult[]>;
    /** 拡張機能がインストール済みかチェック */
    isExtensionInstalled: (extensionId: string) => boolean;
    /** 拡張機能をインストール済みとしてマーク */
    markExtensionAsInstalled: (extensionId: string) => void;
    /** 拡張機能の状態とコントリビューションポイントをマージ */
    mergeState: (info: ExtensionInfo, contributionPoints: ContributionPoints) => void;
    /** 全拡張機能を再読み込み */
    refreshAllExtensions: () => Promise<void>;
    /** 拡張機能をアンインストール */
    uninstallExtension: (namespace: ExtensionNamespace, id: string) => Promise<void>;
    /** 拡張機能のインストール済みマークを解除 */
    unMarkExtensionAsInstalled: (extensionId: string) => void;
    /** 読み込み済み拡張機能のSet */
    loadedExtensions: Set<string>;
    /** インストール済み拡張機能の配列 */
    installedExtensions: undefined | ExtensionInfo[];
    /** インストール済みパネルの辞書 */
    installedPanels: undefined | Record<string, RegisteredPanel>;
    /** インストール済みメッセージコンバーターの配列 */
    installedMessageConverters: undefined | Omit<MessageConverter, "panelSettings">[];
    /** インストール済みトピック別名関数 */
    installedTopicAliasFunctions: undefined | TopicAliasFunctions;
    /** インストール済みカメラモデル */
    installedCameraModels: CameraModelsMap;
    /** パネル設定の辞書 */
    panelSettings: undefined | ExtensionSettings;
}>;
/**
 * ## MessageConverter
 *
 * **メッセージコンバーター拡張の定義**
 *
 * ### 概要
 * - メッセージ形式の変換を行う拡張機能
 * - 異なるメッセージ形式間の相互変換を提供
 * - 拡張機能のメタデータを含む
 */
export type MessageConverter = RegisterMessageConverterArgs<unknown> & {
    /** 拡張機能の名前空間（オプション） */
    extensionNamespace?: ExtensionNamespace;
    /** 拡張機能の識別子（オプション） */
    extensionId?: string;
};
/**
 * ## ContributionPoints
 *
 * **拡張機能のコントリビューションポイント定義**
 *
 * ### 概要
 * - 拡張機能が提供する機能の集約
 * - 各種拡張ポイントの統合管理
 * - 拡張機能の機能を体系的に整理
 *
 * ### 拡張ポイント
 * - **panels**: カスタムパネルの提供
 * - **messageConverters**: メッセージ変換機能
 * - **topicAliasFunctions**: トピック別名機能
 * - **panelSettings**: パネル設定機能
 * - **cameraModels**: カメラモデル機能
 */
export type ContributionPoints = {
    /** 提供されるパネルの辞書 */
    panels: Record<string, RegisteredPanel>;
    /** 提供されるメッセージコンバーターの配列 */
    messageConverters: MessageConverter[];
    /** 提供されるトピック別名関数 */
    topicAliasFunctions: TopicAliasFunctions;
    /** 提供されるパネル設定 */
    panelSettings: ExtensionSettings;
    /** 提供されるカメラモデル */
    cameraModels: CameraModelsMap;
};
/**
 * ## ExtensionCatalogContext
 *
 * **拡張機能カタログ管理のContext**
 *
 * ### 概要
 * - 拡張機能の統合管理を提供
 * - Zustandストアによる状態管理
 * - 拡張機能のライフサイクル全体を管理
 *
 * ### 管理対象
 * - **拡張機能**: インストール・アンインストール
 * - **パネル**: カスタムパネルの登録・管理
 * - **コンバーター**: メッセージ変換機能
 * - **設定**: パネル設定とカスタマイズ
 * - **モデル**: カメラモデルとトピック別名
 *
 * @see ExtensionCatalog - 拡張機能カタログインターフェース
 * @see ExtensionInfo - 拡張機能基本情報
 * @see ContributionPoints - 拡張ポイント定義
 */
export declare const ExtensionCatalogContext: import("react").Context<StoreApi<{
    readonly downloadExtension: (url: string) => Promise<Uint8Array>;
    readonly installExtensions: (namespace: ExtensionNamespace, data: Uint8Array[]) => Promise<InstallExtensionsResult[]>;
    readonly isExtensionInstalled: (extensionId: string) => boolean;
    readonly markExtensionAsInstalled: (extensionId: string) => void;
    readonly mergeState: (info: ExtensionInfo, contributionPoints: ContributionPoints) => void;
    readonly refreshAllExtensions: () => Promise<void>;
    readonly uninstallExtension: (namespace: ExtensionNamespace, id: string) => Promise<void>;
    readonly unMarkExtensionAsInstalled: (extensionId: string) => void;
    readonly loadedExtensions: ReadonlySet<string>;
    readonly installedExtensions: readonly {
        readonly id: string;
        readonly description: string;
        readonly displayName: string;
        readonly homepage: string;
        readonly keywords: readonly string[];
        readonly license: string;
        readonly name: string;
        readonly namespace?: ExtensionNamespace | undefined;
        readonly publisher: string;
        readonly qualifiedName: string;
        readonly version: string;
        readonly readme?: string | undefined;
        readonly changelog?: string | undefined;
    }[] | undefined;
    readonly installedPanels: {
        readonly [x: string]: {
            readonly extensionId: string;
            readonly extensionName: string;
            readonly extensionNamespace?: ExtensionNamespace | undefined;
            readonly registration: {
                readonly name: string;
                readonly initPanel: (context: import("@lichtblick/suite").PanelExtensionContext) => void | (() => void);
            };
        };
    } | undefined;
    readonly installedMessageConverters: readonly {
        readonly extensionId?: string | undefined;
        readonly fromSchemaName: string;
        readonly toSchemaName: string;
        readonly converter: (msg: unknown, event: {
            readonly topic: string;
            readonly schemaName: string;
            readonly receiveTime: {
                readonly sec: number;
                readonly nsec: number;
            };
            readonly publishTime?: {
                readonly sec: number;
                readonly nsec: number;
            } | undefined;
            readonly message: unknown;
            readonly sizeInBytes: number;
            readonly originalMessageEvent?: any | undefined;
            readonly topicConfig?: unknown;
        }) => unknown;
        readonly extensionNamespace?: ExtensionNamespace | undefined;
    }[] | undefined;
    readonly installedTopicAliasFunctions: readonly {
        readonly extensionId: string;
        readonly aliasFunction: import("@lichtblick/suite").TopicAliasFunction;
    }[] | undefined;
    readonly installedCameraModels: ReadonlyMap<string, {
        readonly extensionId: string;
        readonly modelBuilder: import("@lichtblick/suite").CameraModelBuilder;
    }>;
    readonly panelSettings: {
        readonly [x: string]: {
            readonly [x: string]: {
                readonly settings: (config?: unknown) => import("@lichtblick/suite").SettingsTreeNode;
                readonly handler: (action: import("@lichtblick/suite").SettingsTreeAction, config?: unknown) => void;
                readonly defaultConfig?: unknown;
            };
        };
    } | undefined;
}> | undefined>;
/**
 * ## useExtensionCatalog
 *
 * **拡張機能カタログにアクセスするためのカスタムフック**
 *
 * ### 概要
 * - ExtensionCatalogContextからZustandストアを取得
 * - セレクター関数による効率的な状態選択
 * - 拡張機能の状態管理と操作を提供
 *
 * ### 使用例
 * ```typescript
 * // 全状態の取得
 * const catalog = useExtensionCatalog((state) => state);
 *
 * // 特定の状態のみ選択
 * const installedPanels = useExtensionCatalog((state) => state.installedPanels);
 * const loadedExtensions = useExtensionCatalog((state) => state.loadedExtensions);
 *
 * // 拡張機能の操作
 * function ExtensionManagerComponent() {
 *   const {
 *     installedExtensions,
 *     installExtensions,
 *     uninstallExtension,
 *     refreshAllExtensions
 *   } = useExtensionCatalog((state) => ({
 *     installedExtensions: state.installedExtensions,
 *     installExtensions: state.installExtensions,
 *     uninstallExtension: state.uninstallExtension,
 *     refreshAllExtensions: state.refreshAllExtensions
 *   }));
 *
 *   const handleInstall = async (extensionData: Uint8Array) => {
 *     const results = await installExtensions("user", [extensionData]);
 *     if (results[0]?.success) {
 *       console.log("Extension installed successfully");
 *     }
 *   };
 *
 *   const handleUninstall = async (extensionId: string) => {
 *     await uninstallExtension("user", extensionId);
 *     console.log("Extension uninstalled");
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Installed Extensions</h2>
 *       {installedExtensions?.map(ext => (
 *         <div key={ext.id}>
 *           <span>{ext.name}</span>
 *           <button onClick={() => handleUninstall(ext.id)}>
 *             Uninstall
 *           </button>
 *         </div>
 *       ))}
 *       <button onClick={refreshAllExtensions}>
 *         Refresh All
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // パネル一覧の取得
 * function PanelListComponent() {
 *   const panels = useExtensionCatalog((state) => state.installedPanels);
 *
 *   return (
 *     <div>
 *       {Object.entries(panels || {}).map(([id, panel]) => (
 *         <div key={id}>
 *           <h3>{panel.registration.name}</h3>
 *           <p>Extension: {panel.extensionName}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ### パフォーマンス最適化
 * - セレクター関数による必要な状態のみの選択
 * - 状態変更時の効率的な再レンダリング
 * - Zustandの最適化機能を活用
 *
 * @template T - セレクター関数の戻り値の型
 * @param selector - 状態から必要な値を選択する関数
 * @returns {T} 選択された状態の値
 */
export declare function useExtensionCatalog<T>(selector: (registry: ExtensionCatalog) => T): T;
/**
 * ## getExtensionPanelSettings
 *
 * **拡張機能のパネル設定を取得するヘルパー関数**
 *
 * ### 概要
 * - ExtensionCatalogからパネル設定を抽出
 * - 型安全なパネル設定の取得
 * - 設定が未定義の場合のフォールバック
 *
 * ### 使用例
 * ```typescript
 * function PanelSettingsComponent() {
 *   const catalog = useExtensionCatalog((state) => state);
 *   const panelSettings = getExtensionPanelSettings(catalog);
 *
 *   return (
 *     <div>
 *       {Object.entries(panelSettings).map(([extensionId, settings]) => (
 *         <div key={extensionId}>
 *           <h3>Extension: {extensionId}</h3>
 *           {Object.entries(settings).map(([panelId, panelSetting]) => (
 *             <div key={panelId}>
 *               <h4>Panel: {panelId}</h4>
 *             </div>
 *           ))}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param reg - 拡張機能カタログ
 * @returns パネル設定の辞書（拡張機能ID -> パネルID -> 設定）
 */
export declare function getExtensionPanelSettings(reg: ExtensionCatalog): Record<string, Record<string, PanelSettings<unknown>>>;

import { Dispatch, SetStateAction } from "react";
import { AppSettingsTab } from "@lichtblick/suite-base/components/AppSettingsDialog/types";
import { DataSourceDialogItem } from "@lichtblick/suite-base/components/DataSourceDialog";
import { IDataSourceFactory } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { LeftSidebarItemKey, RightSidebarItemKey } from "./WorkspaceContext";
/**
 * ワークスペースアクションの型定義
 *
 * ワークスペース状態を操作するためのアクション関数群を定義。
 * 各アクションは特定のUI要素や機能の状態を変更する責任を持つ。
 *
 * 構造:
 * - dialogActions: ダイアログの開閉と設定
 * - featureTourActions: 機能ツアーの制御
 * - 個別のオープンアクション: 特定のUI要素を開く
 * - playbackControlActions: 再生コントロールの設定
 * - sidebarActions: サイドバーの状態管理
 */
export type WorkspaceActions = {
    /** ダイアログ関連のアクション */
    dialogActions: {
        /** データソースダイアログのアクション */
        dataSource: {
            /** データソースダイアログを閉じる */
            close: () => void;
            /** データソースダイアログを開く */
            open: (item: DataSourceDialogItem, dataSource?: IDataSourceFactory) => void;
        };
        /** ファイルオープンダイアログのアクション */
        openFile: {
            /** ファイルオープンダイアログを開く */
            open: () => Promise<void>;
        };
        /** 設定ダイアログのアクション */
        preferences: {
            /** 設定ダイアログを閉じる */
            close: () => void;
            /** 設定ダイアログを開く */
            open: (initialTab?: AppSettingsTab) => void;
        };
    };
    /** 機能ツアー関連のアクション */
    featureTourActions: {
        /** 機能ツアーを開始 */
        startTour: (tour: string) => void;
        /** 機能ツアーを完了 */
        finishTour: (tour: string) => void;
    };
    /** アカウント設定を開く */
    openAccountSettings: () => void;
    /** パネル設定を開く */
    openPanelSettings: () => void;
    /** レイアウトブラウザーを開く */
    openLayoutBrowser: () => void;
    /** 再生コントロール関連のアクション */
    playbackControlActions: {
        /** リピート再生の設定 */
        setRepeat: Dispatch<SetStateAction<boolean>>;
        /** インスタンス同期の設定 */
        setSyncInstances: Dispatch<SetStateAction<boolean>>;
    };
    /** サイドバー関連のアクション */
    sidebarActions: {
        /** 左サイドバーのアクション */
        left: {
            /** 左サイドバーのアイテムを選択 */
            selectItem: (item: undefined | LeftSidebarItemKey) => void;
            /** 左サイドバーの開閉状態を設定 */
            setOpen: Dispatch<SetStateAction<boolean>>;
            /** 左サイドバーのサイズを設定 */
            setSize: (size: undefined | number) => void;
        };
        /** 右サイドバーのアクション */
        right: {
            /** 右サイドバーのアイテムを選択 */
            selectItem: (item: undefined | RightSidebarItemKey) => void;
            /** 右サイドバーの開閉状態を設定 */
            setOpen: Dispatch<SetStateAction<boolean>>;
            /** 右サイドバーのサイズを設定 */
            setSize: (size: undefined | number) => void;
        };
    };
};
/**
 * ワークスペース状態操作のためのアクション関数群を提供するカスタムフック
 *
 * このフックは、ワークスペース全体の状態を操作するための
 * 統合されたアクション関数群を提供します。
 *
 * 主な機能:
 * - ダイアログの開閉制御
 * - サイドバーの状態管理
 * - 機能ツアーの制御
 * - 再生コントロールの設定
 * - 各種UI要素の表示制御
 *
 * 特徴:
 * - Immerを使用した不変性の保証
 * - 型安全なアクション定義
 * - 関数の最適化（useCallback/useMemo）
 * - 一貫したエラーハンドリング
 *
 * @returns ワークスペース操作のためのアクション関数群
 *
 * 使用例:
 * ```typescript
 * function WorkspaceToolbar() {
 *   const {
 *     dialogActions,
 *     sidebarActions,
 *     openPanelSettings,
 *     featureTourActions
 *   } = useWorkspaceActions();
 *
 *   return (
 *     <div>
 *       <button onClick={() => dialogActions.preferences.open()}>
 *         設定を開く
 *       </button>
 *       <button onClick={() => sidebarActions.left.selectItem('panel-settings')}>
 *         パネル設定
 *       </button>
 *       <button onClick={() => featureTourActions.startTour('getting-started')}>
 *         ツアー開始
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * アーキテクチャ:
 * - Zustandストアとの統合
 * - Immerによる不変性の保証
 * - 型安全なアクション定義
 * - パフォーマンスの最適化
 */
export declare function useWorkspaceActions(): WorkspaceActions;

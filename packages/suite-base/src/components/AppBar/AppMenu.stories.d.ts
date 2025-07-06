/**
 * AppMenu Storybook Stories - AppMenuコンポーネントのStorybookストーリー
 *
 * AppMenuコンポーネントの様々な表示状態とインタラクションをテストするためのストーリー集。
 * 多言語対応、テーマ対応、メニュー展開状態の確認が可能です。
 *
 * 主なテストケース：
 * - デフォルト表示状態
 * - 各サブメニューの展開（File, View, Help）
 * - ダークテーマ・ライトテーマ対応
 * - 多言語対応（日本語、中国語、英語）
 * - ホバーインタラクション
 * - 最近使用したファイル一覧の表示
 *
 * 技術仕様：
 * - Storybook Testing Library による自動インタラクション
 * - Mock Provider による依存関係の模擬
 * - 複数言語・テーマの組み合わせテスト
 *
 * @example
 * ```bash
 * # Storybookでの確認方法
 * npm run storybook
 * # AppBar > AppMenu を選択
 * ```
 */
import { PopoverPosition, PopoverReference } from "@mui/material";
import { StoryObj } from "@storybook/react";
import { AppMenu } from "./AppMenu";
/**
 * Story Arguments - ストーリー引数の型定義
 *
 * AppMenuコンポーネントのテストに必要なプロパティを定義。
 * Storybookでの表示制御とインタラクションテストに使用されます。
 */
type StoryArgs = {
    /** メニューを閉じるためのイベントハンドラー */
    handleClose: () => void;
    /** メニューのアンカー要素 */
    anchorEl?: HTMLElement;
    /** アンカーの参照方法 */
    anchorReference?: PopoverReference;
    /** アンカーの位置座標 */
    anchorPosition?: PopoverPosition;
    /** ポータルの無効化フラグ */
    disablePortal?: boolean;
    /** メニューの開閉状態 */
    open: boolean;
    /** テスト用ID（自動インタラクション用） */
    testId?: string;
};
/**
 * Meta Configuration - Storybookメタ設定
 *
 * AppMenuストーリーの基本設定と共通デコレーターを定義。
 * 全ストーリーで共有される設定とMockプロバイダーを提供します。
 */
declare const _default: {
    title: string;
    component: typeof AppMenu;
    args: {
        open: true;
        anchorPosition: {
            top: number;
            left: number;
        };
        anchorReference: "anchorPosition";
        disablePortal: true;
        handleClose: (...args: any[]) => void;
    };
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react/dist/types-5617c98e").R, {
        handleClose: () => void;
        anchorEl?: HTMLElement | undefined;
        anchorReference?: PopoverReference | undefined;
        anchorPosition?: PopoverPosition | undefined;
        disablePortal?: boolean | undefined;
        open: boolean;
        testId?: string | undefined;
    }>, { args: { testId: _testId, ...args } }: import("storybook/internal/csf").StoryContext<import("@storybook/react/dist/types-5617c98e").R, {
        handleClose: () => void;
        anchorEl?: HTMLElement | undefined;
        anchorReference?: PopoverReference | undefined;
        anchorPosition?: PopoverPosition | undefined;
        disablePortal?: boolean | undefined;
        open: boolean;
        testId?: string | undefined;
    }>) => React.JSX.Element)[];
    /**
     * Play Function - 自動インタラクション実行
     *
     * testIdが指定された場合、自動的にホバーインタラクションを実行。
     * サブメニューの展開状態をテストするために使用されます。
     *
     * @param canvasElement - Storybookキャンバス要素
     * @param args - ストーリー引数
     */
    play: ({ canvasElement, args }: import("storybook/internal/csf").PlayFunctionContext<import("@storybook/react/dist/types-5617c98e").R, StoryArgs>) => Promise<void>;
};
export default _default;
type Story = StoryObj<StoryArgs>;
/**
 * Default Story - デフォルト表示ストーリー
 *
 * AppMenuの基本的な表示状態を確認するストーリー。
 * メニューが開いた状態で表示され、全体的なレイアウトを確認できます。
 */
export declare const Default: Story;
/**
 * File Menu Dark Theme - Fileメニュー（ダークテーマ）
 *
 * Fileメニューの展開状態をダークテーマで表示。
 * Recent Files一覧とメニュー項目の確認が可能です。
 */
export declare const FileMenuDark: Story;
/**
 * File Menu Dark Chinese - Fileメニュー（ダークテーマ・中国語）
 *
 * 中国語ローカライゼーションでのFileメニュー表示テスト。
 * 多言語対応とテキスト長の調整を確認できます。
 */
export declare const FileMenuDarkChinese: Story;
/**
 * File Menu Dark Japanese - Fileメニュー（ダークテーマ・日本語）
 *
 * 日本語ローカライゼーションでのFileメニュー表示テスト。
 * 日本語文字の表示とレイアウト調整を確認できます。
 */
export declare const FileMenuDarkJapanese: Story;
/**
 * File Menu Light Theme - Fileメニュー（ライトテーマ）
 *
 * Fileメニューの展開状態をライトテーマで表示。
 * ダークテーマとの視覚的差異を確認できます。
 */
export declare const FileMenuLight: Story;
/**
 * File Menu Light Chinese - Fileメニュー（ライトテーマ・中国語）
 */
export declare const FileMenuLightChinese: Story;
/**
 * File Menu Light Japanese - Fileメニュー（ライトテーマ・日本語）
 */
export declare const FileMenuLightJapanese: Story;
/**
 * View Menu Dark Theme - Viewメニュー（ダークテーマ）
 *
 * Viewメニューの展開状態をダークテーマで表示。
 * サイドバー制御とレイアウト管理機能を確認できます。
 */
export declare const ViewMenuDark: Story;
/**
 * View Menu Dark Chinese - Viewメニュー（ダークテーマ・中国語）
 */
export declare const ViewMenuDarkChinese: Story;
/**
 * View Menu Dark Japanese - Viewメニュー（ダークテーマ・日本語）
 */
export declare const ViewMenuDarkJapanese: Story;
/**
 * View Menu Light Theme - Viewメニュー（ライトテーマ）
 */
export declare const ViewMenuLight: Story;
/**
 * View Menu Light Chinese - Viewメニュー（ライトテーマ・中国語）
 */
export declare const ViewMenuLightChinese: Story;
/**
 * View Menu Light Japanese - Viewメニュー（ライトテーマ・日本語）
 */
export declare const ViewMenuLightJapanese: Story;
/**
 * Help Menu Dark Theme - Helpメニュー（ダークテーマ）
 *
 * Helpメニューの展開状態をダークテーマで表示。
 * ドキュメントリンクとサポート情報を確認できます。
 */
export declare const HelpMenuDark: Story;
/**
 * Help Menu Dark Chinese - Helpメニュー（ダークテーマ・中国語）
 */
export declare const HelpMenuDarkChinese: Story;
/**
 * Help Menu Dark Japanese - Helpメニュー（ダークテーマ・日本語）
 */
export declare const HelpMenuDarkJapanese: Story;
/**
 * Help Menu Light Theme - Helpメニュー（ライトテーマ）
 */
export declare const HelpMenuLight: Story;
/**
 * Help Menu Light Chinese - Helpメニュー（ライトテーマ・中国語）
 */
export declare const HelpMenuLightChinese: Story;
/**
 * Help Menu Light Japanese - Helpメニュー（ライトテーマ・日本語）
 */
export declare const HelpMenuLightJapanese: Story;

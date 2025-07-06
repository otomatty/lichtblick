/// <reference types="react" />
import { PopoverOrigin, PopoverPosition, PopoverReference } from "@mui/material";
/**
 * HelpMenu Props - ヘルプメニューコンポーネントのプロパティ
 *
 * Material-UIのMenuコンポーネントの標準プロパティを継承し、
 * ポップオーバーの詳細な位置制御を可能にします。
 */
type HelpMenuProps = {
    /** メニューのアンカー要素 */
    anchorEl?: HTMLElement;
    /** アンカーの原点位置 */
    anchorOrigin?: PopoverOrigin;
    /** アンカーの位置座標 */
    anchorPosition?: PopoverPosition;
    /** アンカーの参照方法 */
    anchorReference?: PopoverReference;
    /** ポータルの無効化フラグ */
    disablePortal?: boolean;
    /** メニューを閉じるためのイベントハンドラー */
    handleClose: () => void;
    /** メニューの開閉状態 */
    open: boolean;
    /** 変換の原点位置 */
    transformOrigin?: PopoverOrigin;
};
/**
 * HelpMenu - ヘルプメニューコンポーネント
 *
 * ユーザーサポートとマーケティング要素を組み合わせたメニューコンポーネント。
 * 外部リソースへのアクセスを提供し、ユーザーの行動をアナリティクスで追跡します。
 *
 * 特徴：
 * - Data Platformへの誘導（マーケティング要素）
 * - アナリティクス追跡による行動分析
 * - ユーザータイプ別のイベント記録
 * - 視覚的に魅力的なアイコンとテキストの組み合わせ
 *
 * アナリティクス：
 * - イベント: HELP_MENU_CLICK_CTA
 * - 追跡データ: ユーザータイプ、CTAの種類
 *
 * @param props - コンポーネントのプロパティ
 * @returns HelpMenuのJSX要素
 */
export declare function HelpMenu(props: HelpMenuProps): React.JSX.Element;
export {};

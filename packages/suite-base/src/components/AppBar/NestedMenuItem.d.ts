import { PropsWithChildren } from "react";
import { AppBarMenuItem } from "./types";
/**
 * NestedMenuItem - ネストメニューアイテムコンポーネント
 *
 * 階層的なメニュー構造を提供するコンポーネント。
 * メインアイテムとサブメニューを組み合わせ、ホバー操作による展開を実現します。
 *
 * 動作仕様：
 * - マウスホバーでサブメニューを展開
 * - 右矢印アイコンでサブメニューの存在を表示
 * - サブメニューは右側に展開
 * - 3種類のメニューアイテムタイプをサポート
 * - キーボードショートカット表示
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - メインメニューアイテムの表示内容
 * @param props.id - メニューアイテムの一意識別子
 * @param props.items - サブメニューアイテムの配列
 * @param props.open - サブメニューの開閉状態
 * @param props.onPointerEnter - ホバー時のイベントハンドラー
 * @returns NestedMenuItemのJSX要素
 */
export declare function NestedMenuItem(props: PropsWithChildren<{
    id?: string;
    items: AppBarMenuItem[];
    open: boolean;
    onPointerEnter: (itemId: string) => void;
}>): React.JSX.Element;

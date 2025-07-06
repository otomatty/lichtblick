/// <reference types="react" />
import { AppMenuProps } from "./types";
/**
 * AppMenu - アプリケーションメインメニューコンポーネント
 *
 * アプリケーションの主要機能へのアクセスを提供するメニューシステム。
 * 3つの主要なメニューグループ（File、View、Help）で構成されています。
 *
 * メニュー構造：
 * - File: データソース管理（開く、接続、履歴）
 * - View: UI制御（サイドバー、レイアウト）
 * - Help: サポート情報（ドキュメント、About、デモ）
 *
 * 状態管理：
 * - ネストメニューの開閉状態
 * - サイドバーの表示状態
 * - 最近使用したデータソースの履歴
 *
 * @param props - メニューコンポーネントのプロパティ
 * @returns AppMenuのJSX要素
 */
export declare function AppMenu(props: AppMenuProps): React.JSX.Element;

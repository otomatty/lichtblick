/**
 * @fileoverview AppSettingsDialog - 定数定義
 *
 * 【概要】
 * AppSettingsDialogコンポーネントで使用される定数を定義します。
 * 主にAboutタブで表示される情報項目とリンクを管理しています。
 *
 * 【主な定数】
 * - `APP_SETTINGS_ABOUT_ITEMS` - Aboutセクションの項目とリンク定義
 *
 * 【使用箇所】
 * - AppSettingsDialog.tsx - Aboutタブでの情報表示
 *
 * 【機能】
 * - ドキュメントリンクの管理
 * - 法的情報リンクの管理
 * - セクション構造の定義
 */
import { AppSettingsSectionKey } from "@lichtblick/suite-base/components/AppSettingsDialog/types";
/**
 * AppSettings Aboutセクション項目定義
 *
 * Aboutタブに表示される情報セクションとリンクを定義するマップ。
 * 各セクションは独立したカテゴリとして表示され、
 * 関連するリンクをグループ化して管理します。
 *
 * セクション構造：
 * - `subheader` - セクションの見出し
 * - `links` - セクション内のリンク配列
 *   - `title` - リンクの表示テキスト
 *   - `url` - リンク先URL（オプション）
 *
 * 定義されるセクション：
 * - **documentation** - ドキュメント関連のリンク
 *   - Lichtblickの公式ドキュメントへのリンク
 * - **legal** - 法的情報のリンク
 *   - ライセンス条項へのリンク
 *
 * @example
 * ```typescript
 * // セクション情報の取得
 * const docSection = APP_SETTINGS_ABOUT_ITEMS.get("documentation");
 * console.log(docSection?.subheader); // "Documentation"
 *
 * // 全セクションの反復処理
 * Array.from(APP_SETTINGS_ABOUT_ITEMS.values()).forEach(section => {
 *   console.log(`Section: ${section.subheader}`);
 *   section.links.forEach(link => {
 *     console.log(`  Link: ${link.title} -> ${link.url}`);
 *   });
 * });
 * ```
 *
 * @type {Map<AppSettingsSectionKey, {subheader: string; links: {title: string; url?: string}[]}>}
 */
export declare const APP_SETTINGS_ABOUT_ITEMS: Map<AppSettingsSectionKey, {
    /** セクションの見出しテキスト */
    subheader: string;
    /** セクション内のリンク配列 */
    links: {
        /** リンクの表示テキスト */
        title: string;
        /** リンク先URL（オプション） */
        url?: string;
    }[];
}>;

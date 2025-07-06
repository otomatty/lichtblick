// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { LICHTBLICK_DOCUMENTATION_LINK } from "@lichtblick/suite-base/constants/documentation";
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
export const APP_SETTINGS_ABOUT_ITEMS = new Map([
    [
        "documentation",
        {
            subheader: "Documentation",
            links: [
                {
                    title: "Check out our documentation",
                    url: LICHTBLICK_DOCUMENTATION_LINK,
                },
            ],
        },
    ],
    [
        "legal",
        {
            subheader: "Legal",
            links: [
                {
                    title: "License terms",
                    url: "https://github.com/lichtblick-suite/lichtblick/blob/main/LICENSE",
                },
            ],
        },
    ],
]);

import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useCallback } from "react";
import { useShallowMemo } from "@lichtblick/hooks";
import ExtensionMarketplaceContext from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
/**
 * 拡張機能マーケットプレイスのJSON APIエンドポイント
 * GitHubリポジトリから拡張機能の一覧を取得します
 */
const MARKETPLACE_URL = "https://raw.githubusercontent.com/foxglove/studio-extension-marketplace/main/extensions.json";
/**
 * ExtensionMarketplaceProvider
 *
 * 拡張機能マーケットプレイスの管理を行うProviderコンポーネントです。
 * 利用可能な拡張機能の情報取得とマークダウンコンテンツの取得機能を提供します。
 *
 * ## 主な機能
 * - マーケットプレイスからの拡張機能一覧取得
 * - 拡張機能の詳細情報（README等）の取得
 * - 外部APIとの通信管理
 * - キャッシュ機能による効率的なデータ取得
 *
 * ## 使用場面
 * - 拡張機能ストアの表示
 * - 拡張機能の詳細情報表示
 * - 新しい拡張機能の発見
 * - 拡張機能のメタデータ管理
 *
 * ## データソース
 * - GitHub上の公式マーケットプレイスリポジトリ
 * - 各拡張機能のREADMEファイル
 * - 拡張機能のメタデータ（バージョン、説明等）
 *
 * ## エラーハンドリング
 * - ネットワークエラーの処理
 * - 不正なJSONレスポンスの処理
 * - マークダウンファイルの取得エラー処理
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <ExtensionMarketplaceProvider>
 *   <ExtensionStore />
 *   <ExtensionDetails />
 * </ExtensionMarketplaceProvider>
 *
 * // 子コンポーネントでの使用
 * const marketplace = useContext(ExtensionMarketplaceContext);
 *
 * // 拡張機能一覧を取得
 * const extensions = await marketplace.getAvailableExtensions();
 *
 * // READMEを取得
 * const readme = await marketplace.getMarkdown(
 *   'https://raw.githubusercontent.com/example/extension/README.md'
 * );
 * ```
 */
export default function ExtensionMarketplaceProvider({ children, }) {
    /**
     * 利用可能な拡張機能の一覧を取得する
     * @returns Promise<ExtensionMarketplaceDetail[]> 拡張機能の詳細情報配列
     */
    const getAvailableExtensions = useCallback(async () => {
        const res = await fetch(MARKETPLACE_URL);
        return (await res.json());
    }, []);
    /**
     * 指定されたURLからマークダウンコンテンツを取得する
     * @param url - マークダウンファイルのURL
     * @returns Promise<string> マークダウンの文字列コンテンツ
     */
    const getMarkdown = useCallback(async (url) => {
        const res = await fetch(url);
        return await res.text();
    }, []);
    // 浅い比較でメモ化してパフォーマンスを最適化
    const marketplace = useShallowMemo({
        getAvailableExtensions,
        getMarkdown,
    });
    return (_jsx(ExtensionMarketplaceContext.Provider, { value: marketplace, children: children }));
}

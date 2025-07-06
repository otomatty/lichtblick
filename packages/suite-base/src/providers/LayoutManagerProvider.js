import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useEffect, useMemo } from "react";
import { useNetworkState } from "react-use";
import { useVisibilityState } from "@lichtblick/hooks";
import Logger from "@lichtblick/log";
import LayoutManagerContext from "@lichtblick/suite-base/context/LayoutManagerContext";
import { useLayoutStorage } from "@lichtblick/suite-base/context/LayoutStorageContext";
import { useRemoteLayoutStorage } from "@lichtblick/suite-base/context/RemoteLayoutStorageContext";
import LayoutManager from "@lichtblick/suite-base/services/LayoutManager/LayoutManager";
import delay from "@lichtblick/suite-base/util/delay";
const log = Logger.getLogger(__filename);
/** 同期間隔のベース値（ミリ秒） */
const SYNC_INTERVAL_BASE_MS = 30000;
/** 同期間隔の最大値（ミリ秒） */
const SYNC_INTERVAL_MAX_MS = 3 * 60000;
/**
 * LayoutManagerProvider
 *
 * レイアウト管理システムを提供するProviderコンポーネントです。
 * ローカルとリモートのレイアウトストレージを統合し、自動同期機能を提供します。
 *
 * ## 主な機能
 * - ローカルレイアウトストレージの管理
 * - リモートレイアウトストレージとの同期
 * - ネットワーク状態に応じた自動同期制御
 * - アプリケーション可視性に基づく同期最適化
 * - 指数バックオフによる堅牢な同期リトライ
 *
 * ## 同期戦略
 * - オンライン状態でのみ同期を実行
 * - アプリケーションが可視状態の時のみ同期
 * - 同期失敗時は指数バックオフでリトライ
 * - ジッターによる同期タイミングの分散
 *
 * ## 使用場面
 * - レイアウトの保存・読み込み
 * - マルチデバイス間でのレイアウト共有
 * - オフライン/オンライン状態の管理
 * - レイアウトの競合解決
 *
 * ## パフォーマンス最適化
 * - アプリケーションが非表示の時は同期を停止
 * - ネットワーク状態の監視による効率的な同期
 * - 指数バックオフによるサーバー負荷軽減
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <LayoutManagerProvider>
 *   <LayoutEditor />
 *   <LayoutSidebar />
 * </LayoutManagerProvider>
 *
 * // 子コンポーネントでの使用
 * const layoutManager = useContext(LayoutManagerContext);
 *
 * // レイアウトを保存
 * await layoutManager.saveLayout(layout);
 *
 * // レイアウトを読み込み
 * const layout = await layoutManager.loadLayout(layoutId);
 *
 * // 手動同期
 * await layoutManager.syncWithRemote();
 * ```
 */
export default function LayoutManagerProvider({ children, }) {
    // ローカルレイアウトストレージの取得
    const layoutStorage = useLayoutStorage();
    // リモートレイアウトストレージの取得
    const remoteLayoutStorage = useRemoteLayoutStorage();
    // LayoutManagerインスタンスの作成（ローカルとリモートストレージを統合）
    const layoutManager = useMemo(() => new LayoutManager({ local: layoutStorage, remote: remoteLayoutStorage }), [layoutStorage, remoteLayoutStorage]);
    // ネットワーク状態の監視
    const { online = false } = useNetworkState();
    // アプリケーションの可視性状態の監視
    const visibilityState = useVisibilityState();
    // オンライン状態の変更をLayoutManagerに通知
    useEffect(() => {
        layoutManager.setOnline(online);
    }, [layoutManager, online]);
    // 同期条件: ログイン済み、オンライン、アプリケーションが可視状態
    const enableSyncing = remoteLayoutStorage != undefined && online && visibilityState === "visible";
    // 定期的な同期処理
    useEffect(() => {
        if (!enableSyncing) {
            return;
        }
        const controller = new AbortController();
        void (async () => {
            let failures = 0;
            while (!controller.signal.aborted) {
                try {
                    // リモートとの同期を実行
                    await layoutManager.syncWithRemote(controller.signal);
                    failures = 0; // 成功時は失敗カウンターをリセット
                }
                catch (error) {
                    log.error("Sync failed:", error);
                    failures++;
                }
                // 指数バックオフとジッターによる同期間隔の計算
                // https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
                const duration = Math.random() * Math.min(SYNC_INTERVAL_MAX_MS, SYNC_INTERVAL_BASE_MS * 2 ** failures);
                log.debug("Waiting", (duration / 1000).toFixed(2), "sec for next sync", { failures });
                await delay(duration);
            }
        })();
        return () => {
            log.debug("Canceling layout sync due to effect cleanup callback");
            controller.abort();
        };
    }, [enableSyncing, layoutManager]);
    return (_jsx(LayoutManagerContext.Provider, { value: layoutManager, children: children }));
}

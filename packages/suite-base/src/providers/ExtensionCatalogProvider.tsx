// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import * as _ from "lodash-es";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { StoreApi, createStore } from "zustand";

import Logger from "@lichtblick/log";
import { RegisterMessageConverterArgs } from "@lichtblick/suite";
import {
  ContributionPoints,
  ExtensionCatalog,
  ExtensionCatalogContext,
  InstallExtensionsResult,
} from "@lichtblick/suite-base/context/ExtensionCatalogContext";
import { buildContributionPoints } from "@lichtblick/suite-base/providers/helpers/buildContributionPoints";
import { ExtensionLoader } from "@lichtblick/suite-base/services/ExtensionLoader";
import { ExtensionInfo, ExtensionNamespace } from "@lichtblick/suite-base/types/Extensions";

const log = Logger.getLogger(__filename);

/** 拡張機能更新時の最大バッチサイズ */
const MAX_REFRESH_EXTENSIONS_BATCH = 1;
/** 拡張機能インストール時の最大バッチサイズ */
const MAX_INSTALL_EXTENSIONS_BATCH = 1;

/**
 * 拡張機能レジストリストアを作成する関数
 *
 * 拡張機能のライフサイクル管理（インストール、アンインストール、更新）を行う
 * Zustandストアを作成します。複数の拡張機能ローダーとモックメッセージコンバーターを
 * サポートし、拡張機能の統合管理を提供します。
 *
 * @param loaders - 拡張機能ローダーの配列
 * @param mockMessageConverters - テスト用のモックメッセージコンバーター
 * @returns ExtensionCatalogストア
 *
 * @example
 * ```typescript
 * const store = createExtensionRegistryStore(
 *   [desktopLoader, webLoader],
 *   mockConverters
 * );
 *
 * // 拡張機能をインストール
 * await store.getState().installExtensions('local', [extensionData]);
 *
 * // 拡張機能をアンインストール
 * await store.getState().uninstallExtension('local', 'extension-id');
 * ```
 */
function createExtensionRegistryStore(
  loaders: readonly ExtensionLoader[],
  mockMessageConverters: readonly RegisterMessageConverterArgs<unknown>[] | undefined,
): StoreApi<ExtensionCatalog> {
  return createStore((set, get) => {
    /**
     * 拡張機能がインストールされているかチェック
     * @param extensionId - 拡張機能ID
     * @returns インストール済みかどうか
     */
    const isExtensionInstalled = (extensionId: string) => {
      return get().loadedExtensions.has(extensionId);
    };

    /**
     * 拡張機能をインストール済みとしてマーク
     * @param extensionId - 拡張機能ID
     */
    const markExtensionAsInstalled = (extensionId: string) => {
      const updatedExtensions = new Set(get().loadedExtensions);
      updatedExtensions.add(extensionId);
      set({ loadedExtensions: updatedExtensions });
    };

    /**
     * 拡張機能のインストール済みマークを解除
     * @param extensionId - 拡張機能ID
     */
    const unMarkExtensionAsInstalled = (extensionId: string) => {
      const updatedExtensions = new Set(get().loadedExtensions);
      updatedExtensions.delete(extensionId);
      set({ loadedExtensions: updatedExtensions });
    };

    /**
     * 指定されたURLから拡張機能をダウンロード
     * @param url - ダウンロードURL
     * @returns 拡張機能のバイナリデータ
     */
    const downloadExtension = async (url: string) => {
      const res = await fetch(url);
      return new Uint8Array(await res.arrayBuffer());
    };

    /**
     * 拡張機能をバッチでインストール
     * @param namespace - 拡張機能の名前空間
     * @param data - インストールする拡張機能のバイナリデータ配列
     * @returns インストール結果の配列
     */
    const installExtensions = async (namespace: ExtensionNamespace, data: Uint8Array[]) => {
      const namespaceLoader = loaders.find((loader) => loader.namespace === namespace);
      if (namespaceLoader == undefined) {
        throw new Error(`No extension loader found for namespace ${namespace}`);
      }

      const results: InstallExtensionsResult[] = [];
      // バッチサイズに分割してインストール
      for (let i = 0; i < data.length; i += MAX_INSTALL_EXTENSIONS_BATCH) {
        const chunk = data.slice(i, i + MAX_INSTALL_EXTENSIONS_BATCH);
        const result = await promisesInBatch(chunk, namespaceLoader);
        results.push(...result);
      }
      return results;
    };

    /**
     * 拡張機能のバッチインストール処理
     * @param batch - インストールするバイナリデータのバッチ
     * @param loader - 使用する拡張機能ローダー
     * @returns インストール結果の配列
     */
    async function promisesInBatch(
      batch: Uint8Array[],
      loader: ExtensionLoader,
    ): Promise<InstallExtensionsResult[]> {
      return await Promise.all(
        batch.map(async (extensionData: Uint8Array) => {
          try {
            const info = await loader.installExtension(extensionData);
            const unwrappedExtensionSource = await loader.loadExtension(info.id);
            const contributionPoints = buildContributionPoints(info, unwrappedExtensionSource);

            get().mergeState(info, contributionPoints);
            get().markExtensionAsInstalled(info.id);
            return { success: true, info };
          } catch (error) {
            return { success: false, error };
          }
        }),
      );
    }

    /**
     * 拡張機能の状態をストアにマージ
     * @param info - 拡張機能情報
     * @param contributionPoints - 拡張機能の貢献ポイント
     */
    const mergeState = (
      info: ExtensionInfo,
      {
        messageConverters,
        panelSettings,
        panels,
        topicAliasFunctions,
        cameraModels,
      }: ContributionPoints,
    ) => {
      set((state) => ({
        installedExtensions: _.uniqBy([...(state.installedExtensions ?? []), info], "id"),
        installedPanels: { ...state.installedPanels, ...panels },
        installedMessageConverters: [...state.installedMessageConverters!, ...messageConverters],
        installedTopicAliasFunctions: [
          ...state.installedTopicAliasFunctions!,
          ...topicAliasFunctions,
        ],
        panelSettings: { ...state.panelSettings, ...panelSettings },
        installedCameraModels: new Map([
          ...state.installedCameraModels,
          ...Array.from(cameraModels.entries()),
        ]),
      }));
    };

    /**
     * バッチで拡張機能をロード
     * @param params - ロードパラメータ
     */
    async function loadInBatch({
      batch,
      loader,
      installedExtensions,
      contributionPoints,
    }: {
      batch: ExtensionInfo[];
      loader: ExtensionLoader;
      installedExtensions: ExtensionInfo[];
      contributionPoints: ContributionPoints;
    }) {
      await Promise.all(
        batch.map(async (extension) => {
          try {
            installedExtensions.push(extension);

            const { messageConverters, panelSettings, panels, topicAliasFunctions, cameraModels } =
              contributionPoints;
            const unwrappedExtensionSource = await loader.loadExtension(extension.id);
            const newContributionPoints = buildContributionPoints(
              extension,
              unwrappedExtensionSource,
            );

            // 貢献ポイントをマージ
            _.assign(panels, newContributionPoints.panels);
            _.merge(panelSettings, newContributionPoints.panelSettings);
            messageConverters.push(...newContributionPoints.messageConverters);
            topicAliasFunctions.push(...newContributionPoints.topicAliasFunctions);

            // カメラモデルの重複チェック
            newContributionPoints.cameraModels.forEach((builder, name: string) => {
              if (cameraModels.has(name)) {
                log.warn(`Camera model "${name}" already registered, skipping.`);
                return;
              }
              cameraModels.set(name, builder);
            });

            get().markExtensionAsInstalled(extension.id);
          } catch (err) {
            log.error(`Error loading extension ${extension.id}`, err);
          }
        }),
      );
    }

    /**
     * 全拡張機能を更新
     * 全てのローダーから拡張機能を取得し、ストアを更新します
     */
    const refreshAllExtensions = async () => {
      log.debug("Refreshing all extensions");
      if (loaders.length === 0) {
        return;
      }

      const start = performance.now();
      const installedExtensions: ExtensionInfo[] = [];
      const contributionPoints: ContributionPoints = {
        messageConverters: [],
        panels: {},
        panelSettings: {},
        topicAliasFunctions: [],
        cameraModels: new Map(),
      };

      /**
       * 個別ローダーを処理
       * @param loader - 処理する拡張機能ローダー
       */
      const processLoader = async (loader: ExtensionLoader) => {
        try {
          const extensions = await loader.getExtensions();
          const chunks = _.chunk(extensions, MAX_REFRESH_EXTENSIONS_BATCH);
          for (const chunk of chunks) {
            await loadInBatch({
              batch: chunk,
              contributionPoints,
              installedExtensions,
              loader,
            });
          }
        } catch (err: unknown) {
          log.error("Error loading extension list", err);
        }
      };
      await Promise.all(loaders.map(processLoader));

      log.info(
        `Loaded ${installedExtensions.length} extensions in ${(performance.now() - start).toFixed(1)}ms`,
      );

      // ストアを更新
      set({
        installedExtensions,
        installedPanels: contributionPoints.panels,
        installedMessageConverters: contributionPoints.messageConverters,
        installedTopicAliasFunctions: contributionPoints.topicAliasFunctions,
        installedCameraModels: contributionPoints.cameraModels,
        panelSettings: contributionPoints.panelSettings,
      });
    };

    /**
     * 拡張機能データを削除
     * @param params - 削除パラメータ
     * @returns 更新されたストア状態
     */
    function removeExtensionData({
      id, // deleted extension id
      state,
    }: {
      id: string;
      state: Pick<
        ExtensionCatalog,
        | "installedExtensions"
        | "installedPanels"
        | "installedMessageConverters"
        | "installedTopicAliasFunctions"
        | "installedCameraModels"
      >;
    }) {
      const {
        installedExtensions,
        installedPanels,
        installedMessageConverters,
        installedTopicAliasFunctions,
        installedCameraModels,
      } = state;

      return {
        installedExtensions: installedExtensions?.filter(
          ({ id: extensionId }) => extensionId !== id,
        ),
        installedPanels: _.pickBy(installedPanels, ({ extensionId }) => extensionId !== id),
        installedMessageConverters: installedMessageConverters?.filter(
          ({ extensionId }) => extensionId !== id,
        ),
        installedTopicAliasFunctions: installedTopicAliasFunctions?.filter(
          ({ extensionId }) => extensionId !== id,
        ),
        installedCameraModels: new Map(
          [...installedCameraModels].filter(([, { extensionId }]) => extensionId !== id),
        ),
      };
    }

    /**
     * 拡張機能をアンインストール
     * @param namespace - 拡張機能の名前空間
     * @param id - 拡張機能ID
     */
    const uninstallExtension = async (namespace: ExtensionNamespace, id: string) => {
      const namespaceLoader = loaders.find((loader) => loader.namespace === namespace);
      if (namespaceLoader == undefined) {
        throw new Error("No extension loader found for namespace " + namespace);
      }

      const extension = await namespaceLoader.getExtension(id);
      if (!extension) {
        return;
      }

      await namespaceLoader.uninstallExtension(extension.id);
      set((state) => removeExtensionData({ id: extension.id, state }));
      get().unMarkExtensionAsInstalled(id);
    };

    // ストアの初期状態を返す
    return {
      downloadExtension,
      installExtensions,
      isExtensionInstalled,
      markExtensionAsInstalled,
      mergeState,
      refreshAllExtensions,
      uninstallExtension,
      unMarkExtensionAsInstalled,
      installedExtensions: loaders.length === 0 ? [] : undefined,
      installedMessageConverters: mockMessageConverters ?? [],
      installedPanels: {},
      installedTopicAliasFunctions: [],
      installedCameraModels: new Map(),
      loadedExtensions: new Set<string>(),
      panelSettings: _.merge(
        {},
        ...(mockMessageConverters ?? []).map(({ fromSchemaName, panelSettings }) =>
          _.mapValues(panelSettings, (settings) => ({ [fromSchemaName]: settings })),
        ),
      ),
    };
  });
}

/**
 * ExtensionCatalogProvider
 *
 * 拡張機能カタログの管理を行うProviderコンポーネントです。
 * 複数の拡張機能ローダーを統合し、拡張機能のインストール・アンインストール・
 * 更新を管理します。アプリケーション全体で拡張機能の状態を共有します。
 *
 * ## 主な機能
 * - 拡張機能のライフサイクル管理（インストール、アンインストール、更新）
 * - 複数の拡張機能ローダーの統合管理
 * - 拡張機能の貢献ポイント（パネル、メッセージコンバーター等）の管理
 * - バッチ処理による効率的な拡張機能操作
 * - エラーハンドリングとロギング
 *
 * ## 使用場面
 * - 拡張機能ストアの管理
 * - カスタムパネルの動的ロード
 * - メッセージコンバーターの管理
 * - カメラモデルの登録・管理
 * - 拡張機能の設定管理
 *
 * ## アーキテクチャ
 * - Zustandストアによる状態管理
 * - 複数ローダーによる柔軟な拡張機能ソース対応
 * - 貢献ポイントシステムによる機能拡張
 * - バッチ処理による性能最適化
 *
 * ## 拡張機能ローダー
 * - ローカルファイルシステム
 * - リモートURL
 * - 開発用モック
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @param props.loaders - 拡張機能ローダーの配列
 * @param props.mockMessageConverters - テスト用のモックメッセージコンバーター
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * const loaders = [
 *   new LocalExtensionLoader(),
 *   new RemoteExtensionLoader()
 * ];
 *
 * <ExtensionCatalogProvider loaders={loaders}>
 *   <ExtensionManager />
 *   <PanelCatalog />
 * </ExtensionCatalogProvider>
 *
 * // 子コンポーネントでの使用
 * const catalog = useContext(ExtensionCatalogContext);
 * const installedExtensions = catalog.getState().installedExtensions;
 *
 * // 拡張機能をインストール
 * await catalog.getState().installExtensions('local', [extensionData]);
 * ```
 */
export default function ExtensionCatalogProvider({
  children,
  loaders,
  mockMessageConverters,
}: PropsWithChildren<{
  loaders: readonly ExtensionLoader[];
  mockMessageConverters?: readonly RegisterMessageConverterArgs<unknown>[];
}>): React.JSX.Element {
  const [store] = useState(createExtensionRegistryStore(loaders, mockMessageConverters));

  // 初回マウント時に拡張機能の初期更新を実行
  const refreshAllExtensions = store.getState().refreshAllExtensions;
  useEffect(() => {
    refreshAllExtensions().catch((err: unknown) => {
      log.error(err);
    });
  }, [refreshAllExtensions]);

  return (
    <ExtensionCatalogContext.Provider value={store}>{children}</ExtensionCatalogContext.Provider>
  );
}

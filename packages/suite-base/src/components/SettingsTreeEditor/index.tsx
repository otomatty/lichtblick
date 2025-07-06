// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, TextField } from "@mui/material";
import memoizeWeak from "memoize-weak";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Immutable, SettingsTree, SettingsTreeAction, SettingsTreeField } from "@lichtblick/suite";
import { useConfigById } from "@lichtblick/suite-base/PanelAPI";
import { FieldEditor } from "@lichtblick/suite-base/components/SettingsTreeEditor/FieldEditor";
import { useStyles } from "@lichtblick/suite-base/components/SettingsTreeEditor/SettingsTreeEditor.style";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useSelectedPanels } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { usePanelCatalog } from "@lichtblick/suite-base/context/PanelCatalogContext";
import { usePanelStateStore } from "@lichtblick/suite-base/context/PanelStateContext";
import { PANEL_TITLE_CONFIG_KEY, getPanelTypeFromId } from "@lichtblick/suite-base/util/layout";

import { NodeEditor } from "./NodeEditor";
import { filterTreeNodes, prepareSettingsNodes } from "./utils";

/**
 * @fileoverview SettingsTreeEditor - 階層構造設定エディターシステム
 *
 * このコンポーネントは、Lichtblickアプリケーションの設定画面で使用される
 * 階層構造を持つ設定項目のエディターシステムです。
 *
 * 主な機能：
 * - 階層構造を持つ設定項目の表示・編集
 * - 検索・フィルタリング機能
 * - パネルタイトルの動的編集
 * - 様々な入力タイプのサポート（文字列、数値、色、ベクトル等）
 * - 展開/折りたたみ制御
 * - リアルタイム設定反映
 *
 * 使用場面：
 * - パネル設定画面
 * - ログ設定画面
 * - 拡張機能設定
 * - アプリケーション設定
 *
 * アーキテクチャ：
 * - SettingsTreeEditor（メイン）
 * - NodeEditor（ノード編集）
 * - FieldEditor（フィールド編集）
 * - inputs/*（各種入力コンポーネント）
 */

// パフォーマンス最適化：安定したパス配列を生成するためのメモ化関数
// 同じキーに対して常に同じ配列インスタンスを返すことで、不要な再レンダリングを防止
const makeStablePath = memoizeWeak((key: string) => [key]);

/**
 * 設定ツリーエディターのメインコンポーネント
 *
 * 階層構造を持つ設定項目を表示・編集するためのインターフェースを提供します。
 * パネル設定やログ設定など、様々な設定画面で使用されます。
 *
 * @param props - コンポーネントプロパティ
 * @param props.variant - エディターの表示バリアント（"panel" | "log"）
 * @param props.settings - 設定ツリーデータ（Immutable）
 * @returns {React.JSX.Element} 設定ツリーエディターのJSX要素
 *
 * @example
 * ```tsx
 * // パネル設定での使用例
 * <SettingsTreeEditor
 *   variant="panel"
 *   settings={{
 *     nodes: panelSettingsNodes,
 *     actionHandler: handleSettingsAction,
 *     enableFilter: true,
 *     focusedPath: currentFocusedPath
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // ログ設定での使用例
 * <SettingsTreeEditor
 *   variant="log"
 *   settings={{
 *     nodes: logSettingsNodes,
 *     actionHandler: handleLogAction,
 *     enableFilter: false
 *   }}
 * />
 * ```
 */
export default function SettingsTreeEditor({
  variant,
  settings,
}: {
  variant: "panel" | "log";
  settings: Immutable<SettingsTree>;
}): React.JSX.Element {
  const { classes } = useStyles();
  const { actionHandler, focusedPath } = settings;

  // 検索フィルターのローカル状態管理
  const [filterText, setFilterText] = useState<string>("");
  const { t } = useTranslation("settingsEditor");

  // フィルタリング処理：検索テキストに基づいて設定ノードを絞り込み
  // パフォーマンス最適化のためuseMemoを使用
  const filteredNodes = useMemo(() => {
    if (filterText.length > 0) {
      // 検索テキストが入力されている場合、マッチする項目のみを表示
      return filterTreeNodes(settings.nodes, filterText);
    }
    // 検索テキストが空の場合、全ての項目を表示
    return settings.nodes;
  }, [settings.nodes, filterText]);

  // レンダリング用のノードデータ準備
  // 各ノードにレンダリングに必要なプロパティを付与
  const memoizedNodes = useMemo(() => {
    const preparedNodes = prepareSettingsNodes(filteredNodes);
    return preparedNodes.map(([key, root]) => ({
      key,
      actionHandler, // 設定変更時のアクションハンドラー
      defaultOpen: root.defaultExpansionState !== "collapsed", // デフォルトの展開状態
      filter: filterText, // 検索テキスト（ハイライト用）
      focusedPath, // フォーカスされているパス
      path: makeStablePath(key), // 安定したパス配列
      settings: root, // ノードの設定データ
    }));
  }, [filteredNodes, actionHandler, filterText, focusedPath]);

  // パネル関連の状態管理
  // 現在選択されているパネルの情報を取得し、タイトル編集機能を提供
  const { selectedPanelIds } = useSelectedPanels();
  const selectedPanelId = useMemo(
    () => (selectedPanelIds.length === 1 ? selectedPanelIds[0] : undefined),
    [selectedPanelIds],
  );

  // パネルカタログから選択されたパネルの情報を取得
  const panelCatalog = usePanelCatalog();
  const panelType = useMemo(
    () => (selectedPanelId != undefined ? getPanelTypeFromId(selectedPanelId) : undefined),
    [selectedPanelId],
  );
  const panelInfo = useMemo(
    () => (panelType != undefined ? panelCatalog.getPanelByType(panelType) : undefined),
    [panelCatalog, panelType],
  );

  // パネル設定の取得と保存
  const [config, saveConfig] = useConfigById(selectedPanelId);

  // パネルタイトルの管理
  const defaultPanelTitle = usePanelStateStore((state) =>
    selectedPanelId ? state.defaultTitles[selectedPanelId] : undefined,
  );
  const customPanelTitle =
    typeof config?.[PANEL_TITLE_CONFIG_KEY] === "string"
      ? config[PANEL_TITLE_CONFIG_KEY]
      : undefined;

  // パネルタイトル編集用のフィールド定義
  const panelTitleField = useMemo<SettingsTreeField>(
    () => ({
      input: "string", // 文字列入力
      label: t("title"), // 国際化対応のラベル
      placeholder: defaultPanelTitle ?? panelInfo?.title, // プレースホルダー
      value: customPanelTitle, // 現在のカスタムタイトル
    }),
    [customPanelTitle, defaultPanelTitle, panelInfo?.title, t],
  );

  // パネルタイトル変更時のハンドラー
  const handleTitleChange = useCallback(
    (action: SettingsTreeAction) => {
      if (action.action === "update" && action.payload.path[0] === PANEL_TITLE_CONFIG_KEY) {
        // パネルタイトルの更新を設定に保存
        saveConfig({ [PANEL_TITLE_CONFIG_KEY]: action.payload.value });
      }
    },
    [saveConfig],
  );

  // タイトルフィールドの表示条件
  // - フィルターが適用されていない
  // - カスタムツールバーを持たないパネル
  // - ログ設定画面ではない
  const showTitleField =
    filterText.length === 0 && panelInfo?.hasCustomToolbar !== true && variant !== "log";

  // 検索フィルターの変更ハンドラー
  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  }, []);

  return (
    <Stack fullHeight>
      {/* 検索フィルター */}
      {settings.enableFilter === true && (
        <header className={classes.appBar}>
          <TextField
            id={`${variant}-settings-filter`}
            variant="filled"
            onChange={handleFilterChange}
            value={filterText}
            className={classes.textField}
            fullWidth
            placeholder={t("searchPanelSettings")}
            inputProps={{
              "data-testid": `${variant}-settings-filter-input`,
            }}
            InputProps={{
              size: "small",
              startAdornment: (
                <label className={classes.startAdornment} htmlFor="settings-filter">
                  <SearchIcon fontSize="small" />
                </label>
              ),
              endAdornment: filterText && (
                <IconButton
                  size="small"
                  title={t("clearSearch")}
                  onClick={() => {
                    setFilterText("");
                  }}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </header>
      )}

      {/* 設定項目のグリッド表示 */}
      <div className={classes.fieldGrid}>
        {/* パネルタイトル編集フィールド */}
        {showTitleField && (
          <>
            <Stack paddingBottom={0.5} style={{ gridColumn: "span 2" }} />
            <FieldEditor
              field={panelTitleField}
              path={[PANEL_TITLE_CONFIG_KEY]}
              actionHandler={handleTitleChange}
            />
          </>
        )}

        {/* 設定ノードの表示 */}
        {memoizedNodes.map((nodeProps) => (
          <NodeEditor {...nodeProps} key={nodeProps.key} />
        ))}
      </div>
    </Stack>
  );
}

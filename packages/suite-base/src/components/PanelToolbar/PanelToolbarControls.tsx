// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import SettingsIcon from "@mui/icons-material/Settings";
import { forwardRef, useCallback, useContext, useMemo } from "react";

import PanelContext from "@lichtblick/suite-base/components/PanelContext";
import ToolbarIconButton from "@lichtblick/suite-base/components/PanelToolbar/ToolbarIconButton";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useSelectedPanels } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import PanelCatalogContext from "@lichtblick/suite-base/context/PanelCatalogContext";
import {
  PanelStateStore,
  usePanelStateStore,
} from "@lichtblick/suite-base/context/PanelStateContext";
import { useWorkspaceActions } from "@lichtblick/suite-base/context/Workspace/useWorkspaceActions";

import { PanelActionsDropdown } from "./PanelActionsDropdown";

/**
 * PanelToolbarControlsコンポーネントのプロパティ
 */
type PanelToolbarControlsProps = {
  /** 追加のアイコンボタン要素 */
  additionalIcons?: React.ReactNode;
  /** 未知のパネルタイプかどうか */
  isUnknownPanel: boolean;
};

/**
 * **PanelToolbarControls** - パネルツールバーコントロール群
 *
 * パネルツールバーの右側に配置される制御要素群を管理するコンポーネント。
 * 設定ボタン、追加アイコン、アクションドロップダウンを含みます。
 *
 * @features
 * - **設定ボタン**: パネル設定画面へのアクセス
 * - **追加アイコン**: カスタムアイコンボタンの配置
 * - **アクションドロップダウン**: パネル操作メニュー
 * - **forwardRef対応**: 親コンポーネントからのref転送
 * - **パフォーマンス最適化**: React.memoによる再レンダリング制御
 *
 * @architecture
 * - **Context統合**: パネル状態、カタログ、ワークスペースへのアクセス
 * - **条件付きレンダリング**: パネルタイプに応じた表示制御
 * - **Stack Layout**: 横方向の整列レイアウト
 *
 * @conditional_rendering
 * - **設定ボタン**: パネルに設定がある場合、またはカスタムツールバーでない場合に表示
 * - **追加アイコン**: propsで指定された場合のみ表示
 * - **アクションドロップダウン**: 常に表示
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <PanelToolbarControls isUnknownPanel={false} />
 *
 * // 追加アイコンを含む使用方法
 * <PanelToolbarControls
 *   additionalIcons={<CustomIcon />}
 *   isUnknownPanel={false}
 * />
 * ```
 *
 * @param props - コンポーネントのプロパティ
 * @param ref - DOM要素への参照
 * @returns JSX.Element - レンダリングされたコントロール群
 */
const PanelToolbarControlsComponent = forwardRef<HTMLDivElement, PanelToolbarControlsProps>(
  (props, ref) => {
    const { additionalIcons, isUnknownPanel } = props;
    const { id: panelId, type: panelType } = useContext(PanelContext) ?? {};
    const panelCatalog = useContext(PanelCatalogContext);
    const { setSelectedPanelIds } = useSelectedPanels();
    const { openPanelSettings } = useWorkspaceActions();

    /**
     * パネルに設定が存在するかどうかを判定するセレクター
     * @param store - パネル状態ストア
     * @returns パネルに設定が存在するかどうか
     */
    const hasSettingsSelector = useCallback(
      (store: PanelStateStore) => (panelId ? store.settingsTrees[panelId] != undefined : false),
      [panelId],
    );

    /**
     * パネル情報の取得
     * パネルタイプに基づいてカタログから情報を取得
     */
    const panelInfo = useMemo(
      () => (panelType != undefined ? panelCatalog.getPanelByType(panelType) : undefined),
      [panelCatalog, panelType],
    );

    const hasSettings = usePanelStateStore(hasSettingsSelector);

    /**
     * 設定画面を開く処理
     * パネルを選択して設定画面を表示
     */
    const openSettings = useCallback(async () => {
      if (panelId) {
        setSelectedPanelIds([panelId]);
        openPanelSettings();
      }
    }, [panelId, setSelectedPanelIds, openPanelSettings]);

    // Show the settings button so that panel title is editable, unless we have a custom
    // toolbar in which case the title wouldn't be visible.
    const showSettingsButton = panelInfo?.hasCustomToolbar !== true || hasSettings;

    return (
      <Stack direction="row" alignItems="center" paddingLeft={1} ref={ref}>
        {additionalIcons}
        {showSettingsButton && (
          <ToolbarIconButton title="Settings" onClick={openSettings}>
            <SettingsIcon />
          </ToolbarIconButton>
        )}
        <PanelActionsDropdown isUnknownPanel={isUnknownPanel} />
      </Stack>
    );
  },
);

PanelToolbarControlsComponent.displayName = "PanelToolbarControls";

/**
 * パフォーマンス最適化されたPanelToolbarControlsコンポーネント
 *
 * React.memoでラップされており、propsが変更されない限り再レンダリングを防止します。
 * これにより、PanelToolbar全体の再レンダリングを避けることができます。
 *
 * @performance
 * - **再レンダリング制御**: propsの変更時のみ再レンダリング
 * - **子コンポーネントの安定性**: 頻繁な変更から隔離
 * - **メモリ効率**: 不要なレンダリングサイクルを削減
 */
export const PanelToolbarControls = React.memo(PanelToolbarControlsComponent);

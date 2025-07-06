// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * @fileoverview PanelContextMenu - パネル用右クリックコンテキストメニューコンポーネント
 *
 * このファイルは、パネル内で右クリック時に表示されるコンテキストメニューを実装している。
 * パネルに対する各種操作（分割、削除、設定変更等）を提供する重要なUIコンポーネント。
 *
 * ## 主要機能
 *
 * ### 1. 右クリック検出システム
 * - マウスダウン→マウスアップの正確な検出
 * - マウス移動によるキャンセル機能
 * - 誤操作防止のための厳密な状態管理
 * - ブラウザデフォルトのコンテキストメニュー無効化
 *
 * ### 2. 動的メニュー生成
 * - getItems関数による動的メニュー項目生成
 * - 実行時のメニュー状態評価
 * - 条件付きメニュー項目の表示/非表示
 * - 無効化状態の適切な表示
 *
 * ### 3. 位置計算とレンダリング
 * - クリック位置でのメニュー表示
 * - 画面端での自動位置調整
 * - Material-UIのMenu/MenuItemとの統合
 * - 密度の高いメニュー表示
 *
 * ## アーキテクチャ設計
 *
 * ```
 * PanelContextMenu
 * ├── マウスイベント検出
 * │   ├── mousedown (右クリック開始)
 * │   ├── mousemove (ドラッグ検出)
 * │   ├── mouseup (右クリック完了)
 * │   └── contextmenu (デフォルト無効化)
 * ├── 状態管理
 * │   ├── rightClickState (クリック状態)
 * │   ├── position (メニュー表示位置)
 * │   └── items (メニュー項目)
 * └── UI レンダリング
 *     ├── MUI Menu (メニューコンテナ)
 *     ├── MenuItem (各メニュー項目)
 *     └── Divider (区切り線)
 * ```
 *
 * ## 技術的特徴
 *
 * - **イベント制御**: 正確な右クリック検出とドラッグキャンセル
 * - **動的生成**: 実行時のメニュー項目評価
 * - **位置制御**: クリック位置でのメニュー表示
 * - **パフォーマンス**: React.memoによる最適化
 * - **型安全性**: TypeScriptによる厳密な型定義
 *
 * ## 使用例
 *
 * ```typescript
 * // パネル内でのコンテキストメニュー追加
 * function MyPanel() {
 *   const getMenuItems = useCallback(() => [
 *     { type: "item", label: "Refresh", onclick: handleRefresh },
 *     { type: "divider" },
 *     { type: "item", label: "Settings", onclick: handleSettings },
 *   ], [handleRefresh, handleSettings]);
 *
 *   return (
 *     <PanelContextMenu getItems={getMenuItems} />
 *   );
 * }
 * ```
 *
 * @author Lichtblick Team
 * @since 2023
 */

import { Divider, Menu, MenuItem } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import { Immutable } from "@lichtblick/suite";
import { PANEL_ROOT_CLASS_NAME } from "@lichtblick/suite-base/components/PanelRoot";

/**
 * コンテキストメニューアイテムの型定義
 *
 * メニューに表示される項目は、クリック可能なアイテムまたは
 * 区切り線のいずれかの種類を持つ。
 */
export type PanelContextMenuItem =
  | {
      /** クリック可能なメニュー項目の種類 */
      type: "item";

      /** 項目が無効化されているかどうか（表示されるが操作不可） */
      disabled?: boolean;

      /** メニュー項目に表示されるラベルテキスト */
      label: string;

      /** メニュー項目がクリックされた時のコールバック関数 */
      onclick: () => void;
    }
  | {
      /** 区切り線の種類 */
      type: "divider";
    };

/**
 * PanelContextMenuコンポーネントのプロパティ型定義
 */
type PanelContextMenuProps = {
  /** メニュー項目の配列を返す関数（実行時に動的に評価される） */
  getItems: () => Immutable<PanelContextMenuItem[]>;
};

/**
 * パネル用コンテキストメニューコンポーネント
 *
 * パネル内で右クリック時に表示されるコンテキストメニューを実装する。
 * Panel HOCの子コンポーネントとして使用される必要がある。
 *
 * ## 主要機能
 *
 * ### 右クリック検出
 * - マウスダウン→アップの正確な検出
 * - マウス移動によるドラッグキャンセル
 * - 誤操作防止のための状態管理
 *
 * ### メニュー表示
 * - クリック位置でのメニュー表示
 * - 動的メニュー項目生成
 * - Material-UIとの統合
 *
 * ### イベント制御
 * - デフォルトコンテキストメニューの無効化
 * - 親パネルへのイベント伝播制御
 * - 適切なクリーンアップ処理
 *
 * ## 実装詳細
 *
 * ### 右クリック状態管理
 * ```
 * "none" → "down" → "none" (正常な右クリック)
 *       ↘ "canceled" (ドラッグ検出時)
 * ```
 *
 * ### イベントフロー
 * 1. mousedown: 右クリック開始検出
 * 2. mousemove: ドラッグ検出でキャンセル
 * 3. mouseup: 右クリック完了でメニュー表示
 * 4. contextmenu: デフォルト動作の無効化
 *
 * @param props - コンポーネントプロパティ
 * @returns レンダリングされたコンテキストメニュー
 */
function PanelContextMenuComponent(props: PanelContextMenuProps): React.JSX.Element {
  const { getItems } = props;

  /** コンポーネントルート要素への参照 */
  const rootRef = useRef<HTMLDivElement>(ReactNull);

  /** メニュー表示位置の状態（undefinedの場合は非表示） */
  const [position, setPosition] = useState<undefined | { x: number; y: number }>();

  /**
   * メニューを閉じる関数
   *
   * メニューの表示位置をundefinedに設定することで
   * メニューを非表示にする。
   */
  const handleClose = useCallback(() => {
    setPosition(undefined);
  }, []);

  /** 現在のメニュー項目の状態 */
  const [items, setItems] = useState<Immutable<PanelContextMenuItem[]>>([]);

  /**
   * マウスイベントリスナーの設定と右クリック検出
   *
   * 親パネル要素にマウスイベントリスナーを設定し、
   * 右クリックの正確な検出を行う。ドラッグ操作との
   * 区別のため、マウス移動を検出した場合はキャンセルする。
   */
  useEffect(() => {
    const parent = rootRef.current?.closest<HTMLElement>(`.${PANEL_ROOT_CLASS_NAME}`);
    if (!parent) {
      return;
    }

    /**
     * 右クリック状態の管理
     * - "none": 何も押されていない状態
     * - "down": 右ボタンが押されている状態
     * - "canceled": ドラッグ操作が検出された状態
     */
    let rightClickState: "none" | "down" | "canceled" = "none";

    /**
     * マウスアップイベントハンドラー
     *
     * 右クリックボタンが離された時に、状態が"down"の場合のみ
     * メニューを表示する。これにより、ドラッグ操作との区別が可能。
     *
     * @param event - マウスイベント
     */
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 2 && rightClickState === "down") {
        // メニュー表示位置を設定
        setPosition({ x: event.clientX, y: event.clientY });
        // メニュー項目を動的に生成
        setItems(getItems());
        // 状態をリセット
        rightClickState = "none";
      }
    };

    /**
     * マウス移動イベントハンドラー
     *
     * マウスが移動した場合、ドラッグ操作と判断して
     * 右クリック状態をキャンセルする。
     *
     * @param _event - マウスイベント（未使用）
     */
    const handleMouseMove = (_event: MouseEvent) => {
      rightClickState = "canceled";
    };

    /**
     * マウスダウンイベントハンドラー
     *
     * 右クリックボタンが押された時に状態を"down"に設定する。
     *
     * @param event - マウスイベント
     */
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        rightClickState = "down";
      }
    };

    /**
     * コンテキストメニューイベントハンドラー
     *
     * ブラウザのデフォルトコンテキストメニューを無効化する。
     * これにより、カスタムメニューのみが表示される。
     *
     * @param event - コンテキストメニューイベント
     */
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // イベントリスナーの登録
    parent.addEventListener("mousedown", handleMouseDown);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseup", handleMouseUp);
    parent.addEventListener("contextmenu", handleContextMenu);

    // クリーンアップ関数
    return () => {
      parent.removeEventListener("mousedown", handleMouseDown);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseup", handleMouseUp);
      parent.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [getItems]);

  return (
    <div
      ref={rootRef}
      onContextMenu={(event) => {
        // React側でもコンテキストメニューを無効化
        event.preventDefault();
      }}
    >
      {/* Material-UIのMenuコンポーネント */}
      <Menu
        open={position != undefined}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={position ? { top: position.y, left: position.x } : undefined}
        MenuListProps={{
          dense: true, // 密度の高いメニュー表示
        }}
      >
        {items.map((item, index) => {
          // 区切り線の場合
          if (item.type === "divider") {
            return <Divider variant="middle" key={`divider_${index}`} />;
          }

          // メニュー項目の場合
          return (
            <MenuItem
              onClick={() => {
                // メニューを閉じてからアクションを実行
                handleClose();
                item.onclick();
              }}
              key={`item_${index}_${item.label}`}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

/**
 * React.memoでラップされたPanelContextMenuコンポーネント
 *
 * getItems関数の参照が変わらない限り、不要な再レンダリングを防ぐ。
 * パフォーマンス最適化のため、メモ化を適用している。
 */
export const PanelContextMenu = React.memo(PanelContextMenuComponent);

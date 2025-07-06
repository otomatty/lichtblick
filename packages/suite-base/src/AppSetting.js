// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
/**
 * @fileoverview アプリケーション設定のキー定義
 *
 * 【主な役割】
 * - アプリケーション全体で使用される設定項目のキーを一元管理
 * - 設定値の型安全なアクセスを提供
 * - 設定項目の分類と整理
 *
 * 【使用箇所】
 * - AppSettingsDialog: 設定画面での設定項目表示・編集
 * - useAppConfigurationValue: 設定値の取得・更新フック
 * - ExperimentalFeatureSettings: 実験的機能の設定管理
 * - LaunchPreference: アプリケーション起動設定
 * - 各種コンポーネント: 設定値に基づく動作制御
 *
 * 【設定の分類】
 * - General: 一般的なユーザー設定（テーマ、言語など）
 * - ROS: ROS関連の設定
 * - Privacy: プライバシー・テレメトリ設定
 * - Experimental: 実験的機能の有効/無効
 * - Miscellaneous: その他の設定
 * - Dev only: 開発者向け設定
 *
 * 【特徴】
 * - 文字列enumで設定キーを定義
 * - カテゴリ別に設定を整理
 * - 実際の保存キー名を値として持つ
 * - TypeScriptの型安全性を提供
 */
/**
 * アプリケーション設定のキー定義
 *
 * 各設定項目は文字列値として定義され、実際の設定ストレージ（LocalStorage等）
 * でのキー名として使用される
 *
 * 【設定値の型】
 * - string: 文字列設定（言語、タイムゾーンなど）
 * - boolean: ON/OFF設定（機能の有効/無効など）
 * - number: 数値設定（メッセージレートなど）
 *
 * 【設定の永続化】
 * - Web版: LocalStorage
 * - Desktop版: Electronの設定ファイル
 */
export var AppSetting;
(function (AppSetting) {
    // === 一般設定 ===
    /**
     * カラースキーム設定
     * 値: "light" | "dark" | "system"
     * デフォルト: "system"
     */
    AppSetting["COLOR_SCHEME"] = "colorScheme";
    /**
     * タイムゾーン設定
     * 値: IANA timezone名 | undefined（システム検出）
     * 例: "UTC", "America/New_York", "Asia/Tokyo"
     */
    AppSetting["TIMEZONE"] = "timezone";
    /**
     * 時刻表示形式
     * 値: "SEC" | "TOD"（秒 | 時刻）
     */
    AppSetting["TIME_FORMAT"] = "time.format";
    /**
     * メッセージ更新レート（Hz）
     * 値: number（1-60）
     * デフォルト: 60
     */
    AppSetting["MESSAGE_RATE"] = "messageRate";
    /**
     * 自動更新機能の有効/無効（デスクトップ版のみ）
     * 値: boolean
     * デフォルト: true
     */
    AppSetting["UPDATES_ENABLED"] = "updates.enabled";
    /**
     * UI言語設定
     * 値: "en" | "ja" | その他のサポート言語
     * デフォルト: "en"
     */
    AppSetting["LANGUAGE"] = "language";
    // === ROS関連設定 ===
    /**
     * ROS_PACKAGE_PATH環境変数（デスクトップ版のみ）
     * 値: string（パスのコロン区切りリスト）
     */
    AppSetting["ROS_PACKAGE_PATH"] = "ros.ros_package_path";
    /**
     * 新しいトップナビゲーションの有効化
     * 値: boolean
     * 注意: 廃止予定の設定項目
     */
    AppSetting["ENABLE_NEW_TOPNAV"] = "enableNewTopNav";
    // === プライバシー設定 ===
    /**
     * テレメトリデータ送信の有効/無効
     * 値: boolean
     * デフォルト: false（明示的な同意が必要）
     */
    AppSetting["TELEMETRY_ENABLED"] = "telemetry.telemetryEnabled";
    /**
     * クラッシュレポート送信の有効/無効
     * 値: boolean
     * デフォルト: false（明示的な同意が必要）
     */
    AppSetting["CRASH_REPORTING_ENABLED"] = "telemetry.crashReportingEnabled";
    // === 実験的機能 ===
    /**
     * デバッグパネルの表示
     * 値: boolean
     * デフォルト: false
     */
    AppSetting["SHOW_DEBUG_PANELS"] = "showDebugPanels";
    /**
     * Lichtblickインスタンス間の同期機能
     * 値: boolean
     * デフォルト: false
     */
    AppSetting["SHOW_SYNC_LB_INSTANCES"] = "showSyncLBInstances";
    // === その他の設定 ===
    /**
     * サインインプロンプトの非表示
     * 値: boolean
     * デフォルト: false
     */
    AppSetting["HIDE_SIGN_IN_PROMPT"] = "hideSignInPrompt";
    /**
     * アプリケーション起動設定（Web版のみ）
     * 値: "web" | "desktop" | "ask"
     * デフォルト: "web"
     */
    AppSetting["LAUNCH_PREFERENCE"] = "launchPreference";
    /**
     * 起動時にデータソース選択ダイアログを表示
     * 値: boolean
     * デフォルト: true
     */
    AppSetting["SHOW_OPEN_DIALOG_ON_STARTUP"] = "ui.open-dialog-startup";
    /**
     * 統合ナビゲーション（新しいアプリメニュー）の有効化
     * 値: boolean
     * デフォルト: false
     */
    AppSetting["ENABLE_UNIFIED_NAVIGATION"] = "ui.new-app-menu";
    // === 開発者向け設定 ===
    /**
     * レイアウトデバッグ機能の有効化
     * 値: boolean
     * デフォルト: false
     * 注意: 開発環境でのみ表示される
     */
    AppSetting["ENABLE_LAYOUT_DEBUGGING"] = "enableLayoutDebugging";
    /**
     * メモリ使用量インジケーターの表示
     * 値: boolean
     * デフォルト: false
     * 用途: パフォーマンス監視・デバッグ
     */
    AppSetting["ENABLE_MEMORY_USE_INDICATOR"] = "dev.memory-use-indicator";
})(AppSetting || (AppSetting = {}));

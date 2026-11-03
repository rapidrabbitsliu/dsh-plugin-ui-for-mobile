# v0.1.16 — Enter to newline, send-button keyboard dismissal

## 输入体验

- 移动窄屏普通回车在光标／选区处插入换行，保存草稿并保持输入焦点，不发送、不主动收键盘。
- 仅点击输入框右下角发送／排队／插话按钮后，在宿主清空草稿时失焦，请求收起软键盘；停止和受阻发送不触发该行为。
- 移除独立「↵」按钮。中文输入法选词、补全、修饰键及桌面端仍走宿主处理。
- 本版合并未公开的 0.1.15 本地中间版。无 DSH 源码修改，无新增运行时依赖。

## iOS 主屏幕状态栏：实验性，已知未解决

本版包含 Apple 状态栏元数据及根背景同步尝试，保留宿主 theme-color 和原安全视口。但用户实测明暗跟随不稳定：暗色 DSH 顶部仍可能亮色，刷新／重开不是可靠解决办法。**不要将此版本视为状态栏问题已修复。** 客户端插件不能保证系统启动时采纳动态元数据。

## Install / upgrade

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.16
```

或使用附件（npm 刚发布时可能仍在处理）：

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.16.tgz
```

使用实际运行的 Web profile，刷新原有页面。无需另开服务器。

## Verification and compatibility

- Eight Node unit tests and simulated Chrome regression cover caret newline/focus, IME/modifier exclusions, click-triggered blur, blocked sends, desktop passthrough, theme metadata and cleanup.
- Local previews installed in the web profile. New keyboard behavior has not received an explicit real-device acceptance confirmation; iOS native status-bar following is known unreliable from user testing.
- Statically checked against DSH 0.2.1-rc.3; narrow-browser layout ≤767 CSS px, not native desktop shells. Full device matrix and independent authenticated-page automation remain unverified.
- No orientation lock, Manifest or offline packaging. Existing unofficial AI artwork provenance/third-party character rights limitations remain unchanged; see assets/README.md.

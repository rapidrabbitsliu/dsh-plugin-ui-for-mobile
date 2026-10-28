# DSH Mobile UI

[中文](#中文说明) · Independent mobile UI compatibility plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

**No DSH source modifications. No second React application. No runtime npm dependencies.**

## Install

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile
```

Replace `web` with the profile actually used by your `dsh web` instance. Refresh the authenticated page after installation; if dynamic loading is unavailable, restart the original `dsh web` instance.

Alternatively download the `.tgz` from [GitHub Releases](https://github.com/rapidrabbitsliu/dsh-plugin-ui-for-mobile/releases):

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.1.tgz
```

### Upgrade from the local prototype

The prototype was named `@local/dsh-plugin-ui-for-mobile`. **Remove it before installing the public package. Do not enable both**, since they provide the same UI registrations.

```sh
dsh plugin --profile web remove @local/dsh-plugin-ui-for-mobile
dsh plugin --profile web add dsh-plugin-ui-for-mobile
```

## Features

Enabled only for narrow **Web browser** windows at **767 CSS px or below**, not the native desktop shell:

- Follow `visualViewport` height and offset to keep the existing composer inside the visible area when the keyboard appears.
- Use 16px input/search/editor text to reduce iOS focus zoom. Intentional pinch zoom remains available.
- Contain document-level horizontal overflow; code blocks retain their own horizontal scrolling.
- Keep the 56px collapsed navigation rail; expanded sidebar overlays the conversation instead of squeezing it. Tap the backdrop or press Escape to close.
- Bound long-draft height and account for the bottom safe area.
- Present mobile settings full-screen with horizontally scrollable categories, independently scrolling content, and a 44px close button.
- Compact mobile statistics: `5r 95s · 51/s`, `7.3M · H 32%`, and context percentage; full labels and details remain accessible.
- Restore plugin-owned styles, variables, DOM markers and listeners when disabled or returning to desktop width.

`r` = turns, `s` = steps, `/s` = tokens per second, `H` = cache hit rate.

## Compatibility and limitations

Statically checked against **DSH 0.2.1-rc.3**. This is a DOM/CSS compatibility adapter using existing shell/composer data markers, **not a stable cross-version layout API**. Unknown shell structure fails closed. DSH upgrades may require retesting.

The plugin does not move React-owned nodes, replace the editor, change session data, disable pinch zoom, or intercept all document touch movements. It is not a full redesign of settings, previews, terminals or dialogs. Wide tablets retain the original layout.

Automated tests cover a simulated shell and simulated visual-viewport events, not a native keyboard. Independent automated verification of an authenticated DSH page and a full iOS/Android device matrix remain outstanding. Please report your DSH version, browser, viewport and reproduction steps in [Issues](https://github.com/rapidrabbitsliu/dsh-plugin-ui-for-mobile/issues).

## Development

Node.js 22+ (Node 24 recommended). No dependency installation is necessary for building or unit tests.

```sh
npm run build
npm test
npm pack
```

`src/mobile.mjs` and `src/mobile.css` generate the committed `client.js`. Its module ID must match the package name and patch registration. React is supplied by the DSH browser module table.

Optional browser fixture test requires a locally installed Playwright and Chromium:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
$env:CHROME_PATH = 'C:/path/to/chrome.exe'
node tests/browser.cjs
```

## Uninstall

```sh
dsh plugin --profile web remove dsh-plugin-ui-for-mobile
```

Refresh the page afterwards. Installation affects the whole selected profile, although presentation changes only apply to supported narrow Web windows.

## 中文说明

独立移动端适配插件，不修改 DSH 主程序源码。主要改善：

1. 软键盘弹出后输入区被遮挡。
2. 页面级横向溢出、输入或搜索时的意外放大。
3. 侧栏展开挤压聊天区——改成覆盖式侧栏。
4. 输入框底部三块统计过宽——移动端使用图标、缩写和数字，不展示中文标签，保留详情功能。

安装命令见上方。请使用实际运行的 profile；默认示例为 `web`。从本地试用版迁移时，先卸载 `@local/dsh-plugin-ui-for-mobile`，再安装正式包，避免重复加载。

### 手机验收

- 输入多行中文，确认光标和发送按钮不被键盘遮挡。
- 关闭/重开键盘、横竖屏切换，确认高度正常恢复。
- 展开侧栏，确认聊天区宽度不变、遮罩可关闭。
- 搜索框聚焦时不自动放大；代码块仍可独立横向滚动。
- 验证会话切换、审批、附件、预览和设置的操作可达性。
- 禁用后刷新，确认恢复原有页面。

## License

MIT

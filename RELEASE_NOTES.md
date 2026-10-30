# v0.1.13 — Mobile newline button and keyboard dismissal

## 更新内容

- 移动端聊天输入区新增「↵」换行按钮，桌面端隐藏。
- 点击按钮通过 DSH 的公开输入 API 在当前光标处插入换行，保留输入焦点，不发送消息；避免触摸后的 click 重复插入。
- 普通回车发送并清空草稿后自动失焦，请求收起软键盘。
- Shift+Enter、修饰键回车、输入法选字、候选补全及保留草稿的受阻发送不会触发自动失焦。
- 支持同步或 1.5 秒内异步清空草稿，停用插件时清理监听和计时器。

Includes local preview 0.1.12. No DSH source changes; the existing editor and submit handlers are preserved.

## Install / upgrade

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.13
```

Or download the attached archive:

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.13.tgz
```

Use your active Web profile. Refresh the page; restart the original `dsh web` instance only if necessary.

## Verification and compatibility

- Eight Node unit tests and simulated Chrome regression, covering Enter submission blur, blocked sends, IME/modifier exclusions, asynchronous draft clearing, caret-position newline insertion and focus retention.
- Installed in the local Web profile; the user confirmed the combined mobile behavior works. Device/browser model was unspecified.
- Statically checked against DSH 0.2.1-rc.3; full iOS/Android matrix and independent authenticated-page automation remain unverified.
- New controls and Enter blur apply to the existing narrow-browser mode (≤767 CSS px), not native desktop shells.
- Existing unofficial AI-generated artwork provenance and third-party rights limitations remain unchanged; see assets/README.md.

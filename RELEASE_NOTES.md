# v0.1.11 — Fix sticky text enlargement after rotation

## 修复内容

- 修复手机横屏后聊天历史文字自动变大、转回竖屏仍不恢复的问题。
- 使用 `-webkit-text-size-adjust: 100%` 和 `text-size-adjust: 100%` 阻止浏览器额外放大文字，不固定聊天字号，不禁用双指缩放。
- 手机横屏宽度超过 767px、窄屏布局退出时，仍保留文字保护规则。
- 监听横竖屏切换，并在停用插件时清理标记及事件监听。

No DSH source changes. Existing message nodes and conversation state are preserved.

## Install / upgrade

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.11
```

Or download the attached archive:

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.11.tgz
```

Use your active Web profile. Refresh the page once to clear any already-inflated text; restart the original `dsh web` instance if needed.

## Verification

- Eight Node unit tests and simulated Chrome browser regression, including repeated portrait/landscape transitions and message-node preservation.
- Installed in the local web profile. The user confirmed the fix works on their mobile device; browser/device model was not specified.
- Statically checked against DSH 0.2.1-rc.3. Full iOS/Android matrix and independent authenticated-page automation remain unverified.
- Native desktop shells are excluded. Layout adaptation remains limited to ≤767 CSS px; text sizing protection additionally covers coarse-pointer landscape windows with height ≤767 CSS px.

Existing unofficial AI-generated artwork and its provenance/third-party rights limitations are unchanged; see assets/README.md.

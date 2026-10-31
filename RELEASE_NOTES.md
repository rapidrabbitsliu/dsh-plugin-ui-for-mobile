# v0.1.14 — Touch-friendly sidebar and complete feature guide

## 更新内容

- 移动端工作区／会话行右侧操作按钮常显，避免依赖悬停显形，减少首次触摸只高亮的问题。
- 工作区展开箭头常显，不再在悬停时交换文件夹与箭头。
- 保留 DSH 原有单击展开／收拢、会话打开逻辑，不模拟双击、不另写会话历史。
- 禁用移动端会话标题双击重命名；重命名仍可从行操作菜单进入，桌面端不变。
- 完整重写 README：功能介绍、像素角色动作、输入与键盘操作、顶部统计、设置、兼容限制和验证范围；同步英文摘要与安装示例。

No DSH source modifications. Existing newline, keyboard dismissal, rotation text-sizing and animated navigation features remain available.

## Install / upgrade

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.14
```

Or download the attached archive:

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.14.tgz
```

Use the active Web profile and refresh the original authenticated page. Restart the original `dsh web` instance only if needed.

## Verification and limitations

- Eight Node unit tests and simulated Chrome regression; touch fixture covers first-tap workspace expand/collapse, session open, action-menu accessibility and double-click rename suppression.
- Local preview was installed in the web profile. Real iOS/Android first-tap behavior and bottom session-bar synchronization still require user confirmation; this release does not implement separate bottom-tab navigation.
- Statically checked against DSH 0.2.1-rc.3; narrow-browser layout at ≤767 CSS px, not native desktop shells.
- Full device matrix and independent authenticated-page automation remain unverified. No orientation lock or PWA packaging is added.
- Existing unofficial AI-generated artwork provenance and third-party character rights limitations remain unchanged; see assets/README.md.

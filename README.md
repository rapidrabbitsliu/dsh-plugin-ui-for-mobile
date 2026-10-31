# DSH Mobile UI · 移动端体验增强

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 提供独立的手机适配插件：**全宽聊天、覆盖式侧栏、像素角色导航、软键盘适配、移动端换行、紧凑任务计数和全屏设置**。

**不修改 DSH 源码 · 不另建 React 应用 · 无运行时 npm 依赖**

[安装与升级](#安装与升级) · [功能介绍](#功能介绍) · [手机操作速查](#手机操作速查) · [兼容性与限制](#兼容性与限制) · [English](#english-summary)

## 版本状态

| 版本 | 范围 |
| --- | --- |
| **0.1.14：本次发行版本** | 侧栏工作区箭头和行操作按钮常显；取消移动端会话标题双击重命名；完整更新功能与操作文档 |
| **0.1.13：上一正式版本** | 回车发送后收键盘、移动端「↵」换行按钮，以及此前的布局、动画、顶部和横竖屏字体修复 |

下文功能以 0.1.14 为准。渠道是否已公开可用请以 [GitHub Releases](https://github.com/rapidrabbitsliu/dsh-plugin-ui-for-mobile/releases) 和 npm registry 实际状态为准；发布请求受理不等于立即可下载。历史变更见 [CHANGELOG.md](./CHANGELOG.md)。

## 安装与升级

安装最近正式版：

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile
```

指定已发布版本：

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.14
```

也可以从 [GitHub Releases](https://github.com/rapidrabbitsliu/dsh-plugin-ui-for-mobile/releases) 下载安装包：

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.14.tgz
```

- 将 `web` 替换为实际运行 DSH Web 的 profile。
- 安装或升级后刷新原有已认证页面；若动态加载不可用，再按原启动方式重启 `dsh web`。本插件不需要另开 Web 服务。
- npm 刚发布的版本可能仍在处理，以官方 registry 实际可用状态为准；可使用对应 GitHub Release 附件安装。
- 安装作用于整个所选 profile，但移动布局只在符合条件的 Web 窗口启用。

### 从早期本地原型迁移

旧原型包名为 `@local/dsh-plugin-ui-for-mobile`。**先移除旧原型，不要同时启用两个同类插件**：

```sh
dsh plugin --profile web remove @local/dsh-plugin-ui-for-mobile
dsh plugin --profile web add dsh-plugin-ui-for-mobile
```

## 功能介绍

### 1. 全宽聊天与覆盖式侧栏

- 去掉常驻的 56px 侧边栏轨道，让聊天区使用完整手机宽度。
- 侧栏展开时覆盖聊天区，不再把消息和输入框挤窄。
- 点击左边缘的像素角色打开侧栏；点击遮罩关闭。有实体键盘时也可用 Escape 关闭。
- 侧栏打开时，后方聊天区和相关背景区域不可交互，避免误触。
- 限制页面整体横向溢出；代码、差异和终端等宽内容保留自身的横向滚动。

### 2. 像素角色导航与动作彩蛋

这不是一条鱼形图标，而是从左边缘探头、抓住边缘的**蓝白配色 Q 版鲸鱼女仆少女**。

- **点按打开侧栏**：导航展开时角色隐藏，关闭后重新出现。
- **拖动调整位置**：拖动时显示全身挣扎动作，松手吸附回左边缘；竖向位置保存在本机浏览器中。
- **眨眼与挥手**：闲置时偶尔出现，角色不只是静态贴图。
- **调皮小动作**：低频抠鼻／弹出小像素粒子的卡通彩蛋，粒子落出屏幕后清理。
- **苹果小剧场**：拿出苹果、观察、闪光、展示、咬两口、咀嚼和满足微笑；苹果与调皮场景各使用 16 个姿态，减少动作跳变。
- 交互时停止闲置动作；页面隐藏时停止闲置效果并清理粒子。
- 遵循系统“减少动态效果”偏好，禁用闲置动画和拖动摇晃；仅角色触摸区域禁止原生触摸平移，不全局拦截页面手势。

角色为非官方 GPT Image 生成衍生素材，原始参考图不随包分发。代码 MIT 许可证不代表拥有参考角色权利，详见 [素材来源与权利说明](./assets/README.md)。

### 3. 输入、换行与软键盘

- 根据 `visualViewport` 的可见高度和偏移调整布局，缓解软键盘遮挡输入区的问题。
- 限制长草稿高度，保留输入区内部滚动，并处理底部安全区。
- 输入框和搜索框等使用 16px 文字，减少 iOS 聚焦输入时意外放大。
- **键盘普通回车**：仍由 DSH 处理发送；插件在观察到草稿被清空后让输入框失焦，请求收起软键盘。
- **移动端专用「↵」按钮**：在当前光标或选区位置插入换行，不发送消息，保留输入焦点；使用 DSH 的公开文本插入与草稿持久化接口，不直接重写编辑器内容。
- 中文输入法确认候选词、修饰键回车、连续按住回车、补全选择及保留草稿的受阻发送不会被当作普通发送后失焦。
- 有实体键盘时，Shift+Enter 仍遵循 DSH 原有换行逻辑；手机无需依赖 Shift，直接使用「↵」。

自动失焦只覆盖窄屏聊天编辑器的普通回车，**不是所有按钮或所有发送入口的通用“收键盘”设置**。草稿清空检测窗口为 1.5 秒，键盘最终行为仍受浏览器和系统控制。

### 4. 横竖屏文字大小保护

- 使用 `text-size-adjust: 100%` 及 WebKit 前缀，阻止浏览器横屏时额外放大聊天文字、转回竖屏仍残留放大状态。
- 手机横屏超过窄屏布局断点时，文字保护仍可保持启用。
- 不固定聊天历史字号，不禁用用户主动双指缩放，也不靠重建消息恢复字号。
- **这不是方向锁定**：插件不会阻止系统横竖屏切换，也不安装或修改 PWA Manifest。

### 5. 紧凑顶部与统计

- 子智能体、后台任务入口显示为**图标＋数字**，去掉可见长文字和下箭头。
- 用细边框表示可点击，展开时边框高亮；保留完整无障碍名称、运行状态提示及原菜单。
- 收紧顶部右侧按钮间距和内边距，长标题按需省略，并修复最右侧按钮因桌面负边距被截断的问题。
- 移动端隐藏“在本机应用打开目录”的分体按钮和“更多会话视图”入口；不删除底层功能或更改桌面布局。
- 输入框底部统计压缩为 `5r 95s · 51/s`、`7.3M · H 32%` 和上下文百分比；原有详情入口保留。

缩写：`r`＝轮次，`s`＝步骤，`/s`＝每秒 token 数，`H`＝缓存命中率。

### 6. 全屏移动设置

- 设置面板铺满当前可见区域，不再使用桌面窄弹窗布局。
- 设置分类改为横向滚动，内容区独立滚动。
- 提供 44px 关闭按钮触摸区域，处理顶部／底部安全区和输入控件宽度。

### 7. 侧栏单击体验（0.1.14 起）

- 工作区展开箭头常显，不再在悬停时切换文件夹与箭头。
- 工作区／会话行右侧操作按钮常显，减少触摸设备首次点按只触发悬停显形、没有执行点击的问题。
- 保留 DSH 原有工作区单击展开／收拢和会话单击打开逻辑，不通过模拟双击实现。
- 禁用移动端会话标题双击重命名，重命名仍可从行操作菜单进入。
- 实际手机首次点按是否彻底解决，以及底部会话栏是否同步，仍需真实页面验收；插件不另写一套会话历史或底部切换逻辑。

## 手机操作速查

| 想做什么 | 操作 |
| --- | --- |
| 打开工作区／会话侧栏 | 点左边缘像素角色 |
| 关闭侧栏 | 点侧栏外的遮罩 |
| 移动角色 | 拖动，松手后回到左边缘并记住高度 |
| 输入换行但不发送 | 点输入区「↵」按钮 |
| 用键盘发送并收起键盘 | 普通回车；发送清空草稿后自动失焦 |
| 查看子智能体／后台任务 | 点顶部带边框的图标＋数字 |
| 查看统计详情 | 使用原统计入口；视觉文字已缩短 |
| 会话重命名（0.1.14 起） | 使用会话右侧操作菜单，不再双击标题 |

## 兼容性与限制

- 移动布局条件：**Web 浏览器窗口宽度 ≤767 CSS px**，且能识别受支持的 DSH shell 结构；原生桌面壳不启用。宽屏平板及手机横屏超出断点时恢复原布局。
- 文字自动放大保护额外覆盖 **粗指针设备且窗口高度 ≤767 CSS px** 的浏览器场景，避免旋转时保护中断；这与窄屏布局是两套条件。
- 静态契约核对基于 **DSH 0.2.1-rc.3**。部分功能通过 DOM／CSS 标记适配，**不是稳定的跨版本布局 API**；DSH 升级可能需要重新测试。未知 shell 结构不会强行套用布局。
- 不移动 React 管理的节点、不替换原编辑器、不改变会话内容、不禁用双指缩放、不全局拦截触摸移动。停用后清理插件注册、样式、DOM 标记、监听和计时器；角色高度的本地偏好仍可保留。
- 没有提供屏幕方向锁定、原生 App 封装、离线能力或 PWA 安装配置。添加到主屏幕不会让插件自动获得原生权限。
- 模型／附件入口可能仍按 DSH 原行为聚焦输入或搜索；本插件尚未解决这些入口自动弹键盘的问题。
- 预览、终端和其他对话框不是完整重设计；隐藏的“更多会话视图”入口在移动端不可从该位置使用。

### 已验证到什么程度

- Node 单元测试覆盖视口几何、统计缩写和角色动作时间线。
- Chrome 模拟 shell 回归覆盖布局、侧栏、拖动、动画／粒子清理、减少动态效果、设置、顶部边界、横竖屏、回车失焦和换行按钮等。
- 用户已在手机上确认横竖屏文字修复、换行按钮和回车收键盘组合体验；设备及浏览器型号未记录。
- 自动测试不等于真实系统键盘；独立的已认证 DSH 页面自动化、完整 iOS／Android 设备矩阵，以及 0.1.14 的真实手机侧栏联动仍未完成验证。

遇到问题请在 [Issues](https://github.com/rapidrabbitsliu/dsh-plugin-ui-for-mobile/issues) 提供 DSH 版本、浏览器／系统、窗口尺寸、是否从主屏幕打开，以及复现步骤。

## 卸载

```sh
dsh plugin --profile web remove dsh-plugin-ui-for-mobile
```

卸载后刷新页面，恢复原有界面。

## 开发与验证

Node.js 22+（推荐 Node 24）。使用仓库已有的角色裁切帧进行构建和单元测试，不需要安装运行时依赖。

```sh
npm run build
npm test
npm pack --dry-run
npm pack
```

- [src/mobile.mjs](./src/mobile.mjs)：移动布局、统计／顶部／侧栏 DOM 适配、视口与发送后失焦。
- [src/mobile.css](./src/mobile.css)：窄屏样式、设置、顶部、换行按钮与文字放大保护。
- [src/mascot.mjs](./src/mascot.mjs)：拖动、位置记忆、闲置动作和粒子生命周期。
- [scripts/build.mjs](./scripts/build.mjs)：注册 DSH 插槽、使用公开 API 的换行按钮、嵌入 PNG 资源并生成 [client.js](./client.js)。修改这些输入后须重新构建。
- React 由 DSH 模块表提供，模块 ID 必须与包名及 patch 一致；角色无需额外素材服务器。

可选浏览器回归依赖本机已有 Playwright 和 Chromium：

```powershell
$env:PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
$env:CHROME_PATH = 'C:/path/to/chrome.exe'
node tests/browser.cjs
```

角色重新裁切工具另需开发用 Sharp 及生成图表；不属于使用插件或常规构建的必要步骤。生成资源来源见 [assets/README.md](./assets/README.md)。

## English summary

Independent mobile Web compatibility plugin for DSH: no DSH source changes, no second React application, no runtime npm dependencies.

- Full-width chat, overlay sidebar, draggable pixel chibi whale-maid navigation with persistent height, blinks, waves, playful idle effects and a sixteen-pose apple scene. Respects reduced-motion preferences.
- VisualViewport keyboard handling, bounded draft height, safe areas, 16px inputs, horizontal overflow containment and text auto-inflation prevention across phone rotation. User pinch zoom remains available.
- Mobile-only **↵** inserts a line break through the host's public input API. Plain Enter blurs the composer after the host clears the draft; IME/modifier and blocked-send exclusions retain focus.
- Outlined icon-and-count subagent/job triggers, tighter header spacing, compact statistics and full-screen mobile settings.
- **Since 0.1.14:** always-visible sidebar action strips/expand chevrons and suppression of session-title double-click rename; original single-click handlers and menu rename remain. Real-device first-tap/bottom-session synchronization still needs verification.

Release target: **0.1.14** (previous release: 0.1.13). Check GitHub Releases and the npm registry for actual channel availability; accepted publication may take time to become publicly downloadable. Installation commands above use the existing DSH Web profile. Refresh after installation; restart the original instance only if needed.

Layout applies at ≤767 CSS px in supported Web shells, not native desktop shells. Text sizing protection also covers coarse-pointer landscape windows with height ≤767 CSS px. This is a DOM/CSS adapter statically checked against DSH 0.2.1-rc.3, not a stable cross-version layout API. No orientation lock, offline support or PWA/native packaging is provided. Model/attachment focus behavior remains a known limitation.

Automated tests use a simulated shell/viewport, not a full authenticated DSH or native iOS/Android keyboard matrix. User mobile verification covers rotation text sizing and the newline/keyboard combination. Artwork is unofficial AI-generated reference-derived material; see [provenance and rights limitations](./assets/README.md).

## License

Code: [MIT](./LICENSE). The code license does not assert ownership of third-party reference characters or remove artwork rights limitations.

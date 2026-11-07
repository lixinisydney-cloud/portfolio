# Codex — SYDNEY’S WORLD Phase 3B 视觉整合指令

方案 A 已完成（中文内容、9 个项目、视频封面、在线体验与 GitHub CTA），在开始本任务前请确认 PR #2 是否合并；若未合并，先告知，不要覆盖方案 A。

我已上传新视觉包：`public/assets/world/`、`public/assets/ui/`、`public/assets/ui/cursors/`、`public/assets/phase3b-references/`。请先列出实际存在的文件并读取 `planning/phase3b/ASSET_MANIFEST.csv`，不要自行编造路径。

目标：参考 The Making of Pets（我的实际个人项目）的珍珠粉紫幻想场景构建 SYDNEY’S WORLD 首页。参考 House of Gul 的世界观氛围 + haoqi.design 的清晰信息结构，不照搬视觉细节。

**最高优先级：首页真实小岛**
1. `world/island-main.webp` 必须作为主视觉岛屿（它来自我自己原有的 C4D 素材，不使用 AI 生成的小岛）。
2. `world/soft-sky-bg.webp` 或与之同色系的 CSS 渐变作为大背景，保留导航与标题可读区域；原来偏黑色超大的标题适当缩小以适应小岛。
3. `world/flying-cow.webp`、`world/flying-deer.webp` 选择性加入前中后分层。`world/flying-rabbit.webp` 可以作为备选。
4. `world/water-ribbon.webp`、`world/crystal-flora.webp` 只选 1–2 个做细节点缀，不要都堆上去。
5. 首页中项目入口可以采用与小岛相关的 3–4 个轻量 HTML 交互标签/热点，点击准确地打开对应的项目预览或详情页；其余项目通过 Selected Works 访问。不要让装饰元素挡住按钮。
6. 使用 Parallax.js 在包装容器上控制视差，CSS 内部控制 hover；不要让两个系统同时争夺同一个 transform。可用三层：背景、岛屿、少量漂浮装饰。场景图本身没有真实3D视角，不要试图让静态PNG形成不自然的360度旋转。

**UI 整理**
7. `ui/ornament-corner-*.webp`、`ui/button-play.webp`、`ui/button-visit.webp` 只选择有必要的地方点缀，避免六个项目详情页全都过度洛可可风。参考 haoqi.design 的信息可读性保留干净版式。
8. 所有 CTA 仍然使用语义化 button / a，图片只是 CSS 背景或 decoration。保留键盘操作、焦点样式、44px 触摸目标。播放大封面点击后加载视频的行为不能破坏。
9. `ui/cursors/*.png` 先在 hero 中试验，若浅色光标在背景不清晰则不要启用；输入和正文区保留默认光标，手机不需要自定义光标。
10. `phase3b-references/city-life-final-poster.webp` 可用于城市生活有意思的真实封面替换；其他截图可作为 Stubborn Horse、Dragon Dance、Uncertain Oracle 的预览，但先确认对应 slug 与图片内容，不要误用。可选择性接入 `phase3b-references/city-life-motion-10s.mp4`，但必须继续使用方案 A 的点击后播放组件，不得自动播放或取消其他媒体。

**保持原有功能**
11. 不重建项目，不修改技术框架；保留方案 A 的中文内容、媒体数据、封面点击播放、体验入口、GitHub 入口、hash 路由、GitHub Pages 自动部署。
12. 不要显示开发备注（如 low resolution / coming soon），也不要将AI装饰视为项目成果。
13. CSS 桌面布局请以 1440×900 作为设计基准，移动端 390×844。移动端优先清晰地看到作品入口，不让小岛占据连续两三屏。

**执行与验收**
- 在一个独立功能分支实施，不直接提交到 main。
- 先说明素材清单和拟使用层级，再修改。
- 完成后提交 PR，给我 1440×900 与 390×844 的页面截图/截图路径，列出未使用的装饰图和原因。
- 运行 npm run build 与仓库现有 Playwright 测试；自行检查全部项目入口、视频点击加载、外链、移动端交互和 /portfolio/ 地址。

# SYDNEY’S WORLD — Phase 3B Assets V1

此压缩包用于第三阶段视觉改版。**不包含新的 AI 首页小岛**：`public/assets/world/island-main.webp` 来自你自己的 `sucai.zip/12_1000.png`。

## 上传方式
1. 推荐先合并方案 A 的 PR #2 到 `main`，确认线上网站仍能打开。
2. 解压此 ZIP，将内部 `public/` 整个目录复制到 `portfolio/` 仓库根目录进行合并（不是把 ZIP 本身上传到仓库）。已有 `public/assets/` 内容保留，不要清空或覆盖项目封面。
3. 推荐 GitHub Desktop 批量提交文件：clone 仓库、把 `public/` 合并到本地仓库、commit、push。网页版 GitHub 也可分目录上传，确保保留 `public/assets/world/`、`public/assets/ui/`、`public/assets/ui/cursors/`、`public/assets/phase3b-references/` 路径。
4. 将本包的 `ASSET_MANIFEST.csv`、`CODEX_PHASE3B_PROMPT.md` 可另上传到 `planning/phase3b/`，不要放到 `public/`。
5. 让 Codex 在最新 `main` 创建功能分支，只做方案 B 的视觉整合。不要覆盖方案 A 中文内容与视频/CTA 组件。

## 核心资产
- `world/island-main.webp`：原始 The Making of Pets 喷泉岛透明图，**首页场景核心**。
- `world/flying-cow.webp` / `flying-deer.webp` / `flying-rabbit.webp`：你的 C4D 原始动物素材；首屏优先牛和鹿，兔子可备选。
- `world/water-ribbon.webp` / `crystal-flora.webp`：新增生成的漂浮装饰，最多出现 1–2 个，避免抢作品主题。
- `world/soft-sky-bg.webp`：原始淡粉紫渐变背景，可用 CSS gradient 替代。
- `ui/ornament-corner-*.webp`：珍珠角花，仅用于边角点缀。
- `ui/button-play.webp`, `button-visit.webp`, `button-capsule.webp`：仅是按钮视觉皮肤；实际点击必须是 HTML 控件。
- `ui/cursors/*.png`：48px 光标备选；浅色小光标在浅色背景上可能看不清，如对比度不佳保持浏览器默认光标。
- `phase3b-references/*`：新增补充图和城市生活有意思 10 秒 H.264 MP4，供 Codex 检查后更新相关项目封面/图库；默认先不要覆盖线上图片。视频点击后加载，避免自动播放。

## 与项目素材的关系
这些新图片只塑造网站的视觉环境，不得将生成装饰声称为任何项目的真实成果。视频、作品说明、体验链接以方案 A 的数据为准。

## 技术与性能约束
- 继续 Vite + 原生 JavaScript + Parallax.js；使用 `import.meta.env.BASE_URL` 路径拼接，适配 `/portfolio/`。
- 首页岛屿尽可能一张 PNG/WebP；少量动物/花卉图分层视差。不要把 9 个项目全部塞到首屏。
- 移动端避免大图分层混乱；滚动可直接进入作品卡片，装饰减少。
- 只在鼠标精细指针桌面端可选启用 cursor；遵守 `prefers-reduced-motion`。
- 验收 1440px、390px，构建与交互测试完成后再合并上线。

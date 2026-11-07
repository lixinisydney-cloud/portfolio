# Codex 第三阶段 · 方案 A 指令（仅规划与内容系统，不上线视觉改版）

你正在处理 GitHub 仓库 `lixinisydney-cloud/portfolio`。目前网站正常部署在 GitHub Pages，已有 Vite + Vanilla JS + Parallax.js 与 hash 路由。用户正在制作给多媒体／互动设计岗位面试官看的中文为主双语个人作品集。

我提供四份文件：
1. `01_design_brief_cn.md`：视觉方向和 UX 规范
2. `02_project_copy_cn.md`：求职版全部项目正文和已核实的技术标签
3. `03_project_content_v3.json`：结构化项目数据、视频和体验链接
4. `04_asset_manifest_v1.csv`：下一阶段视觉资产来源和目标命名

**现在做方案 A 的准备工作，不开始方案 B 的首页改图。**

请先检查现有 `content/projects-draft.json`、`src/projects.js`、`src/main.js`、`src/style.css`、`index.html` 和测试，不要重写成 React/Astro。

A1. 建立一个安全的数据迁移方案：以 slug 为主键，把 `03_project_content_v3.json` 中的中文摘要、中文详情、技术标签、视频链接和按钮链接与**现有**封面、场景物件、图库和本地 MP4 合并；不要覆盖已经存在的图片路径、视频路径。保持 JSON 可维护。
A2. 规划扩展到 8 个主要作品 + 1 个独立算法马实验，Horse Motion Study 与 Stubborn Horse 必须是不同 slug 和详情页。尚未上传图片的 Dragon / Oracle 先使用中文可读的占位卡，不能引用不存在的资源。
A3. 所有操作文案中文优先（查看作品、播放影片、在线体验、查看代码、返回作品）；少量英文标签作为辅助。About 使用新中文介绍，联系区使用用户真实联系方式。
A4. 设计可复用的 VideoPoster / LargeMedia 方案：每条视频一张本地 poster，大幅可点播放；点击后才加载 YouTube iframe 或本地 MP4。支持 2 个视频（Anger Market）和 4 个本地短视频（City）。为 YouTube 不可访问场景提供明确外链或可用的本地视频备选；不要有空的黑色播放器框。
A5. 设计 Live Demo / Watch Video / GitHub CTA 组件：只有真实链接才显示，`target=_blank` 需 `rel=noopener noreferrer`。Oracle 提示摄像头权限。
A6. 团队作品的个人职责未确认时不公开编造，不填写不确定年份。去掉所有访问者可见的开发备注和 coming soon。
A7. 只做内容和组件基础改动时保持现有 Hero、Selected Works 的视觉布局不变，避免影响线上稳定版本。不要现在生成或替换小岛视觉。
A8. 在新分支完成改动，运行 `npm run build`、`npm test`，输出变更清单和还缺的媒体资产。提交 PR 但不要自行合并到 main。

请先说明你的数据合并策略和完整的文件改动计划，再执行。禁止直接把这份项目 JSON 整体替换 `content/projects-draft.json` 导致图片丢失；建议用 slug 合并并保留来源标记。

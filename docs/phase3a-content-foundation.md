# 方案 A：中文内容与组件基础

## 范围与线上边界

基于 `main` 的 `2283545` 建立 `feat/phase3a-content-foundation`。仅内容和组件基础，PR 合并前不改变线上网站。没有修改 Vite base、Pages 工作流、原有五个场景 PNG、物件布局、景深参数、悬停缩放或作品网格的列数/封面尺寸；没有创建 `assets/world/` 或小岛素材。

主作品按 1–8 排列：制作宠物、愤怒市场、色度住宅、固执的马、舞龙、不确定的神谕、城市生活有意思、GOOD BOY。`horse-motion-study` 在同一作品区下方作为独立实验，单独详情；绝不借用它的图片或 MP4 展示 `stubborn-horse`。

## 可维护的数据迁移

运行：

```sh
node scripts/merge-project-content.mjs
node scripts/merge-project-content.mjs --check
```

编辑来源：`planning/phase3a/03_project_content_v3.json`，中文核对依据为同目录 `02_project_copy_cn.md`。迁移后的 `content/projects-draft.json` 是运行时项目数据唯一入口；`content/site.json` 是个人介绍和真实联系方式入口。`src/projects.js` 仅补展示参数、筛选集合与 URL helper。

合并约定：

- 严格以 slug 识别作品，拒绝重复或非法 slug。旧作品即使不在后续导入文件中也保留。
- 不使用新 JSON 整体替换旧文件；逐项保留已有 `cover`、`sceneObject`、`gallery`、`previewVideo` 和本地视频 `src`。
- 中文摘要写入 `summary`，正文写入 `detailZh`，核实技术写入 `technologies`。英文正式名保留在 `title`，中文在 `titleCn`。
- 视频以 `src` 或 URL 去重合并，中文标签可更新，但本地路径不丢失。已配本地 poster 不会被输入的 null 清空。
- 新增项目没有图片时明确存 null/空数组；纯文字封面不会请求不存在的图片。
- `sources` 记录文案/媒体来源；每条视频还记录来源、海报路径及 `posterType`。
- `assetNote`、`responsibilityReviewNote` 等历史/审校信息仅内部保留，不渲染给访客。旧 `externalLinks` 保留作旧数据记录，当前 CTA 读取已核实的 `links` 和 `videos`，不重复显示旧视频按钮。
- 所有未确认年份为 null。团队作品不公开“我的工作”栏目，不渲染未核实分工。
- 保存前检查所有真实媒体路径存在且位于 `public/assets/` 内；结果可重复运行。独立的 `tests/fixtures/phase2-media.json` 是迁移前媒体快照，仅用于回归测试，不参与页面渲染。

下一轮替换封面时编辑 canonical 数据中的媒体字段；更新中文文案时修改规划 JSON 后重新合并。不要将新的图片字段硬塞到导入 JSON 后期待覆盖旧媒体：这是有意设置的保护边界。

## 组件与加载策略

- `src/components/media.js`：可复用 image / LargeMedia，保留自然比例、尺寸元数据与图库懒加载；缺图为中文文字卡，加载失败有中文退路。
- `src/components/cta.js`：仅渲染真实 HTTPS 链接；在线体验 / 观看影片 / 查看代码。新窗口统一 `noopener noreferrer`；视频跳转使用按钮在当前详情内滚动，不破坏 hash 路由。Oracle 明示摄像头权限；Onrender 仅提示可能需等待启动，不承诺时间。
- `src/components/video-poster.js`：12 张本地封面，点击才创建本地 video 或 YouTube nocookie iframe；影片前不请求 YouTube/远程缩略图/MP4。离开页面停播并移除 iframe。外链一直可见，不依赖 iframe 成功事件判断 YouTube 是否可播放。
- 本地 MP4 保留原路径和黑底，不作为透明视频叠加。播放失败恢复可见封面，提供本地影片外链。未伪造任何重点项目的本地完整影片。

## 海报来源

| 本地文件（`assets/posters/`） | 真实来源 | 类型 |
| --- | --- | --- |
| pets-film.webp | Pets 原 cover.webp | 项目图，非声称为影片截帧 |
| anger-film-01.webp | Anger 原 cover.webp | 项目图 |
| anger-film-02.webp | Anger brand-guideline-03.webp | 项目图 |
| chroma-film.webp | Chroma 原 cover.webp | 项目图 |
| stubborn-horse-film.svg | 中文标题与英文正式名 | 纯文字封面，非作品截图 |
| dragon-dance-film.svg | 中文标题与英文正式名 | 纯文字封面，非作品截图 |
| oracle-film.svg | 中文标题与英文正式名 | 纯文字封面，非作品截图 |
| city-life-is-fun-*-preview.webp（4 张） | 对应原 MP4 的第 1 秒 | 真实视频静帧 |
| horse-motion-study-horse-preview.webp | 原 horse-preview.mp4 第 1 秒 | 真实视频静帧 |

海报只增加约 544KB，不增加运行时依赖。WebP 项目图在保留比例的前提下适配最大 1600×900；本地帧最长宽 960。未下载字体或 YouTube 远程缩略图。

## 仍缺的媒体 / 核实事项

- Stubborn Horse：真实网页截图/封面和本地玩法短片。现为独立文字卡与文字视频封面，没有借算法马图像。
- Dragon Dance / Oracle：真实截图/封面、可访问的本地演示 MP4，以及经确认的团队个人职责。当前仅呈现核实的项目介绍、演示/体验/代码链接，不公开猜测分工。
- Pets、Anger 两条影片、Chroma：可选真实视频 poster 截帧，以及面试网络可访问的本地 H.264 短版或国内平台链接。现有 YouTube 外链不能保证在中国大陆可访问，未声称已验证每条视频可嵌入。
- GOOD BOY：高清展览照片和本地真实交互片段；没有提供完整视频 URL，所以不显示虚构的影片按钮。
- 城市：最终海报主视觉、干净透明原图及网页完整录屏；已有四段 MP4 继续使用。
- Chroma：更高清的装置/空间照片；算法马完整原片可选。
- 方案 B 的小岛、装饰、角花等素材仅在 `04_asset_manifest_v1.csv` 中规划，本轮不生成、不移动、不引用尚未上传的目标路径。

## 验证

`npm run build`、`npm test`，以及 `node scripts/merge-project-content.mjs --check`。包含旧媒体快照保护、9 个详情、8+1 集合、中文 About/联系区、团队职责/年份、无缺图请求、懒加载、不可用 YouTube 的外链退路、本地影片加载失败、键盘、触摸、减少动态效果、`/portfolio/` 路径刷新/返回和五段本地 MP4 解码。

YouTube 测试使用被阻断的确定性响应检验 UI 与外链，不等同于外部平台可播放性保证。PR CI 只构建测试，不部署；只有之后合并 main 才由现有 Pages 工作流部署。

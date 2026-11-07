# 方案 B · Visual Assets Integration

## 分支与内容保护

用户素材原先位于 `feat/phase3b-visual-assets` 的 `1b840f8`，基于早期 `3b5ccf9`。在同一功能分支合入最新 `main`（`85ceeca`），保留已合并 PR #2 的全部方案 A 代码及中文内容。未覆盖 main，也未合并本 PR。

媒体整合仅更新经目视核对的封面/图库/视频海报，并追加城市 10 秒影片。中文摘要、正文、技术、职责、外链和旧本地 MP4 均由回归测试核对。迁移脚本继续可重复运行，并保留 phase3b 来源标记和真实截图海报类型。

## 首页构图

- 唯一主岛：`world/island-main.webp`，文件保持用户上传原样，来自 The Making of Pets 原 C4D 喷泉渲染。
- 上方：收小的真实 HTML 英文标题＋中文引导；中下方：单一喷泉岛。
- 三档景深：后景动物 0.06 / 岛屿与热点 0.12 / 花卉 0.24；包装层由 Parallax.js 控制，按钮 CSS 独立控制轻微悬停缩放。
- 飞牛右上、飞鹿左侧；原作花卉右下；一处小型生成水晶花簇左下。生成装饰不进入项目成果展示。
- 岛边四个入口为制作宠物、愤怒市场、色度住宅、固执的马。都是 HTML button，常显中文标签，44px 以上点击高度；先开预览，再进原 Hash 详情。其余作品通过完整作品网格访问。
- 奶油白/雾紫/浅粉 CSS 天空，深紫灰文字；珍珠胶囊仅用于查看全部作品，Play 图作为原视频按钮内的装饰，右上角花只用于页脚。
- 手机为静态原始岛屿＋四个双列作品入口，不创建飞行动物、原花卉或生成花簇的图片 DOM，因此不会下载这些桌面装饰。作品区在首屏底部即可出现，无横向溢出。
- 自定义光标保持关闭。以 48px 原图与奶油底合成检查，非透明像素中位对比约 1.29–1.34:1，作为小光标辨识度不足。正文和控件继续使用系统光标。

## 真实项目素材更新

- 城市：`phase3b-references/city-life-final-poster.webp` 替换临时封面，并进入图库。旧文件不删除。
- Stubborn Horse、Dragon Dance、The Uncertain Oracle：各自真实截图进入对应封面、图库和 YouTube 视频封面；没有借用算法马图像。
- 算法马：三张方形新帧追加到自己的图库，旧图与本地片段保留。
- 城市：`city-life-motion-10s.mp4` 追加为第五条本地影片，使用真实截帧 `posters/city-life-main-motion.webp`，按原 3:4 纵向比例播放；原四段黑底 H.264 预览不变。新影片约 7.9MB，仅点击后请求。
- 卡片依图片实际比例展示，去除统一大片粉彩底板；详情主视觉与图库减少底板，不裁切竖海报，不用生成装饰代替作品原图。

## 29 件上传素材的用途核对

已使用 16 件（加一张从城市影片提取的本地海报）：

| 类别 | 文件 | 用途 |
| --- | --- | --- |
| world | island-main.webp | 唯一主岛 |
| world | flying-cow.webp / flying-deer.webp | 后景原作动物 |
| world | dream-flora.webp | 原作花卉 |
| world | crystal-flora.webp | 唯一生成花簇装饰 |
| ui | button-capsule.webp | 查看全部作品 HTML 链接背景 |
| ui | button-play.webp | 视频 HTML 按钮内装饰 |
| ui | ornament-corner-top-right.webp | 页脚一处角花 |
| references | city-life-final-poster.webp | 城市封面/图库 |
| references | dragon-dance-screenshot.webp | 舞龙封面/图库/视频海报 |
| references | uncertain-oracle-screenshot.webp | Oracle 封面/图库/视频海报 |
| references | stubborn-horse-screenshot.webp | 固执的马封面/图库/视频海报 |
| references | horse-motion-frame-01/02/03.webp | 算法马图库 |
| references | city-life-motion-10s.mp4 | 城市主视觉动态，按需加载 |

未使用 13 件，文件仍保留，不在页面主动加载：

- `world/flying-rabbit.webp`：已选牛和鹿，避免同时堆放所有动物。
- `world/water-splash.webp`：主岛自带水景，避免重复。
- `world/ornament-oval-original.webp`：竖向椭圆不适合当前岛边入口和横向阅读。
- `world/soft-sky-bg.webp`：使用同色系 CSS 渐变，减少背景请求并避免图片中的地平线。
- `world/water-ribbon.webp`：已选晶体花簇，避免再增加大面积生成装饰。
- `ui/ornament-corner-top-left.webp`、`ornament-corner-bottom-left.webp`、`ornament-corner-bottom-right.webp`：仅留一处页脚角花，保持清晰。
- `ui/button-visit.webp`：体验入口保留高对比中文 HTML 按钮，不需要第二套图形按钮。
- `ui/icon-pearl-star.webp`：原有简洁星标足够，不再叠加标记。
- `ui/cursors/cursor-arrow.png`、`cursor-hover.png`、`cursor-sparkle.png`：浅底对比不足，保留系统光标。

## 验证与限制

- `npm run build`、`npm test`、`node scripts/merge-project-content.mjs --check`、`git diff --check`。
- 16 项浏览器测试：9 个项目、四个岛上入口、触摸/键盘焦点、减少动态效果、原始岛图、移动端不加载装饰、真实封面、媒体失败退路及方案 A 内容/链接不丢失。
- `/portfolio/` 静态构建测试检查所有引用的媒体路径和 CSS 装饰响应，刷新/返回正常，并实际解码 6 条本地 MP4。
- 七个 YouTube 条目均检查点击前无 iframe、点击后正确 videoId、外链及离页移除。测试使用本地 provider fixture，不冒充外部 YouTube 实际播放成功。
- 真实外链 HEAD 检查：Dragon-Dance、Stubborn-Horse、The-Uncertain-Oracle、city 四个 GitHub 仓库返回 200。三个 Onrender demo、城市在线页和 YouTube 被本环境代理以 403 拒绝，不能据此判断它们在访客网络中的可用性；用户提供链接均原样保留。
- House of Gul、haoqi.design 也被环境代理拒绝，未声称逐屏复刻；构图依据用户原作与提供的设计说明。
- `docs/screenshots/phase3b-home-1440x900.png` 与 `phase3b-home-390x844.png` 为真实浏览器截图，非效果图。截图命令：启动 Vite 后运行 `node scripts/capture-homepage.mjs`。

尚可后续补充：GOOD BOY 高清展陈与互动影片、YouTube 项目的国内可访问备选视频，以及 Dragon/Oracle 经确认的团队个人职责。当前不会公开猜测分工。

## PR #3：CI 视频加载修复

涉及文件为 `phase3b-references/city-life-motion-10s.mp4`。与其他五段 MP4 不同，上传原文件的 `moov` 索引位于偏移 7,880,478（约 7.88MB，`mdat` 之后）。编码是 H.264 Main / yuv420p + AAC LC，并非不兼容编码。原静态构建测试服务器仅用 readFile 返回 200，没有 Content-Length、Accept-Ranges 或 206/Content-Range，无法像 Vite/真实静态托管那样读取片尾索引。CI 资源/传输时序下，浏览器可能一直停在 HAVE_NOTHING，未在原 5 秒轮询内得到可解码帧。

播放器仍按点击创建 video，赋 src 后调用 play()；该调用会启动加载，不需要额外在首页预加载视频，也没有修改交互设计。

修复措施：
- `ffmpeg -map 0 -c copy -movflags +faststart` 无损重封装同一路径文件，让索引先于媒体数据。音轨/视频轨的 encoded-stream SHA256 重封装前后完全一致，没有重新编码、降质或删音轨。
- 构建测试服务器改为流式 HTTP 服务，支持 Content-Length、Accept-Ranges、206、Content-Range、HEAD、suffix/open-ended Range 和 416。测试直接核对分段响应体等于原文件字节。
- 保留 readyState >= 2 断言和原等待时间，额外要求 currentTime > 0，证明真的开始播放；每段影片添加包含 slug/路径的 test.step 和错误诊断，后续 CI 可直接定位片段。
- 增加 fast-start 布局回归断言，防止新增大文件再次把索引留在片尾。

本地 `npm run build` 与 17 项浏览器测试通过。GitHub Actions 结果以修复提交的实际检查记录为准；该 PR 不自行合并或部署。

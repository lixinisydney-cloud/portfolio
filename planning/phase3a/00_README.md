# SYDNEY'S WORLD · 第三阶段「方案 A」交付包

此包包含可供 Codex 读取的**规划、中文文案、真实视频/体验链接、命名表和实施指令**；不是图片生成包，也未修改当前线上网站。

文件：
- `01_design_brief_cn.md` — 岛屿世界观、版式、交互、2.5D、字体与性能规则
- `02_project_copy_cn.md` — 9 个独立项目（8 主项目 + 1 马算法研究）及 About 的优化中文文案
- `03_project_content_v3.json` — 项目与 YouTube / Live demo / GitHub 的机器可读数据
- `04_asset_manifest_v1.csv` — 从 252MB sucai.zip 与旧网站资产中筛选的 23 个素材候选及目标名称
- `05_CODEX_PHASE3A_PROMPT.md` — 可直接提供给 Codex 的准备阶段指令

**使用方法**：
1. 下载并解压本包。把 `01` 至 `05` 这些文本文件放到当前网站仓库的 `planning/phase3a/`（不要放 `public`）。
2. Codex 检查后仅做内容模型和视频/链接组件，不直接替换或删除原素材。
3. 以后做方案 B 再制作 `public/assets/world/` 的首页小岛图片和装饰素材。不要把整个 `sucai.zip`、`png.zip` 上传网站。
4. 上传的新素材应建立在现有真实作品的视觉基础上，生成图仅用于网站包装，不要代替作品真实成果。

**核查提醒**：
- 只验证了 GitHub README 的技术信息与用户提供的链接格式。YouTube 页面是否允许嵌入、用户所在网络是否能访问，以及每个链接现场是否可播放，还需要网站实现时逐一检测。
- Dragon Dance 和 The Uncertain Oracle 可能包含团队协作；现有 README 都标示了其他作者。正式个人职责未确认，不在文案中擅自归功。
- Good Boy 的完整视频链接尚未提供；现阶段只能用已有真实图片及后续本地短视频。
- 不生成或分发任何字体文件。

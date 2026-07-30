---
name: docs-site
description: 把散乱的 Markdown 文档搭建为带侧边栏导航、全文搜索的文档站（docsify，CDN 免构建），并支持内嵌预览 HTML 原型。只要用户提到“文档站”“文档导航”“侧边栏目录”“docsify”“文档太长没有导航”“GitHub Pages 文档”“预览原型/文档”等，就优先调用本 skill。方案与项目原型技术路线一致：无 Node、无构建，新增文档只需一个 md + 侧边栏一行。
---

# 文档站搭建助手（docsify）

把目录里的 md 文档变成带侧边栏导航 + 全文搜索的文档站，HTML 原型也能接入导航。

## 技术方案（已在本项目验证通过）

- **docsify 4.13.1**（CDN 锁定版本，jsdelivr 实测可用），vue 主题。
- 文件构成：`index.html`（配置）+ `_sidebar.md`（导航）+ `README.md`（首页）+ `.nojekyll` + 若干 md。
- **免构建**：新增一篇文档 = 放入 md + `_sidebar.md` 加一行。
- 参考实例：项目 `docs-demo/` 目录（可直接复制改造）。

## 执行步骤

1. **定站点根目录**：文档集中放某目录（如 `docs/`）；若需内嵌预览 prototype 下的 HTML 原型，服务器和 Pages 都按"项目根目录"规划。
2. **生成骨架**：按下方模板写 `index.html`、`_sidebar.md`、`README.md`、`.nojekyll`。
3. **整理侧边栏**：`Glob` 摸清现有 md 文件，按业务分组组织 `_sidebar.md` 链接；单文件超 300 行的长文档建议先拆分（文件树即导航）。
4. **本地起服务**：`python -m http.server 3000`（后台运行、无超时；从项目根目录启动）。
5. **验证**（必须做）：用无头浏览器截图确认渲染（命令见下），至少截首页和一个内页。
6. **交付说明**：告知预览地址、以后如何自行起服务、如何部署 GitHub Pages。

## 模板文件

### index.html（三栏布局：左导航 / 中正文 / 右"本页目录"）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>产品文档中心</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4.13.1/lib/themes/vue.css">
  <!-- 右侧"本页目录"插件样式 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify-plugin-toc@1.3.2/dist/light.css">
  <style>
    /* 右侧目录标题（插件不渲染标题，用 CSS 补；容器是 aside.toc-nav） */
    aside.toc-nav::before {
      content: '本页目录';
      display: block;
      font-weight: 600;
      font-size: 14px;
      color: #2c3e50;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      name: '产品文档中心',
      loadSidebar: true,
      subMaxLevel: 0,   // 左侧只显示 _sidebar.md 导航，页面标题交给右侧目录
      auto2top: true,
      search: { placeholder: '搜索文档…', noData: '没有找到结果', depth: 3 },
      pagination: { previousText: '上一篇', nextText: '下一篇' },
      toc: { tocMaxLevel: 3, target: 'h2, h3' }   // 右侧本页目录
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4.13.1/lib/docsify.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4.13.1/lib/plugins/search.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4.13.1/lib/plugins/pagination.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify-plugin-toc@1.3.2/dist/docsify-plugin-toc.min.js"></script>
</body>
</html>
```

### _sidebar.md

```markdown
* [首页](/)
* **分组名**
  * [页面名](路径/文件.md)
  * <a href="/prototype/xxx.html" target="_blank">原型页（新窗口）↗</a>
```

### 其他

- `README.md`：站点首页（说明 + 快速链接）。
- `.nojekyll`：**空文件，必需**——否则 GitHub Pages 的 Jekyll 会忽略 `_sidebar.md` 等下划线开头文件。

## HTML 原型预览（两种模式）

docsify 只渲染 md，HTML 原型接入导航的两种方式：

1. **iframe 内嵌**（文档+原型同屏）：md 页面里写
   `<iframe src="/prototype/xxx.html" style="width:100%;height:82vh;border:1px solid #e8e8e8;border-radius:8px;"></iframe>`
2. **新窗口打开**（完整体验）：侧边栏写 `<a href="/prototype/xxx.html" target="_blank">`

注意：iframe/链接路径相对于**服务器根目录**；内嵌宽度 <768px 时原型的响应式 CSS 会切成窄屏布局（属正常，桌面布局用新窗口模式）。

## 关键规则（全是踩过的坑）

- **file:// 双击打不开**（docsify 用 XHR 加载 md），必须用静态服务器。
- 服务器从**项目根目录**启动，否则引不到其他目录的文档和原型。
- CDN 全部锁定版本（docsify@4.13.1、docsify-plugin-toc@1.3.2，均已实测）。
- 部署 GitHub Pages 必须带 `.nojekyll`；原型文件需与站点在同一仓库。
- 长文档拆分到单文件 ≤300 行，README.md 做目录导航页（GitHub 浏览目录时自动渲染 README）。
- 右侧"本页目录"用 docsify-plugin-toc：`subMaxLevel` 必须设 0（否则页面标题在左右两侧重复出现）；插件容器是 `aside.toc-nav`（不是 `.toc`），自定义标题用 `aside.toc-nav::before`。

## 验证方法（无头浏览器截图，已验证可用）

```bash
# 关键1：--user-data-dir 必须用独立目录（默认配置被占用的 Edge 会导致截图静默失败）
# 关键2：含 iframe 的页面 --virtual-time-budget 要给足 30000（太短 iframe 内网络请求被饿死，截图空白）
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir=/tmp/edge-headless \
  --window-size=1280,900 --virtual-time-budget=30000 \
  --screenshot=/tmp/shots/check.png "http://localhost:3000/docs-demo/"
```

截图后用 ReadMediaFile 查看确认渲染（侧边栏、正文、表格、iframe 内容）。同步报错 `get_updates_processor` 是 Edge 同步服务噪音，可忽略。

## 部署 GitHub Pages

仓库 Settings → Pages → 选分支与站点目录 → 保存。前提：`.nojekyll` 已提交；CDN 需公网可达。

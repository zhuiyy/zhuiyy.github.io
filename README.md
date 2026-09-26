# zhuiyy.github.io

Zhuiy 的个人主页：音乐、GEB、观星，以及一些正在发生的念头。

## 修改「03 / NOW：正在关注」

打开 `index.html`，搜索 `03 / NOW`，下面的 `<ol class="thought-list">` 中每个 `<li>` 就是一条内容：

- `<time>`：左侧日期；需要时同时修改 `datetime` 和标签里的可见文字。
- `<p data-zh="…" data-en="…">中文正文</p>`：`data-zh` 是中文，`data-en` 是英文，标签中间的正文与 `data-zh` 保持一致。
- 最后的 `<span>`：右侧序号。复制或删除整个 `<li>` 就能增减条目。

## 页面结构

- `index.html`：内容与链接
- `style.css`：视觉和响应式布局
- `script.js`：中英文翻面、动画和全球按钮
- `assets/origin.jpg`：头像

## 修改「04 / TESTIMONIES：别人怎么看我？」

打开 `index.html`，搜索 `04 / TESTIMONIES`。每个 `<article class="testimony-card">` 是一条评价；复制整块即可继续追加。

标题旁的样本量会自动统计 `.testimony-card` 的数量；添加或删除评价卡时，不需要手动修改 `n`。

- `WITNESS / 001`：评价序号。
- `<strong>`：评价者姓名。
- 所有 `data-zh="…"` 与 `data-en="…"`：分别填写中英文版本，标签中间保留中文正文。
- `.witness-type` 与 `.witness-stamp`：评价者身份和小标签，可以自由发挥。

## 全球按钮计数

- 总数保存在站外计数服务中，固定标识为 `zhuiyy.github.io / press / global-human-button`；刷新页面和重新部署网站都不会重置。
- 浏览器会把服务器确认的总数缓存在 `localStorage` 的 `zhuiy-world-count-cache` 中；联网读取成功时始终以全球值为准，避免不同设备被旧缓存卡在不同数字。
- 暂时同步失败的点击保存在 `zhuiy-world-count-pending` 中，页面重新联网后会继续上传，不会只在当前设备上虚增。
- 计数使用大整数处理；从 `1e16` 开始自动改用科学计数法，避免数字撑破显示区域。

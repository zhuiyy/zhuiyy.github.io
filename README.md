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

全球按钮使用公开计数服务同步总数；服务不可用时会自动在当前设备上继续计数。

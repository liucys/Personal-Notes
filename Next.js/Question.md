### 1.如何使用 sass

1. 安装 sass

```js
yarn add sass
```

2. 在 `next.config.js` 文件中进行配置

```js
const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
```

3. 将 `*.module.css` 文件更改为 `*.module.scss` 文件，然后使用 sass 语法编写样式即可。

在 Next.js 中配置使用 less 与 antd

[使用的插件官方 github 地址](https://github.com/elado/next-with-less)

案例说明相关版本

```json
{
  "@ant-design/icons": "^4.7.0",
  "antd": "^4.20.2",
  "less": "^4.1.2",
  "less-loader": "^10.2.0",
  "next-with-less": "^2.0.5"
}
```

配置步骤：

- 第一步：初始化项目

  ```
  npx create-next-app [project-name]
  ```

- 第二步：安装相关依赖

  ```
    yarn add antd @ant-design/icons
    yarn add next-with-less
    yarn add less less-loader
  ```

- 第三步：配置 `next.config.js` 文件

```js
const withLess = require("next-with-less");
module.exports = withLess({});
```

- 第四步：将 相关`*.css`文件转为 `*.less`文件。
- 第五步：在 目录 `styles/globals.less`文件顶部引入 antd 样式

```less
@import "~antd/dist/antd.less";
```

- 第五步：可以直接在页面中使用 `antd` 组件了

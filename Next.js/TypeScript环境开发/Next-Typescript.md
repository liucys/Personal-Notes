构建 TypeScript 版本的 Next.js 项目

```
<!-- 项目初始化 -->
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

[配置工程环境](#配置工程环境)

### 配置工程环境

- 配置 ESLint,用于校验代码

第一步：vscode 开发工具安装 eslint 插件
第二步：项目安装 eslint（命令：yarn add eslint --D）
第三步：创建 .eslintrc.json 文件并配置:

```json
{ "extends": ["next/core-web-vitals", "eslint:recommended"] }
```

- 配置 Prettier，用于代码格式化。

第一步：vscode 开发工具安装 Prettier-Code formatter 插件
第二步：vscode 设置保存代码时自动格式化 "editor.formatOnSave": true,
第三步：在项目根目录下创建 .prettierrc 文件并配置

```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "htmlWhitespaceSeensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false,
  "printWidth": 80,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "vueIndentScriptAndStyle": false,
  "parser": "babel"
}
```

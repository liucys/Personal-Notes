在 Next.js 中配置使用 less 与 antd（配置后也还支持使用 css）

[使用的插件官方 github 地址](https://github.com/elado/next-with-less)

案例说明的最终配置的 `package.json` 文件版本

```json
{
  "name": "7th",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ant-design/icons": "^4.7.0",
    "antd": "^4.20.2",
    "clone-deep": "^4.0.1",
    "next": "12.1.6",
    "next-auth": "^4.3.4",
    "next-with-less": "^2.0.5",
    "react": "18.1.0",
    "react-dom": "18.1.0"
  },
  "devDependencies": {
    "eslint": "8.14.0",
    "eslint-config-next": "12.1.6",
    "less": "^4.1.2",
    "less-loader": "^10.2.0"
  }
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
    yarn add clone-deep
    yarn add next-with-less
    npm install less less-loader --save-dev
  ```

- 第三步：在根目录下创建目录文件 `/utils/lessConfig.js`

```js
const cloneDeep = require("clone-deep");

// this plugin finds next.js's sass rules and duplicates them with less
// it mimics the exact behavior of CSS extraction/modules/client/server of SASS
// tested on next@11.0.1 with webpack@5

const addLessToRegExp = (rx) =>
  new RegExp(rx.source.replace("|sass", "|sass|less"), rx.flags);

function patchNextCSSWithLess(
  nextCSSModule = require("next/dist/build/webpack/config/blocks/css")
) {
  // monkey patch next's regexLikeCss to include less files
  // overrides https://github.com/vercel/next.js/blob/e8a9bd19967c9f78575faa7d38e90a1270ffa519/packages/next/build/webpack/config/blocks/css/index.ts#L17
  // so https://github.com/vercel/next.js/blob/e8a9bd19967c9f78575faa7d38e90a1270ffa519/packages/next/build/webpack-config.ts#L54
  // has less extension as well
  nextCSSModule.regexLikeCss = addLessToRegExp(nextCSSModule.regexLikeCss);
}

patchNextCSSWithLess();

function withLess({ lessLoaderOptions = {}, ...nextConfig }) {
  return Object.assign({}, nextConfig, {
    /**
     * @param {import('webpack').Configuration} config
     * @param {*} options
     * @returns {import('webpack').Configuration}
     */
    webpack(config, opts) {
      // there are 2 relevant sass rules in next.js - css modules and global css
      let sassModuleRule;
      // global sass rule (does not exist in server builds)
      let sassGlobalRule;

      const isNextSpecialCSSRule = (rule) =>
        // next >= 12.0.7
        rule[Symbol.for("__next_css_remove")] ||
        // next < 12.0.7
        rule.options?.__next_css_remove;

      const cssRule = config.module.rules.find((rule) =>
        rule.oneOf?.find(isNextSpecialCSSRule)
      );

      if (!cssRule) {
        throw new Error(
          "Could not find next.js css rule. Please ensure you are using a supported version of next.js"
        );
      }

      const addLessToRuleTest = (test) => {
        if (Array.isArray(test)) {
          return test.map((rx) => addLessToRegExp(rx));
        } else {
          return addLessToRegExp(test);
        }
      };

      cssRule.oneOf.forEach((rule) => {
        if (rule.options?.__next_css_remove) return;

        if (rule.use?.loader === "error-loader") {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.use?.loader?.includes("file-loader")) {
          // url() inside .less files - next <= 11
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.type === "asset/resource") {
          // url() inside .less files - next >= 12
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.use?.includes?.("ignore-loader")) {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.test?.source === "\\.module\\.(scss|sass)$") {
          sassModuleRule = rule;
        } else if (rule.test?.source === "(?<!\\.module)\\.(scss|sass)$") {
          sassGlobalRule = rule;
        }
      });

      const lessLoader = {
        loader: "less-loader",
        options: {
          ...lessLoaderOptions,
          lessOptions: {
            javascriptEnabled: true,
            ...lessLoaderOptions.lessOptions,
          },
        },
      };

      let lessModuleRule = cloneDeep(sassModuleRule);

      const configureLessRule = (rule) => {
        rule.test = new RegExp(rule.test.source.replace("(scss|sass)", "less"));
        // replace sass-loader (last entry) with less-loader
        rule.use.splice(-1, 1, lessLoader);
      };

      configureLessRule(lessModuleRule);
      cssRule.oneOf.splice(
        cssRule.oneOf.indexOf(sassModuleRule) + 1,
        0,
        lessModuleRule
      );

      if (sassGlobalRule) {
        let lessGlobalRule = cloneDeep(sassGlobalRule);
        configureLessRule(lessGlobalRule);
        cssRule.oneOf.splice(
          cssRule.oneOf.indexOf(sassGlobalRule) + 1,
          0,
          lessGlobalRule
        );
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, opts);
      }

      return config;
    },
  });
}

module.exports = withLess;
module.exports.patchNext = patchNextCSSWithLess;
```

- 第四步：在根目录下配置 next.config.js 文件

```js
// the following 2 lines are specific to this repo. in your project use next-with-less directly
// const withLess = require("next-with-less");
const withLess = require("./utils/lessConfig");
withLess.patchNext(require("next/dist/build/webpack/config/blocks/css"));

module.exports = withLess({
  reactStrictMode: true,
  lessLoaderOptions: {
    // it's possible to use additionalData or modifyVars for antd theming
    // read more @ https://ant.design/docs/react/customize-theme
    // additionalData: (content) => `${content}\n@border-radius-base: 10px;`,

    lessOptions: {
      modifyVars: {
        // "primary-color": "#9900FF",
      },
    },
  },
});
```

- 第五步：将 `.module.css`文件转为 `.module.less`文件。
- 第六步：可以直接在页面中使用 `antd` 组件了

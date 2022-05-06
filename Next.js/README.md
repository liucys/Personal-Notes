[TOC]

### 什么是 [Next.js](https://www.nextjs.cn/)？

> Next.js 是一个面向生产使用的 React 框架。它为我们提供了许多开箱即用的特性，支持静态渲染/服务端渲染混用，支持 TypeScript，支持打包优化，支持动态路由，按路由加载等。

Next.js 内置的部分功能

- 直观的，基于页面的路由系统（支持动态路由）。
- 预渲染，支持在页面级的静态生成（SSG）和服务端渲染（SSR）。
- 自动代码拆分，提升页面加载速度。
- 具有经过优化的预取功能的客户端路由。
- 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库。
- 开发环境支持快速刷新。
- 利用 serverless function 及 API 路由构建 API 功能
- 完全可扩展。
- ......

Next.js 项目安装

```js
# 若没有全局安装next脚手架，则先全局安装
npm install -g create-next-app

# 然后在文件目录下创建Next项目
npx create-next-app <project name>

# 安装typescript版本的
npx create-next-app@latest --typescript

# 安装好初始项目后进入项目根目录下，运行命令启动
yarn dev
or
npm run dev
```

目录

- [什么是 Next.js？](#什么是-nextjs)
- [简单项目目录结构介绍](#简单项目目录结构介绍)
- [使用 src 目录](#使用-src-目录)
- [nextjs 配置绝对路径前缀引用](#nextjs-配置绝对路径前缀引用)
- [Nextjs 默认支持 styled-jsx 库，它是一个 CSS-in-JS 库语法](#nextjs-默认支持-styled-jsx-库它是一个-css-in-js-库语法)
- [Nextjs 默认也支持 sass 语法，但是需要手动安装 sass 库](#nextjs-默认也支持-sass-语法但是需要手动安装-sass-库)
- [选择 SSR 还是 SSG？](#选择-ssr-还是-ssg)
- [自定义 404 页面](#自定义-404-页面)

&nbsp;

### 简单项目目录结构介绍

- components 文件夹：这里是专门放置自己写的组件的，这里的组件不包括页面，指公用的或者有专门用途的组件。

  > 新的脚手架创建的默认已经不带 components 文件夹了，需要自己手动创建

- pages 文件夹：这里是放置页面的，在这里面创建的文件会自动根据 `二级目录名称以及其下的文件名称` 生成相应的路由，并在服务器端渲染，渲染好后进行数据同步。

  > 若是我们想要建立嵌套路由,如 `/user/profile`, 则只需要在该 `pages 文件夹`下创建 `user 文件夹`,然后 在该文件夹下`创建 profile.js` 文件即可。例如路径：`/pages/blog.js` ,则可以直接通过 `/blog` 进行页面访问

- public 文件夹： 这个是静态文件夹，比如项目需要的图片、图标和静态资源都可以放到这里。

  > 静态文件存放文件夹,存放在 `public` 文件夹下的静态文件可以直接通过路径 `/public/xxx` 的方式获取,例如有图片存放路径 `public/images/me.jpg `,则可以直接通过 `/images/me.jpg` 的方式引用此图片。

- styles 文件夹：存放公共样式文件（当然，要是在 pages 文件夹下的页面组件的样式文件也可存放，但是文件必须以 `.modeule.css结尾`）

  > 全局公共样式文件夹,该文件夹下默认存在两个文件 `globals.css`、`Home.module.css`。但是注意`globals.css` 文件只能在 `pages` 目录下的`_app.js` 文件中引入,它是整个项目的全局样式文件。

&nbsp;

### 使用 src 目录

在 nextjs 中，通过创建 src 目录，我们可以将 pages 目录放置在 src 目录下。

> 注意：当项目根目录下同时存在 src 目录一级 pages 目录时，只有 pages 目录起作用。
>
> 不能将 public 目录、components 目录、styles 目录放置在 src 目录下。

&nbsp;

### nextjs 配置绝对路径前缀引用

在开发中常常涉及到文件的引用，而有些文件的引用路径过长。我们可以通过配置绝对路径前缀的方式进行引用.

```js
// 在根目录下创建 jsconfig.json或tsconfig.json文件
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/service/*": ["service/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}

```

通过以上配置，我们在引用时

```js
// login.js文件中

// 原来的引用方式
import request from '../../service/request';
import Footer from '../../components/Footer';
import '../../styles/login.module.css';

// 优化后的引用方式
import request from '@/service/request';
import Footer from '@/components/Footer';
import '@/styles/login.module.css';

....
```

&nbsp;

### Nextjs 默认支持 styled-jsx 库，它是一个 CSS-in-JS 库语法

> 它允许你在 React 组件中编写 CSS，并且 CSS 样式将被限定（其他组件不会受到影响）。我们可以直接在组件界面实现区域通过 style 标签(该标签必须声明 jsx 属性)进行样式的嵌入声明。
> styled jsx 语法只能在自生组件中生效，不会透传给子组件。
> 注意：

```js
import React from "react";

export default function FirtsPost() {
  return (
    <div>
      <h1>First Post</h1>
      {/* 嵌入式的样式声明 */}
      <style jsx>
        {`
          h1 {
            color: red;
          }
        `}
      </style>
    </div>
  );
}
```

&nbsp;

### Nextjs 默认也支持 sass 语法，但是需要手动安装 sass 库

> yarn add sass

进行配置使用 sass

```js
// 在next.config.js文件中
const path = require("path");
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePath: [path.join(__dirname, "styles")],
  },
};
```

&nbsp;

### 选择 SSR 还是 SSG？

> 如果页面内容真动态(例如，来源数据库，且经常变化)， 使用 getServerSideProps 方法的 SSR。
> 如果是静态页面或者伪动态(例如，来源数据库，但是不变化)，可以酌情使用 getStaticProps 方法的 SSG。

&nbsp;

### 自定义 404 页面

在 pages 目录下创建 404.js 文件

```js
import React from "react";
import Link from "next/link";
import styles from "../styles/404.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <h1>This page was not found</h1>
      <p>
        Go back to the{" "}
        <Link href="/">
          <a>homePage</a>
        </Link>
      </p>
    </div>
  );
}
```

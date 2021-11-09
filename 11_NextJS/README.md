[TOC]

#### 什么是 [Next.js](https://www.nextjs.cn/)？

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
```

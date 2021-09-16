### 认识 Vue3.0

#### 1.了解相关信息

> Vue3.0 正式版本发布在 2020 年 9 月份；Vue3.0 支持大多数 Vue2.0 的特性,你可以在 Vue3.0 中写 Vue2.0 的代码；Vue3.0 能够更好的支持 Typescript

#### 2.性能方面的提升

- 打包大小减少 4%
- 初次渲染增快 55%,更新渲染增快 133%
- 内存占用减少 54%
- diff 算法优化
  > Vue2.0 中的虚拟 DOM 是进行全量的对比,Vue3.0 中新增了静态标记(PatchFlag),在与上次的虚拟节点进行对比时,只对比带有 patch flag 标记的节点,并且可以通过 flag 的信息得知当前节点要对比的具体内容.
- hoistStatic 静态提升
  > Vue2.0 中无论元素是否参与更新,每次都会重写创建,然后再渲染;而在 Vue3.0 中,对于不参与更新的元素,会做静态提升,只会被创建一次,在渲染时直接复用即可.
- cachHandlers 事件侦听器缓存
  > 默认情况下 onCLick 会被视为动态绑定,所以每次都会去追踪它的变化,但是因为是同一个函数,所以没有追踪比变化,直接缓存起来复用即可
- ssr 渲染
  > 当有大量静态的内容的时候,这些内容会被当做纯字符串推进一个 buffer 里面.即使存在动态的绑定,会通过模板插值嵌入进去.这样会比通过虚拟 dom 来渲染的快上很多很多。当静态内容大到一定的量级时,会用\_createStaticVNode 方法在客户端去生成一个 static node,这些静态 node 会被直接 innerHtml,久不需要创建对象,然后根据对象渲染了.
- 使用 Proxy 代替 defineProperty 实现数据响应式

- 重写虚拟 DOM 的实现和 Tree-Shaking

&nbsp;

#### 3.新增使用特性

- Composition(组合)API

  > setup、ref、reactive、computed、watch、生命周期新写法、provide、inject 等

- 新的组件
  > Fragment --文档碎片、Teleport -- 瞬移组件的位置、Suspense -- 异步加载组件的 loading 界面等
- 其他 API 更新
  > 全局 API 的修改、将原来的全局 API 转移到应用对象、模板语法变化等

&nbsp;

#### 项目安装

首先先全局安装(升级) vue 脚手架

```js
# 安装脚手架
npm install -g @vue/cli
# 或者
yarn global add @vue/cli

# 升级脚手架
npm update -g @vue/cli
# 或者
yarn global upgrade --latest @vue/cli
```

然后进入一个空文件夹下创建项目

```js
vue create 项目名称
# 然后根据自己的需求选择想要安装的内容即可

# 若是需要使用旧版本(2.x版本),可以先全局安装一个桥接工具
npm install -g @vue/cli-init
# 然后创建2.x版本的项目
vue init webpack 项目名称
```

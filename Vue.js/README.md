Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其他大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心只关注视图层，其不仅易于上手，还便于与第三方库或即有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。
[---更多信息](https://github.com/vuejs/awesome-vue#libraries--plugins)

&nbsp;

### MVC 了解

MVC 全称为 `Model View Control`
Model：表示模型，即数据层

View： 表示视图层，即用户所见的界面

Control：表示控制器（使 Model 与 View 相关联），即如何根据视图与用户交互后改变数据

&nbsp;

### MVVM 了解

MVVM 全称为`Model View ViewModel`简称

Model：表示数据存储

View：表示页面展示，视图层

ViewModel：表示业务逻辑处理，对数据加工后交给视图战术。

&nbsp;

### Vue 的部分特点

- 解耦视图和数据
- 可复用组件
- 前端路由技术
- 状态管理（Vuex）
- 虚拟 DOM
- ...

&nbsp;

### Vue 安装使用

- 通过 CDN 进行引入

```js
// 开发环境
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

// 生产环境
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
```

- 通过 npm 包安装引入

```js
npm install vue
// or
yarn add vue
```

- 使用 Vue 官方脚手架进行项目构架开发

```js
# 安装最新版本项目
// 全局安装vue脚手架
npm install -g @vue/cli
// 创建项目
vue create projectName

# 安装2.x版本项目
// 全局安装桥接工具
npm install -g @vue/cli-init
// 拉取2.x版本
vue init webpack projectName
```

&nbsp;

### 一个简单的 html 结构的 vue 构建

```html
<body>
  <!-- vue实例对象控制区域 -->
  <div id="app">
    <!-- vue规定在vue实例对象控制区域中使用data处声明的变量数据,我们通过 {{变量名}} 的方式进行声明使用 -->
    <h1>{{message}}</h1>
    <button @click="handleClick">Click Me</button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
  <script>
    const app = new Vue({
      // el属性通过 id或class 声明挂载vue实例对象控制的元素区域
      el: "#app",
      // data属性声明vue实例对象所使用的数据的初始化状态（在组件当中,data必须是一个函数,因为这样才能防止复用组件时产生数据干扰）
      data: {
        message: "Hello,Vue",
      },
      // methods属性用于声明vue实例对象中可以用到的方法
      methods: {
        handleClick() {
          this.message = "Vue Example!";
        },
      },
      // component属性用于声明挂载该实例对象下的子组件
      component: {},
      ...
    });
  </script>
</body>
```

&nbsp;

### Vue 生命周期

```js
创建阶段
# beforeCreate
# created
# beforeMount
# mounted

运行阶段
# beforeUpdate
# updated

销毁阶段
# beforeDestroy
# destroyed


# beforeCreate
创建之前，在beforeCreate生命周期执行的时候，data和methods中的数据都还没有初始化，不能访问data数据

# created
创建之后，data和methods中的数据已经初始化，此时可以访问data数据
一般在这个函数中发起ajax请求

# beforeMount
挂载之前，表示模板已经在内存中编译完成，但尚未把模板渲染到页面中。
此时还没有渲染用数据生成的新dom

# mounted
表示内存中的模板，已经真实的挂载到了页面中，用户已经可以看到渲染好的页面了
此时可以访问dom

# beforeUpdate
当且仅当data被修改时才触发这个生命周期函数，但此时仅仅是数据被修改，页面还未更新。
如果修改的data数据并没有在模板中使用，也不会触发更新

# updated
会根据新数据生成最新的内存DOM树，重新渲染到真实的页面中去，此时的data数据和页面已完成同步

# beforeDestroy
当执行beforeDestory钩子函数的时候，Vue实例就已经从运行阶段，进入到了销毁阶段。
当执行beforeDestory的时候，实例身上所有的data和所有的methods，以及过滤器、指令...都处于可用状态，此时还没有真正执行销毁过程。
销毁前，解除数据绑定、事件监听等等等等

# destroyed
当执行到destoryed函数的时候，组件已经被全部销毁了，data与methods均不可用。
更改data数据，页面不会更新
```

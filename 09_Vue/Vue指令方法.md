[TOC]

在 Vue 中,提供了许多指令用于帮助我们快速开发实现

### v-bind 指令

​v-bind 指令用于我们动态绑定属性值,当我们需要动态绑定一个元素对象的属性值时,就可以通过 v-bind 指令实现

语法:

> v-bind:属性名称="vue 实例对象中的属性变量"

语法糖（简写方式）:

> :属性名称="Vue 实例对象中的属性变量"

```html
<div id="app">
  <!--使用v-bind指令动态绑定属性title-->
  <p v-bind:title="title">这是一个段落</p>

  <!-- 语法糖简写 -->
  <p :title="title">这是一个新段落</p>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      title: "动态属性title",
    },
  });
</script>
```

&nbsp;

### v-on 指令

v-on 指令用于我们进行事件绑定,当我们需要为某个元素添加事件时,就可以通过 v-on 指令进行实现

语法:

> v-on:事件类型="事件方法"

语法糖(简写方式):

> @事件类型="事件方法"

```html
<div id="app">
  <!-- 通过v-on指定绑定一个点击事件 -->
  <button v-on:click="handleClick">点击一下</button>

  <!-- 语法糖简写 -->
  <button @click="handleClick">点击一下</button>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {},
    methods: {
      handleClick() {
        console.log("我被点击了");
      },
    },
  });
</script>
```

&nbsp;

### v-if,v-else-if,v-else 指令

v-if,v-else-if,v-else 指令用于条件渲染元素,即通过判断条件是否满足来决定是否渲染指定元素及其内容

语法:

> v-if="布尔值条件"

```html
<div id="app">
  <ul>
    <li v-if="score>=90">优秀</li>
    <li v-else-if="score>=80">良好</li>
    <li v-else-if="score>=70">中等</li>
    <li v-else-if="score>=60">及格</li>
    <li v-else>差评</li>
  </ul>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: { score: 89 },
  });
</script>
```

&nbsp;

### v-for 指令

v-for 指令,用于循坏渲染,即对于数组数据的循坏迭代

语法:

> v-for="(item,index) in 数组变量"
>
> item 表示迭代的元素本身,index 表示迭代的元素下标

```html
<div id="app">
  <ul>
    <!-- v-for 迭代循环 -->
    <li v-for="(item,index) in books">书名:《{{item.name}}》,序号:{{index}}</li>
  </ul>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      books: [
        { name: "小说", id: "1" },
        { name: "动漫", id: "2" },
        { name: "视频", id: "3" },
      ],
    },
  });
</script>
```

&nbsp;

### v-show 指令

v-show 指令作用与 v-if 指令相同,都是动态渲染元素

语法:

> v-show="布尔条件"

```html
<div id="app">
  <p v-show="flag">v-show指令动态渲染元素</p>
</div>

const app=new Vue({ el:'#app', data:{ flag:true } })
```

&nbsp;

### v-if 与 v-show 的区别

> v-if 与 v-show 的作用都在与动态决定元素的渲染,但是两者在渲染方式上存在不同点

​ `v-if` 的动态渲染在于元素的创建与删除，即决定渲染元素时，就创建这个元素，当不渲染元素时，就删除这个元素。

​ `v-show` 的动态渲染在于更改元素的 `display` 样式属性，当决定渲染元素时，设置 `display:block`；当不渲染元素时，设置 `display:none`。

> 注意点：当我们需要频繁的切换（隐藏与显示）元素时，推荐使用 `v-show` 指令；当我们只需要少许切换（隐藏与显示）元素时，推荐使用 `v-if`。

&nbsp;

### v-pre 指令

v-pre 指令用于渲染原始数据样式。即不使用 `{{变量名}}`的方式进行数据渲染，而是将其原封不动的显示出来。

​ 语法:

> 添加 v-pre 指令属性即可

```html
<div id="app">
  <!-- 原封不动渲染出 {{message}}，不会发生底层的数据渲染 -->
  <p v-pre>{{message}}</p>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: { message: "Hello,Vue" },
  });
</script>
```

&nbsp;

### v-cloak 指令

v-cloak 指令用于强化{{变量名}}语法,防止数据未渲染时出现的闪屏现象.注意:使用该指令需要同时在 style 样式设置中进行声明

语法:

> v-cloak

```html
<style>
  [v-cloak] {
    display: none;
  }
</style>

<!-- 直接添加 v-cloak指令属性，同时style中需要设置有 v-cloak 样式 -->
<div v-cloak>{{ message }}</div>
```

&nbsp;

### v-once 指令

v-once 指令用于声明该指令所在元素的内容只进行一次渲染,随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。

语法:

> 直接添加指令属性 v-once 即可

```html
<!-- 单个元素 -->
<span v-once>This will never change: {{msg}}</span>
<!-- 有子元素 -->
<div v-once>
  <h1>comment</h1>
  <p>{{msg}}</p>
</div>
<!-- 组件 -->
<my-component v-once :comment="msg"></my-component>
<!-- `v-for` 指令-->
<ul>
  <li v-for="i in list" v-once>{{i}}</li>
</ul>
```

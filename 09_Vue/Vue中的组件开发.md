组件化开发是 Vue 中一个十分重要的实现功能,通过将某个功能抽离成一个独立的模块,从而去实现它的多次使用.

&nbsp;

### 全局组件

全局组件的创建使用分成三个步骤：

1. 创建组件构造器对象

调用 Vue.extend()方法创建组件构造器

语法:

> const 构造器对象=Vue.extend({ ​ template:"该组件需要实现的前端内容模板" ​ })

2. 注册组件

调用 `Vue.component()`方法注册组件

语法:

> Vue.component('自定义组件名称',构造器对象)

3. 使用组件

在 Vue 实例范围内使用组件

<步骤二中自定义组件名></步骤二中自定义组件名>

案例:

```html
<div id="app">
  <!-- 使用组件 -->
  <Com></Com>
  <Com></Com>
</div>

<script>
  // 创建组件构造器对象
  const cpnC = Vue.extend({
    template: `
				<div>
					<h1>Hellp</h1>
				</div>
	`,
  });

  // 注册组件
  Vue.component("Com", cpnC);

  const app = new Vue({
    el: "#app",
    data: {},
  });
</script>

// 注意:以上步骤实现的组件为全局组件,在所有Vue实例对象区域中都可以使用.
```

&nbsp;

### 2.局部组件(子组件)

​ 局部组件的创建与使用分三个步骤

1. 创建组件构造器对象

调用 Vue.extend()方法创建组件构造器

语法:

```js
const 构造器对象 = Vue.extend({
  template: "该组件需要实现的前端内容模板",
});
```

2. 在指定 Vue 实例对象中将组件注册为局部组件

通过 Vue 实例对象中的 components 属性声明注册局部组件

语法:

```js
const app=new Vue({
​ el:'属性选择器',
​ data:{},
​ components:{ // 注册局部组件
​ '自定义组件名':组件构造器对象
​ }
​ })
```

3. 使用组件

在 Vue 实例范围内使用组件

> <步骤二中自定义组件名></步骤二中自定义组件名>

案例:

```html
<div id="app">
  <!-- 使用组件 -->
  <Com></Com>
  <Com></Com>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
  // 创建组件构造器对象
  const cpnC = Vue.extend({
    template: `<div>
          <h1>Hello</h1>
        </div>
        `,
  });

  const app = new Vue({
    el: "#app",
    data: {},
    methods: {},
    computed: {},
    components: {
      // 组成局部组件
      Com: cpnC,
    },
  });
</script>
```

&nbsp;

### 3.组件注册语法糖（简写形式）

#### 全局组件创建语法糖

1. 通过 Vue.component()方法创建并注册组件

语法:

```js
Vue.component('自定义组件名称',{
​ template:"组件功能模板"
​ })
```

2. 使用组件

在 Vue 实例范围内使用组件

> <步骤二中自定义组件名></步骤二中自定义组件名>

简单案例：

```html
<div id="app">
  <!-- 使用组件 -->
  <Com></Com>
</div>

<script>
  // 创建全局组件,并注册
  Vue.component("Com", {
    tempalte: `<div>
	<h1>Hello</h1>
</div>`,
  });
  const app = new Vue({
    el: "#app",
    data: {},
    methods: {},
  });
</script>
```

&nbsp;

#### 局部组件（子组件）创建语法糖

1. 在指定 Vue 实例对象中,在其 components 属性上创建注册组件

语法:

```js
const app=new Vue({
​   el:'属性选择器',
​   data:{},
​   components:{
​       '自定义组件名':{
​           template:`组件实现功能模板`
​        }
​    }
})
```

2. 在 Vue 实例控制范围内使用组件

> <自定义组件名称></自定义组件名称>

简单案例：

```html
<div id="app">
  <!-- 使用组件 -->
  <Com></Com>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {},
    components: {
      // 创建注册组件
      Com: {
        template: `
					<div>
						<h1>很爱很爱你</h1>
					</div>
				`,
      },
    },
  });
</script>
```

&nbsp;

### 4.组件功能模板抽离实现

通过在 template 标签中实现组件功能模板

1. 在`<template id="cpnTemp"></template>`标签中定义组件功能模板

```html
<template id="自定义id值">
  <div>
    <h1>我是组件标题</h1>
    <div>我是组件内容</div>
  </div>
</template>
```

2. 在组件注册时,通过 template 标签的 id 使其与组件关联

```html
<template id="customTemplate"> </template>

<script>
  // 若声明全局组件
  Vue.component('自定义组件名',{
      template:"#步骤一中的自定义id"; // 将组件与模板关联
  })

  // 若声明局部组件
  const app=new Vue({
  	el:'属性选择器',
  	data:{},
  	components:{
  		'自定义组件名称':{
  			tempalte:"步骤一中的自定义id"
  		}
  	}
  })
</script>
```

3. 使用组件

> <步骤二自定义组件名></步骤二自定义组件名>

简单实现案例：

```html
<body>
  <div id="app">
    <!-- 使用组件 -->
    <Com></Com>
    <Com></Com>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <!-- 组件功能模板 -->
  <template id="tempCpn">
    <div>
      <h1>组件标题</h1>
      <div>组件内容</div>
    </div>
  </template>
  <script>
    // 全局组件
    Vue.component("Com", {
      template: "#tempCpn",
    });

    const app = new Vue({
      el: "#app",
      data: {},
      methods: {},
      computed: {},
      components: {
        Com: {
          // 局部组件(子组件)
          template: "#tempCpn",
        },
      },
    });
  </script>
</body>
```

&nbsp;

### 组件属性解析

组件相当于一个小型的 Vue 实例,它也拥有着属于自己的属性

- template 属性

该属性用于声明组件的功能实现模板

- data

组件也拥有着属于自己的数据控制区域,因此存在着属性 data 用于声明组件自己的数据.

> 注意：与 Vue 实例不同的是，`组件的 data 必须是一个函数`，然后组件的初始数据声明必须在 data 函数返回的对象中声明。

语法:

```js
// 全局组件
Vue.component("Com", {
  template: "#tempCpn",
  data() {
    return {
      message: "组件初始数据声明",
    };
  },
});
```

- methods 属性

组件也拥有着属于自己的方法声明区域,因此存在 methods 属性,该属性的使用与 Vue 实例中的 methods 属性使用方式相同。

简单案例：

```html
<body>
  <div id="app">
    <!-- 使用组件 -->
    <Com></Com>
    <Com></Com>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <!-- 组件功能模板 -->
  <template id="tempCpn">
    <div>
      <h1 @click="handleClick">{{message}}</h1>
      <div>组件内容</div>
    </div>
  </template>
  <script>
    // 全局组件
    // Vue.component("Com", {
    //   template: "#tempCpn", // 关联功能模板
    //   data(){ // 组件数据控制域
    //     return {
    //       message:'Hello'
    //     }
    //   },
    //   methods: { // 组件方法域
    //     handleClick(){
    //       alert('哈哈')
    //     }
    //   },
    // });

    const app = new Vue({
      el: "#app",
      data: {},
      methods: {},
      computed: {},
      components: {
        Com: {
          // 局部组件(子组件)
          template: "#tempCpn", // 关联模板
          data() {
            // 组件数据域
            return {
              message: "小时候",
            };
          },
          methods: {
            // 组件方法域
            handleClick() {
              alert("点我");
            },
          },
        },
      },
    });
  </script>
</body>
```

有时候我们在操作组件实现功能时,存在数据之间的传递,这就是组件间的通信

&nbsp;

### 组件间的通信 —— 父传子

父传子的通信是通过父组件传递数据,然后子组件通过自身属性 `props` 来进行接收数据，做相应的处理实现的。

`props` 属性设置数据内容变量的定义方式有两种方式：

1. 字符串数组类型,数组中的字符串就是用于接收父组件所传数据的自定义变量名称(这种方式不常用)。

> props:['自定义存储变量名 1','自定义存储变量名 2',...]

2. 对象类型，使用对象类型的定义方式我们可以设置父组件传递数据的类型，也可以设置自定义存储变量名的默认值等(推荐使用这种方式)

```js
// 接收从父组件传递过来的数据，这里的属性名称必须与父组件中使用组件时的传递属性名一致
props:{
    username: {
        type: String, // 接收的数据类型
        default: "XiaoMing", // 默认值
        required: false, // 是否是必传数据
    },
    // 接收数组或对象类型的数据时，default属性必须是一个函数，默认值为其返回的数据
    list_name: {
        type: Array, // 接收的数据类型为数组类型
        default() {
            return []; // 默认值为空数组
        },
        required: true, // 是否必传
    },
},
```

实现步骤:

1. 创建一对父、子组件

2. 在父组件的 data 属性中准备需要传递的数据;在子组件的 props 属性中设置一个变量用于接收父组件的数据。

3. 在使用自定义组件时,在组件名称上通过 v-bind 绑定子组件的 props 属性中的变量名,值为父组件中的数据变量名。（这里数据就实现了数据信息的传递工作）

   > <组件名 v-bind:子组件自定义存储变量名="父组件数据变量名"></组件名>

4. 在子组件的 html 实现功能 template 模板中使用 props 属性中设置的相应的自定义变量（这里就是使用从父组件获取到的数据）

简单实现案例:

```html
<body>
  <!-- vue实例对象控制区域 -->
  <div id="app">
    <!-- vue规定在vue实例对象控制区域中使用data处声明的变量数据,我们通过 {{变量名}} 的方式进行声明使用 -->
    <h1>{{message}}</h1>
    <button @click="handleClick">Click Me</button>
    <!-- 使用组件,通过v-bind指令向子组件传递数据，属性名称必须与组件中props下定义的属性名一致 -->
    <my-component :list_name="girlList"></my-component>
  </div>
  <!-- 组件内容模板 -->
  <template id="customTemplate">
    <div>
      <h1>{{msg}}</h1>
      <p>Hello,{{username}}</p>
      <!-- v-for指令循环渲染 -->
      <ul>
        <li v-for="item in list_name" :key="item">{{item}}</li>
      </ul>
    </div>
  </template>
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
  <script>
    const app = new Vue({
      // el属性通过 id或class 声明挂载vue实例对象控制的元素区域
      el: "#app",
      // data属性声明vue实例对象所使用的数据的初始化状态（在组件当中,data必须是一个函数,因为这样才能防止复用组件时产生数据干扰）
      data: {
        message: "Hello,Vue",
        girlList: ["艾米利亚", "伊利亚", "英梨梨"],
      },
      // methods属性用于声明vue实例对象中可以用到的方法
      methods: {
        handleClick() {
          this.message = "Vue Example!";
        },
      },
      // components属性用于声明挂载该实例对象下的子组件
      components: {
        "my-component": {
          template: `#customTemplate`,
          data() {
            return {
              msg: "children component",
            };
          },
          // 接收从父组件传递过来的数据，这里的属性名称必须与父组件中使用组件时的传递属性名一致
          props: {
            username: {
              type: String, // 接收的数据类型
              default: "XiaoMing", // 默认值
              required: false, // 是否是必传数据
            },
            // 接收数组或对象类型值时，default属性必须是一个函数，默认值为其返回的数据
            list_name: {
              type: Array, // 接收的数据类型为数组类型
              default() {
                return []; // 默认值为空数组
              },
              required: true, // 是否必填
            },
          },
        },
      },
    });
  </script>
</body>
```

&nbsp;

### 组件间的通信 —— 子传父

子传父的通信是通过子组件自定义事件进行的（即传递一个事件,然后通过函数传参实现）

实现方法:

> 子组件向父组件中传递消息通过自定义事件：即子组件通过在自身的事件执行方法中使用 `this.$emit('自定义事件名称',需要传递的内容)`，向父组件发射一个携带了内容的自定义事件。然后父组件中在组件使用时监听这个自定义事件,然后在父组件中通过事件处理方法的参数获取到传递的数据。

实现步骤:

1. 子组件自身触发事件，在这个事件执行方法中通过调用 `this.$emit('自定义事件名称',传递的信息内容)`这个方式向父组件发送信息。

2. 在 Vue 实例范围内使用组件时，在`组件上通过 v-on 监听子组件中设置的自定义事件`，事件的执行方法在父组件中定义，在父组件中处理自定义事件的带参数执行方法(这个参数用于接收传递过来的信息)。

简单实现案例：

```html
<body>
  <!-- vue实例对象控制区域 -->
  <div id="app">
    <!-- vue规定在vue实例对象控制区域中使用data处声明的变量数据,我们通过 {{变量名}} 的方式进行声明使用 -->
    <h1>{{message}}</h1>
    <!-- 使用组件,通过v-on指令监听子组件传递数据事件获取数据 -->
    <my-component @data-transfer="handleChildrenEvent"></my-component>
  </div>
  <!-- 组件内容模板 -->
  <template id="customTemplate">
    <div>
      <h1>{{msg}}</h1>
      <!-- 触发点击事件，向父组件传递消息 -->
      <ul>
        <li v-for="item in childrenData" :key="item" @click="handleClick(item)">
          {{item}}
        </li>
      </ul>
    </div>
  </template>
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
        handleChildrenEvent(value) {
          console.log(`子组件中点击了：${value}`);
        },
      },
      // components属性用于声明挂载该实例对象下的子组件
      components: {
        // 定义子组件
        "my-component": {
          template: `#customTemplate`,
          data() {
            return {
              msg: "children component",
              childrenData: ["Vue", "React", "C#", "CSS"],
            };
          },
          methods: {
            handleClick(value) {
              // 自定义事件dataTransfer，将被点击的内容传递给父组件
              this.$emit("data-transfer", value);
            },
          },
        },
      },
    });
  </script>
</body>
```

注意：在使用 `this.$emit('自定义事件名',传递的数据)`方法向父组件传递数据时，这里的 `自定义事件名不要使用驼峰命名法`，会出现问题。

&nbsp;

### 组件间的访问 —— 父组件访问子组件

父组件访问子组件有两种方法：（1）`this.$children`（不推荐使用，子组件的下标位置可变动）；（2）`this.$refs`（推荐使用这种方法）

- `this.$children` 方法返回值是一个伪数组，数组里面的元素就是在父组件下挂载注册的子组件（即:[子组件 1,子组件 2,子组件 3,...]）。当我们需要在父组件中调用某个子组件的方法、变量、属性时。通过使用 `this.$children[该子组件的下标].需要调用的方法/变量` 这种形式来使用。

语法:

> `this.$children[指定子组件所在下标].指定子组件中的方法/数据/函数`

- `this.$refs` 方法是一个对象类型，在默认情况下是一个空对象。只要我们在组件标签中添加 `ref="自定义组件标识名"` 属性，我们就可以通过 `this.$refs.自定义组件标识名.需要调用的子组件方法/变量/函数`这种方式访问子组件。

语法:

> `<组件名 ref="自定义标识"></组件名>`

​ 然后在父组件的执行方法中通过`​this.$ref.自定义标识.子组件中的方法/数据/函数`的方式使用子组件中的内容

简单实现案例：

```html
<body>
  <!-- vue实例对象控制区域 -->
  <div id="app">
    <!-- vue规定在vue实例对象控制区域中使用data处声明的变量数据,我们通过 {{变量名}} 的方式进行声明使用 -->
    <h1>{{message}}</h1>
    <button @click="handleClick">Click Me</button>
    <!-- 使用组件,通过ref属性标识组件 -->
    <my-component ref="myComponent"></my-component>
  </div>
  <!-- 组件内容模板 -->
  <template id="customTemplate">
    <div>
      <h1>{{msg}}</h1>
      <ul>
        <li v-for="item in childrenData" :key="item">{{item}}</li>
      </ul>
    </div>
  </template>
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
        // 在执行方法中调用子组件中的方法、变量等
        handleClick() {
          /**
           * 使用 this.$children方式
           * 不推荐使用该方式，因为子组件的下标位置是可变动的
           * **/
          this.$children[0].changeMsg();

          /**
           * 使用 this.$refs方式
           * 推荐使用该方式
           * **/
          this.message = this.$refs.myComponent.title;
        },
      },
      // components属性用于声明挂载该实例对象下的子组件
      components: {
        // 定义子组件
        "my-component": {
          template: `#customTemplate`,
          data() {
            return {
              msg: "children component",
              childrenData: ["Vue", "React", "C#", "CSS"],
              title: "GRAVUAL™ - Graphic",
            };
          },
          methods: {
            // 子组件方法
            changeMsg() {
              this.msg = "new children component title";
            },
          },
        },
      },
    });
  </script>
</body>
```

&nbsp;

### 组件间的访问 —— 子组件访问父组件、子组件访问根组件（即 Vue 实例对象）

子组件访问父组件通过 `this.$parent`，子组件访问根组件（即 Vue 实例对象）通过`this.$root`。

语法：

> `this.$parent.需要调用的父组件变量/函数/方法等名称`
>
> `this.$root.需要调用的根组件变量/函数/方法等名称插槽的使用`

简单实现案例：

```html
<body>
  <!-- vue实例对象控制区域 -->
  <div id="app">
    <!-- vue规定在vue实例对象控制区域中使用data处声明的变量数据,我们通过 {{变量名}} 的方式进行声明使用 -->
    <h1>{{message}}</h1>
    <!-- 使用组件 -->
    <my-component></my-component>
  </div>
  <!-- 组件内容模板 -->
  <template id="customTemplate">
    <div>
      <h1>{{msg}}</h1>
      <!-- 监听点击事件 -->
      <button @click="handleClick">Children Component</button>
    </div>
  </template>
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
        // 组件事件
        changeTitle(param) {
          this.message = param;
        },
      },
      // components属性用于声明挂载该实例对象下的子组件
      components: {
        // 定义子组件
        "my-component": {
          template: `#customTemplate`,
          data() {
            return {
              msg: "children component",
              childrenData: ["Vue", "React", "C#", "CSS"],
              title: "GRAVUAL™ - Graphic",
            };
          },
          methods: {
            // 子组件方法
            handleClick() {
              // 使用 this.$parent调用父组件的方法并传递参数
              this.$parent.changeTitle(this.title);
            },
          },
        },
      },
    });
  </script>
</body>
```

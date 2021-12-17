`v-bind` 指令用于动态绑定属性,这对于我们开发十分有益,可以帮助我们降低实现需求的复杂程度.

&nbsp;

### v-bind 动态绑定 class 属性

1. v-bind 指令通过对象类型动态绑定 class 属性

语法:

> v-bind:class="{ 类名 1:布尔值变量 1, 类名 2:布尔值变量 2,...}"

```html
<style>
  .active {
    font-size: 30px;
  }
  .colorBlue {
    color: blue;
  }
</style>

<div id="app">
  <h2 v-bind:class="{active:flag1,colorBlue:flag2}">
    v-bind动态绑定class属性(对象实现方式)
  </h2>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      flag1: true,
      flag2: false,
    },
  });
</script>
```

2. v-bind 指令通过数组类型动态绑定 class 属性

语法:

> ​v-bind:class="[ '类名 1', '类名 2', '类名 3', ... ]"
>
> 或者
>
> v-bind:class="[变量 1,变量 2,变量 3,...]"

```html
<style>
  .active {
    color: red;
  }
  .colorBlue {
    color: blue;
  }
  .fontSize {
    font-size: 30px;
  }
</style>

<div id="app">
  <!-- 通过数组类型直接绑定class属性 -->
  <p v-bind:class="['active','fontSize']">
    v-bind:class="['类名1','类名2','类名3',...]"
  </p>

  <!-- 通过数组变量类型动态绑定class属性 -->
  <p v-bind:class="[fontClass,colorClass]">
    v-bind:class="[类名变量1,类名变量2,类名变量3,...]"
  </p>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      fontClass: "fontSize",
      colorClass: "colorBlue",
    },
  });
</script>
```

&nbsp;

### v-bind 动态绑定 style 属性 css 样式

1. v-bind 指令通过对象类型动态绑定 style 属性 css 样式

语法:

> v-bind:style="{css 样式名 1:css 样式值变量名 1,css 样式名 2:css 样式值变量名 2,...}"

```html
<div id="app">
  <p v-bind:style="{color:'red',fontSize:'18px'}">
    v-bind:style="{样式名:样式值}",直接写死样式
  </p>

  <p v-bind:style="{color:colorStyle,fontSize:fontStyle}">
    v-bind:style="{样式名:样式值变量名}",动态绑定样式
  </p>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      fontStyle: "22px",
      colorStyle: "blue",
    },
  });
</script>
```

2. v-bind 指令通过数组类型动态绑定 style 属性 css 样式

语法:

> v-bind:style="[css 样式属性对象变量 1,css 样式属性对象变量 2,...]"

```html
<div id="app">
  <p v-bind:style="[styleCss]">
    v-bind:style="[css样式属性对象变量1,css样式属性对象变量2,...]"
  </p>
</div>

<script>
  const app = new Vue({
    el: "#app",
    data: {
      styleCss: {
        color: "red",
        fontSize: "19px",
        fontWeight: "bold",
      },
    },
  });
</script>
```

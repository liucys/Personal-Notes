[TOC]

JQuery 是一个快速简洁的 javascript 库,其设计宗旨是" write Less,Do More", 即倡导写更少的代码,做更多的实现.

jQuery 封装了 javascript 常用的功能代码,优化了 DOM 操作,事件处理,动画设计和 Ajax 交互.

优点:

- 轻量级：核心文件才几十 kb，不会影响页面加载速度
- 跨浏览器兼容：基本兼容了现在主流的浏览器
- 链式编程，隐式迭代
- 对事件，样式，动画支持，大大简化了 DOM 操作。
- 支持插件扩展开发，有着丰富的第三方的插件：树形菜单、日期控件、轮播图等。
- 免费，开源

引用 jQuery:

```html
<!-- 开发版 CDN引用 -->
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>

<!-- 线上版 CDN引用 -->
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
```

简单使用案例：

```html
<body>
  <h1>这是一段文本标题</h1>
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js"></script>
  <script>
    // $(function(){}相当于原生js中的onload事件声明(表示等待页面加载完毕再执行里面的代码内容)
    $(function () {
      // 隐藏h1标签
      $("h1").hide();
    });
  </script>
</body>
```

&nbsp;

### jQeury 的顶级对象

`$` 符号是 jQuery 的别称,在代码中可以使用 jQuery 代替 $ 符号,但在开发中,为了简便,通常使用 $ 符号.

`$` 符号是 jQuery 的顶级对象,相当于原生 javascript 中的 window,把元素利用 `$` 包装成 jQuery 对象,就可以调用 jQuery 的方法.

```js
$(() => {
  // 当页面加载完毕后隐藏h1标签
  $("h1").hide();
});

// 等同于;
jQuery(() => {
  // 当页面加载完毕后,隐藏h1标签
  jQuery("h1").hide();
});
```

&nbsp;

### jQuery 对象和原生 DOM 对象

用原生 js 获取来的对象就是 DOM 对象

```js
// box就是DOM对象
const box = document.querySelector("div");
```

jQuery 方法获取到的元素就是 jQuery 对象

```js
// box就是jQuery对象
const box = $("div");
```

jQuery 对象的本质是：`利用 $ 对 DOM 对象进行包装后产生的对象（伪数组形式存储）`

`jQuery 对象只能使用 jQuery 的方法，不能使用原生 DOM 对象的属性和方法`；原生的 DOM 对象不能使用 jQuery 的方法。

&nbsp;

### jQuery 对象和原生 DOM 对象之间的相互转换.

DOM 对象和 jQuery 对象之间是可以相互转换的。因为原生 DOM 对象比 jQuery 对象更大，原生的一些属性和方法 jQuery 没有给我们封装，要想使用这些属性和方法，我们需要将 jQuery 对象转换为 DOM 对象才能进行使用。

- DOM 对象转换为 jQuery 对象:

方法一：直接通过 jQuery 选择器的方式获取的对象就是 jQuery 对象

方法二：将获取到的 DOM 对象使用 $() 包裹就转换为 jQuery 对象了

```js
// 获取div元素, box是一个DOM对象
const box = document.querySelector("div");

// 将DOM对象转为jQuery对象
const newBox1 = $(box); // newBox1是一个jQuery对象
// 直接获取jQuery对象
const newBox = $("div");
```

- jQuery 对象转换为原生 DOM 对象

转换实质:

因为 jQuery 对象是利用 `$` 对 DOM 对象包装后产生的对象，以伪数组形式存储，因此我们可以通过数组的方式直接获取原生 DOM 对象。

方法一:

> jQuery 对象[需要转为 DOM 对象的下标位置]

方法二:

> jQuery 对象.get(需要转换对象的下标位置)

```js
// box是一个jQuery对象
const box = $("div");

// jQuery对象转为DOM对象
const box1 = box[0]; // box1是一个DOM对象
// 或
const box2 = box.get(0); // box2是一个DOM对象
```

&nbsp;

### 多库共存问题

当我们使用多个 js 库时，有可能`存在 关键字 $ 冲突`，导致该库失效问题。

解决方法:

- 方法一：将 $ 符号替换为 jQuery。如：`$('div') => jQuery('div')`

- 方法二：自定义 jQuery 关键字 `const 自定义名称=$.noConflict()`

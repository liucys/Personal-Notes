### v-on 指令用于事件的绑定.

语法:

> v-on:事件类型="事件执行方法"

语法糖（简写）：

> @事件类型="事件执行方法"

&nbsp;

### v-on 指令进行事件绑定时参数的传递

当我们在使用 v-on 指令进行事件绑定时,若我们不需要进行参数传递,则事件方法后面的括号可以省略不写

```js
// 不需要传递参数
<p v-on:click="handleClick">点我一下</p>;

const app = new Vue({
  methods: {
    handleClick() {},
  },
});
```

当我们需要进行参数传递时，需要在绑定事件时，在事件执行方法中通过括号传入相应的参数。

```js
// 需要进行参数传递
<p v-on:click="handleClick('哈哈','123')">点我一下</p>;

const app = new Vue({
  methods: {
    handleClick(arg1, arg2) {
      console.log(arg1); // 哈哈
      console.log(arg2); // 123
    },
  },
});
```

当我们需要传递参数,但是却没有在事件方法后面的括号中传入参数时,事件方法中的参数值为 `undefined`

```js
// 需要传递参数,但是没有写事件方法后面的括号/没有进行参数传递
<p v-on:click="handleClick()">点我一下</p>;

const app = new Vue({
  methods: {
    handleClick(value) {
      console.log(value); // 输出结果为undefined
    },
  },
});
```

当我们需要传递一个参数,但是没有写事件方法后面的括号时,事件执行方法中的参数值为事件对象 `Event`

```js
// 需要传递参数,但是事件绑定时,事件方法没有括号传参
<p v-on:click="handleClick">点我一下</p>;

const app = new Vue({
  methods: {
    handleClick(value) {
      console.log(value); // 输出结果为事件对象(Event)
    },
  },
});
```

当我们需要同时传入参数与获取事件对象时，需要在绑定事件时，在事件执行方法中通过 `$event` 的方式声明传入事件对象

```js
// 需要同时获取参数与事件对象
<p v-on:click="handleClick('哈哈',123,$event)">点我一下</p>;

const app = new Vue({
  methods: {
    handleClick(value1, value2, event) {
      console.log(value1); // 哈哈
      console.log(value2); // 123
      console.log(event); // 输出结果为事件对象(Event)
    },
  },
});
```

&nbsp;

### v-on 指令修饰符

- `.stop` 事件修饰符

`.stop` 事件修饰符用于声明阻止事件的冒泡行为

语法:

> @事件类型.stop="事件方法"

```html
<div @click="handleDiv">
  <p @click.stop="handleClick">点我一下</p>
  <p></p>
</div>
```

- `.prevent` 事件修饰符

`.prevent` 事件修饰符用于声明阻止事件的默认行为

语法:

> @事件类型.prevent="事件方法"

```html
<form action="http://www.baidu.com">
  <input />
  <button type="submit" @click.prevent="submitClick">提交</button>
</form>
```

- `.once` 事件修饰符

`.once` 事件修饰符用于声明某个事件只会执行一次。

语法:

> @事件类型.once="事件方法"

```html
<p @click.once="handleClick">我只响应一次点击事件</p>
```

- `.self` 事件修饰符

`.self` 事件修饰符用于声明某个事件只在指定的元素上起作用.

语法:

> @事件类型.self="事件方法"

```html
<div>
  <p @click.self="handleClick">点我一次有反应</p>
  <p></p>
</div>
```

- 按键事件监听修饰符

为 `keyup 事件`添加修饰符.tab、`.delete` (捕获“删除”和“退格”键)、.esc、.space、.up、.down、.left、.right 等修饰符

按键事件监听修饰符用于监听 keyup 事件类型时使用.

例如: .enter 修饰符，用于监听回车键按下事件

```html
<!-- 只有在按下回车键后才起作用 -->
<input type="button" @keyup.enter="submitClick" />
```

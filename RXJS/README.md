### 前言：[什么是响应式编程？](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

---

什么是 RxJS?

    RxJS本质是一个工具库，是一种针对异步数据流的编程（当然也能够处理同步数据）。它通过使用observable序列来编写异步和基于时间的程序。它将一切数据，包括HTTP请求，DOM事件或者普通数据等包装成流的形式，然后用强大丰富的操作符对流进行处理。

RxJS 结合了观察者模式、迭代器模式和使用集合的函数式编程。

观察者模式又叫发布订阅模式（Publish/Subscribe），它是一种一对多的关系，让多个观察者（Observer）同时监听一个主体，这个主题也就是可观察对象（Observable）。可观察对象的状态发生改变时就会通知所有的观察者，使得他们能够受到更新的内容。

RxJs 的核心思想：`将离散的多个事件视为一个流来操作，流可以（通过操作符）进行各种变换（映射、采样、合并等）。`

在 RxJS 中用来解决异步事件管理的基本概念是：

- Observable（可观察对象）：表示一个概念，这个概念是一个可调用的未来值或事件的集合。
- Observer（观察者）：一个回调函数的集合，它知道如何去监听由 `Observable` 提供的值。
- Subscription（订阅）：表示 `Observable` 的执行，主要用于取消 `Observable` 的执行。
- Operators（操作符）：采用函数式编程风格的纯函数（pure function），使用像 `map、filter、concat、flatMap 等这样的操作符`来处理集合。
- Subject（主体）：相当于 EventEmitter，并且`是将值或事件多路推送给多个 Observer 的唯一方式`。
- Schedulers（调度器）：用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 `setTimeout 或 requestAnimationFrame 或其他。`

安装：

```js
// CDN方式：
<script src="https://cdn.bootcdn.net/ajax/libs/rxjs/版本号/rxjs.umd.min.js"></script>

// npm 方式
yarn add rxjs
```

`以6.x版本进行说明`

---

### 1. Observable

```js
import { Observable } from "rxjs";

// 创建可观察对象
const observable$ = new Observable((subscribe) => {
  subscribe.next(1);
  subscribe.next(2);
});
```

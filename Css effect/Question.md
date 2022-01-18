[TOC]

### 如何实现渐变色文字?

- 方式一

通过 `background-image、background-clip、color` 这三个样式搭配声明进行实现。

```html
<style>
  .title {
    /* 设置渐变颜色背景图 */
    background-image: linear-gradient(to right, red, blue);
    /* 规定背景的绘制区域 这里的text并不是所有浏览器都支持，因此需要前缀 */
    -webkit-background-clip: text;
    /* 使文字透明，让背景色显示出来 */
    color: transparent;
  }
</style>

<div class="title">如何实现渐变颜色字体？</div>
```

- 方式二

通过伪类与 mask 实现

```html
<style>
  .title {
    position: relative;
    color: red;
  }

  .title:before {
    /* content取值attr可以用来获取元素的属性值： content:attr(属性名) ，这里获取元素的text属性 */
    content: attr(text);
    position: absolute;
    z-index: 10;
    color: pink;
    /* mask能使元素的某一部分显示或隐藏 */
    -webkit-mask: linear-gradient(to left, red, transparent);
  }
</style>
<div class="title" text="如何实现渐变颜色字体？">如何实现渐变颜色字体？</div>
```

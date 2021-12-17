CSS 即层叠样式表（Cascading Style Sheets），是一种样式表语言，用来描述 HTML、XML（包括如 SVG、MathML、XHTML 之类的 XML 分支语言）文档的呈现。CSS 描述了在屏幕、纸质、音频等其它媒体上的元素应该如何被渲染的问题。在声明 CSS 样式时，通常`在.css 后缀的文件中`进行声明。

- 一个简单的 css 样式声明
  ```css
  div {
    width: 100px;
    height: 100px;
    background: linear-gradient(to right, red, blue);
  }
  ```

> CSS 规则集由选择器和声明块组成，选择器指向需要设置样式的 HTML 元素。声明块包含一条或多条用分号分隔的声明，每条声明都包含一个 CSS 属性名称和一个属性值，它们之间以冒号分隔。多条 CSS 声明通过分号分隔，声明块使用花括号括起来。例如在上面的代码中：`div就是属性选择器`，而在 `div 后面的花括号及其中的内容就属于声明块`的内容。在花括号（声明块）中的每一个分号前面的内容都属性声明。而在冒号前面的内容就是需要声明的属性名称，冒号后面的内容就是需要声明的属性值。如`width`是属性名称， `100px`就是属性值。

&nbsp;

我们在为 HTML 声明 CSS 样式时，可以通过三种方式进行声明使用：

1. 外部样式：外部样式即在`.css 后缀文件`中声明样式内容，然后再在 HTML 文件中的`<head>元素`中通过`<link>元素`的 `href 属性`进行引入生效。
   ```html
   <head>
     <link href="./index.css" rel="stylesheet" type="text/css" />
   </head>
   ```
2. 嵌入样式：嵌入样式即在 HTML 文件中的<head>元素中，通过在`<style>元素`中直接声明 CSS 样式内容生效使用。

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>CSS</title>
       <style>
         div {
           width: 100px;
           height: 100px;
         }
       </style>
     </head>
     <body>
       <div></div>
     </body>
   </html>
   ```

3. 内联样式：内联样式即直接在元素上通过 style 属性进行 CSS 样式的声明使用。每条样式的声明使用分号进行分隔。

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>Css</title>
     </head>
     <body>
       <div style="width:100px;height:100px"></div>
     </body>
   </html>
   ```

在声明 CSS 样式中，我们也可以如何 js 一样进行代码注释的添加，CSS 代码注释的添加通过 `/* 这是一段注释 */ `的方式进行添加即可。

默认样式处理：在我们使用 HTML 元素进行界面布局时，有一些元素存在着默认的 CSS 样式行为，而这些行为往往不是我们所需要的，因此我们可以通过声明一个 [reset.css](https://meyerweb.com/eric/tools/css/reset/) 文件对这些 html 元素默认样式进行统一处理。

&nbsp;

#### 选择器

选择器主要用于指定或选取需要设置样式的 HTML 元素。通常可以将选择器分为几类：`简单选择器`（根据元素名称、元素 id、元素 class 来选取元素）、`组合选择器`（根据元素与元素之间的特定关系来选取元素）、`伪类选择器`（根据元素的特定状态进行选取）、`伪元素选择器`（选取元素的一部分并设置其样式）、`属性选择器`（根据元素的属性或属性值来选取元素）、通用选择器（用 `*` 表示，它将选择页面中所有的 html 元素）等。

- 标签选择器：即根据元素的名称进行选择，如选择所有的 p 元素：`p {...样式设置}`
- 组合选择器：即通过逗号将选择器进行分隔从而为多个选择器设置相同的样式。如：`p, h1, div {...样式设置}`
- 类选择器：即根据元素的 class 属性设置的内容进行选择，class 属性设置允许声明多个相同的值内容。类选择样式设置需要通过 `.类名称`进行声明，如：`.box{ ...样式设置 }`。我们还可以指定特定的元素的类选择，如指定 p 元素 class 属性值为 box 的所有 p 元素：`p.box{...样式设置}`。
- id 选择器：id 选择器即根据元素的 id 属性进行选择的一种方式，但是 id 属性的值在 HTML 中是必须唯一的。声明使用时必须同 `#` 进行声明使用,如：`#ID {...样式设置}`

- 其他选择器扩展

  | 选择器             | 示例              |                                           描述 |
  | :----------------- | :---------------- | ---------------------------------------------: |
  | element element    | div p             |                 选择 div 元素内部的所有 p 元素 |
  | element>element    | div>p             |             选择父元素为 div 元素的所有 p 元素 |
  | element+element    | div+p             |               选择紧跟在 div 元素后面的 p 元素 |
  | element~element2   | p~ul              | 选择与 p 元素同级并在 p 元素后面的所有 ul 元素 |
  | [attribute]        | [target]          |                 选择所有待遇 target 属性的元素 |
  | [attribute=value]  | [target=_blank]   |       选择所有 target 属性值等于\_blank 的元素 |
  | [attribute*=value] | img[src*="hdcms"] |     src 属性中包含 "hdcms" 字符的每个 img 元素 |
  | [attribute^=value] | img[src^="https"] |       src 属性值以 "https" 开头的每个 img 元素 |
  | [attribute$=value] | img[src$=".jpeg"] |         src 属性以 ".jpeg" 结尾的所有 img 元素 |
  | :link              | a:link            |                      选择所有未被访问的 a 链接 |
  | :visited           | a:visited         |                      选择所有已被访问的 a 链接 |
  | :hover             | a:hover           |                          鼠标移动到 a 元素上时 |
  | :active            | a:active          |                                 点击正在发生时 |
  | :focus             | input:focus       |                      选择获得焦点的 input 元素 |
  | :root              | :root             |                      选择文档的根元素即 html。 |
  | :empty             | p:empty           |  选择没有子元素的每个 p 元素（包括文本节点）。 |
  | :enabled           | input:enabled     |                      选择每个启用的 input 元素 |
  | :disabled          | input:disabled    |                      选择每个禁用的 input 元素 |
  | :checked           | input:checked     |                    选择每个被选中的 input 元素 |
  | :required          | input:required    |                包含 required 属性的 input 元素 |
  | :optional          | input:optional    |              不包含 required 属性的 input 元素 |
  | :valid             | input:valid       |                             验证通过的表单元素 |
  | :invalid           | input:invalid     |                               验证不通过的表单 |
  | ::first-letter     | p::first-letter   |                        选择每个 p 元素的首字母 |
  | ::first-line       | p::first-line     |                      选择每个 p 元素的首行内容 |
  | ::before           | div::before       |              在每个 div 的首个内容之前插入内容 |
  | ::after            | div::after        |          在每个 div 的最后一个内容之后插入内容 |

&nbsp;

#### CSS 中的颜色值

在 CSS 中，声明颜色可以通过预定义的 颜色名称 `red，blue，yellow 等`、RGB：`rgb(red, green, blue)`、HEX：`#ff0000`、RGBA：`rgba(red,green,blue,alpha)`、HSL：`hsl(hue,saturation,lightness)`、HSLA：`hsla(hue, saturation, lightness,alpha)` 等方式进行颜色声明。

> hsla(hue，saturation，lightness)：色相（hue）是色轮上从 0 到 360 的度数。0 是红色，120 是绿色，240 是蓝色；饱和度（saturation）是一个百分比值，0％ 表示灰色阴影，而 100％ 是全色；亮度（lightness）也是百分比，0％ 是黑色，50％ 是既不明也不暗，100％是白色。

&nbsp;

#### CSS 中的背景属性

- background-color：
  > 声明元素的背景颜色，如` div{ background-color: #000; }`
- background-image：
  > 声明元素的背景图片，如 `div{ background-image: url('./public/xxx.jpg')}`
- background-repeat：
  > 声明元素背景图像是否及如何重复。默认情况下，`background-image 属性`在水平和垂直方向上都重复图像。我们可以通过 background-repeat 属性改变重复的方向或取消重复。该属性可以取值有：（1）`repeat`，默认值，表示背景图像将向垂直和水平方向重复。（2）`repeat-x`，表示只在水平方向上重复。（3）`repeat-y`，表示只在垂直方向上重复。（4）`no-repeat`，表示不进行重复。（5）`inherit`，表示从父元素哪里继承该属性的值类型。
- background-attachment：
  > 声明元素背景图像是否固定位置或者随着页面的其余部分进行滚动。该属性取值有：（1）`scroll`，默认值，表示背景图片随页面的滚动而滚动。（2）`fixed`，表示固定背景图片的位置。（3）`local`，表示背景图像随着元素内容的滚动而滚动。
- background-position：
  > 声明元素背景图像的起始位置。该属性取值方式有：（1）方位词，如 left top、left bottom、left center、right top 等；如果仅指定一个关键字，其他值将会是"center"。（2）百分比，如 50% 50%，第一个值是水平位置，第二个值是垂直。左上角是 0％ 0％。右下角是 100％ 100％。如果仅指定了一个值，其他值将是 50％ 。默认值为：0％ 0％。（3）像素值，如 40px 40px，第一个值是水平位置，第二个值是垂直。

[背景属性的简写属性 bakground]()：以上的背景属性我们都可以通过属性 background 进行一次性声明，background 属性可以一次性声明的可属性分别是：background-color、background-position、background-size、background-repeat、background-origin、background-clip、background-attachment 和 background-image。

&nbsp;

#### CSS 中的文本（字体）属性

- color：
  > 设置文本的颜色
- direction：
  > 设置文本的方向，该属性取值有：（1）ltr，默认值，表示文本从左往右显示。（2）rtl，表示文本从右往左显示。（3）inhert，表示从父元素哪里继承该属性的值。
- letter-spacing：
  > 设置文本字符间的间距，该属性取值有：（1）normal，默认值，表示没有间距。（2）n（px|em|rem），n 表示自定义字符间的间距大小。（3）inhert，表示从父元素哪里继承该属性的属性值。
- line-height：
  > 设置文本内容的行高。当取值单位为%时，表示设置基于当前字体尺寸的百分比行间距。
- text-align：
  > 设置文本的对齐方式。该属性可取值有：（1）left，默认值，表示左对齐。（2）right，表示右对齐。（3）center，表示中间对齐。（4）justify，表示两端对齐。（5）inherit，表示从父元素哪里继承该属性的值。
- text-decoration：
  > 添加文本修饰，该属性可取值有：（1）none，默认值，不做任何修饰。（2）underline，添加文本下划线。（3）overline，添加文本上划线。（4）line-through，添加文本中划线。（5）blink，设置闪烁文本。

[TOC]

在 node 中实现生成 pdf 文件的插件存在许多的，这里主要使用一个插件生成 pdf 文件 —— [pdfmake](https://github.com/bpampuch/pdfmake)

[官方实现案例](http://pdfmake.org/playground.html)

安装

> npm install pdfmake
>
> #
>
> yarn add pdfmake

因为这个插件是外国大佬开发的，因此中文支持得靠我们自己弄了，首先我们安装好插件后需要自己找一个合适的中文字体 `window系统：C盘/windows/Fonts` 路径下，将合适的字体复制下来。然后在项目中 创建/选择 一个文件夹放置选择的字体。

```js
const pdfMake = require("pdfmake/src/printer"); // 引入插件
const fs = require("fs"); // 引入fs模块
const path = require("path"); // 引入path模块

// 设置引入自己选择的中文字体，这里以xxxx文件夹下的simfang.ttf为例。字体标识字段这里设置为webfont。
const fonts = {
  webfont: {
    normal: path.join(__dirname, "./xxxx/simfang.ttf"),
    bold: path.join(__dirname, "./xxxx/simfang.ttf"),
    italics: path.join(__dirname, "./xxxx/simfang.ttf"),
    bolditlics: path.join(__dirname, "./xxxx/simfang.ttf"),
  },
};

const printer = new pdfMake(fonts); // 创建printer对象

// 定义pdf内容及样式
const dd = {
  // pdf生成的内容，这里以生成表格pdf内容为例，其余生成内容看官方案例
  content: [
    //   一个单独的{}内容相当于一个段落，可以通过属性进行设置样式及内容。
    { text: "Tables标题", style: "header" },
    // 一个单独的 双引号/单引号 相当于一个段落，只能设置显示文本内容
    "Official documentation —— 正式文件",
    // 一个含有table属性的{}表示声明一行表格，
    {
      style: "tableExample",
      table: {
        body: [
          ["Column 1", "Column 2", "Column 3"],
          ["One value goes here", "Another one here", "OK?"],
        ],
      },
    },
    { text: "Defining column widths", style: "subheader" },
    "Tables support the same width definitions as standard columns:",
    {
      bold: true,
      ul: ["auto", "star", "fixed value"],
    },
    {
      style: "tableExample",
      table: {
        //   设置表格的列宽
        widths: [100, "*", 200, "*"],
        body: [
          ["width=100", "star-sized", "width=200", "star-sized"],
          [
            "fixed-width cells have exactly the specified width",
            { text: "nothing interesting here", italics: true, color: "gray" },
            { text: "nothing interesting here", italics: true, color: "gray" },
            { text: "nothing interesting here", italics: true, color: "gray" },
          ],
        ],
      },
    },
    {
      style: "tableExample",
      table: {
        widths: ["*", "auto"],
        body: [
          [
            "This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.",
            "I am auto sized.",
          ],
        ],
      },
    },
    {
      style: "tableExample",
      table: {
        widths: ["*", "auto"],
        body: [
          [
            "This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.",
            { text: "I am auto sized.", noWrap: true },
          ],
        ],
      },
    },
    { text: "Defining row heights", style: "subheader" },
    {
      style: "tableExample",
      table: {
        //   设置表格的行高
        heights: [20, 50, 70],
        body: [
          ["row 1 with height 20", "column B"],
          ["row 2 with height 50", "column B"],
          ["row 3 with height 70", "column B"],
        ],
      },
    },
    // 一个单独的含有pageBreak属性的{}表示换页显示其后面的内容，pageBreak值为""或不设置表示不换页。值为before表示在下一页显示，值为after表示在前一页显示。
    { text: "Column/row spans", pageBreak: "before", style: "subheader" },
    "Each cell-element can set a rowSpan or colSpan",
  ],
  // pdf的样式，分别与content中的设置的style属性对应
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    tableExample: {
      margin: [0, 5, 0, 15],
    },
  },
  defaultStyle: {
    font: "webfont", // 使用的字体，上面自己设置的
  },
};

const pdfDOC = printer.createPdfKitDocument(dd); // 创建pdf对象
pdfDOC.pipe(fs.createWriteStream("pdf-name.pdf")).on("finish", function () {
  console.log("Create pdf file successfully");
});
pdfDOC.end(); // 结束操作

/**
 * 当我们想要操作生成的pdf文件时，通过 fs模块进行读取操作。
 **/
```

![最终生成 pdf-name.pdf 文件](https://github.com/liucys/open-static-file/blob/main/Project_img/pdf_create.png)

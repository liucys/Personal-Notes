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
    // 一个含有table属性的{}表示声明表格，表格的行数根据其table属性下的body属性内容生成
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
      alignment: "center", // 水平居中
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

/* 方式一：直接在文件夹中生成pdf文件 */
pdfDOC.pipe(fs.createWriteStream("pdf-name.pdf")).on("finish", function () {
  console.log("Create pdf file successfully");
});
pdfDOC.end(); // 结束操作

/** 方式二：获取生成的pdf的buffer格式的内容 **/
const chunks = [];
pdfDOC.on("data", (chunk) => {
  chunks.push(chunk);
});
pdfDOC.on("end", () => {
  // 获取pdf的buffer格式内容
  const pdfBuffer = Buffer.concat(chunks);
  // 通过回调函数将这个pdf的buffer格式内容传递出去。callback(pdfBuffer)
});

/**
 * 当我们想要操作生成的pdf文件时，通过 fs模块进行读取操作。
 **/
```

&nbsp;

实现表格内容垂直居中（根据官方 github 的 [issues](https://github.com/bpampuch/pdfmake/issues/74) 上的用户回答进行修改，可能存在问题）。

```js
function findInlineHeight(cell, maxWidth, usedWidth = 0) {
  let calcLines = (inlines) => {
    if (inlines == undefined)
      return {
        height: 0,
        width: 0,
      };
    let currentMaxHeight = 0;
    for (const currentNode of inlines) {
      usedWidth += currentNode.width;
      if (usedWidth > maxWidth) {
        currentMaxHeight += currentNode.height;
        usedWidth = currentNode.width;
      } else {
        currentMaxHeight = Math.max(currentNode.height, currentMaxHeight);
      }
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  };
  if (cell._offsets) {
    usedWidth += cell._offsets.total;
  }
  if (cell._inlines && cell._inlines.length) {
    return calcLines(cell._inlines);
  } else if (cell.stack && cell.stack[0]) {
    return cell.stack
      .map((item) => {
        return calcLines(item._inlines);
      })
      .reduce((prev, next) => {
        return {
          height: prev.height + next.height,
          width: Math.max(prev.width + next.width),
        };
      });
  } else if (cell.table) {
    let currentMaxHeight = 0;
    for (const currentTableBodies of cell.table.body) {
      const innerTableHeights = currentTableBodies.map((innerTableCell) => {
        const findInlineHeight = this.findInlineHeight(
          innerTableCell,
          maxWidth,
          usedWidth
        );

        usedWidth = findInlineHeight.width;
        return findInlineHeight.height;
      });
      currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight);
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  } else if (cell._height) {
    usedWidth += cell._width;
    return {
      height: cell._height,
      width: usedWidth,
    };
  }

  return {
    height: null,
    width: usedWidth,
  };
}

function applyVerticalAlignment(node, rowIndex, align) {
  const allCellHeights = node.table.body[rowIndex].map(
    (innerNode, columnIndex) => {
      const mFindInlineHeight = findInlineHeight(
        innerNode,
        node.table.widths[columnIndex]._calcWidth
      );
      return mFindInlineHeight.height;
    }
  );
  const maxRowHeight = Math.max(...allCellHeights);
  let rowHeights = [];
  if (node.table && node.table.heights && node.table.heights.length > 0) {
    rowHeights = node.table.heights;
  }
  node.table.body[rowIndex].forEach((cell, ci) => {
    if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
      let topMargin;
      if (align === "bottom") {
        topMargin = maxRowHeight - allCellHeights[ci];
      } else if (align === "center") {
        topMargin = (maxRowHeight - allCellHeights[ci]) / 2;
      }
      if (cell._margin) {
        cell._margin[1] = topMargin;
      } else {
        cell._margin = [0, topMargin, 0, 0];
      }
    }
    // 存在自定义高度时
    if (rowHeights.length > 0) {
      let topMargin;
      if (align === "center") {
        topMargin = rowHeights[rowIndex] / 2 - maxRowHeight / 2;
      }
      if (cell._margin) {
        cell._margin[1] = topMargin;
      } else {
        cell._margin = [0, topMargin, 0, 0];
      }
    }
  });
}

// 使用
const dd = {
  content: [
    {
      table: {
        body: [
          [
            { text: "AAA", style: { fontSize: 30 } },
            { text: "BBB", style: { fontSize: 20 } },
            { text: "CCC", style: { fontSize: 10 } },
          ],
          [["AAA", "AAA", "AAA"], ["BBB", "BBB"], "CCC"],
        ],
      },
      // 设置垂直居中
      layout: {
        paddingTop: function (index, node) {
          applyVerticalAlignment(node, index, "center");
          return 0;
        },
      },
    },
  ],
};
```

![最终生成 pdf-name.pdf 文件](https://github.com/liucys/open-static-file/blob/main/Project_img/pdf_create.png)

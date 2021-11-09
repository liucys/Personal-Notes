[TOC]

[Node.js](http://nodejs.cn/) 是一个基于 Chrome V8 引擎的 JavaScript 运行时。

目录：

- [删除指定目录下的所有文件](#delDir)

&nbsp;

#### 功能实现

1. <a name="delDir">删除指定目录下的所有文件</a>

> 通过 fs 模块的方法进行文件目录的删除

```js
const fs = require("fs");
const path = require("path");

function delDir(dirPath) {
  let files = [];
  if (fs.existsSync(dirPath)) {
    files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      let curPathFile = `${dirPath}/${file}`;
      if (fs.statSync(curPathFile).isDirectory()) {
        delDir(curPathFile);
      } else {
        fs.unlinkSync(curPathFile);
      }
    });
  }
}

delDir(path.join(__dirname, "./public"));
```

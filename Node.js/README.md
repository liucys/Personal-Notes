[TOC]

[Node.js](http://nodejs.cn/) 是一个基于 Chrome V8 引擎的 JavaScript 运行时。

基础知识：

> （1）如何从 node 程序中退出 `process.exit(1)`或`process.exitCode=1`
>
> （2）如何从 node 读取环境变量 `process.env.NODE_ENV`。 process 提供的 env 属性承载了在启动进程时设置的所有环境变量。`NODE_ENV` 在默认情况下被设置为`调试环境 development`,若是将其修改为 `production`，则表示生产环境。

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

[TOC]

`http` 模块作为 NODE 的核心组成模块（无需安装，直接引入使用），它是 Node.js 网络的关键模块。

我们可以通过该 http 模块来创建 HTTP 服务器

> const http = require('http');

使用 http 搭建一个简单的服务器

```js
const http = require("http"); // 引入http模块

// 通过http的createServer方法创建服务
const service = http.createServer((req, res) => {
  res.statusCode = 200; // 状态码
  res.setHeader("Content-Type", "text/plain"); // 设置响应头
  res.end("hello world"); // 响应内容并结束
});

// 监听3000端口
service.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000/");
});
```


TOC

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。

#### 为什么需要 WebSocket?

> 解决 HTTP 协议的一个缺陷：通信只能由客户端发起，HTTP 协议做不到服务器主动向客户端推送信息。

以往为了实现推送技术，所用的技术都是通过`轮询`的方式进行消息推送（在特定的时间间隔内，由浏览器对服务器发出 HTTP 请求，然后服务器返回最新的数据给客户端的浏览器）。但是这种方式有着很明显的缺点，即浏览器需要不断的向服务器发出请求，然后 HTTP 请求可能包含较长的头部，其中真正有效的数据可能只是很小一部分，显然这样会浪费很多带宽资源。

较新的一种实现轮询效果的技术是`Comet`。然而这种技术虽然可以实现双向通信，但依然需要反复发出请求。而在`Comet`中，普遍采用的长连接，这中方式也会导致消耗服务器的资源。

WebSocket 协议诞生与 2008 年，2011 年成为国际标准。它最大的特点就是服务器可以主动向客户端推送消息，客户端也可以主动向服务器发送信息。
其具有的特点：

1. 其是建立在 TCP 协议之上，服务器端的实现比较容易。
2. 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易被屏蔽，能通过各种 HTTP 代理服务器。
3. 数据格式比较轻量，性能开销小，通信高效。
4. 可以发送文本，也可以发送二进制数据。
5. 没有同源限制，客户端可以与任意服务器通信。
6. 协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是 URL。

一个简单的 websocket 通信报文：

```js
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

`Upgrade: websocket`与`Connection: Upgrade`是声明 websokcket 通信的核心，它用于告诉 Apache、Nginx 等服务器，发起的是 websokcet 协议。

`Sec-WebSocket-Key`是一个 Base64 encode 的值，它是由浏览器随机生成的，用于告诉服务器将验证是否是 WebSocket。

`Sec-WebSocket-Protoocol`是一个用户自定的字符串，用来区分同 URL 下，不同服务所需要的协议。

`Sec-WebSocket-Version`是告诉服务器所使用的 WebSocket Draft（协议版本）。

客户端创建 WebSocket 对象的方式：

```js
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", function (event) {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from server ", event.data);
});
```

`const socket = new WebSocket ( url , [ protocol ] );`其中 `url` 表示指定链接的 URL。第二参数 `protocol` 是一个可选参数，指定可以接受的子协议

[更多 WebSocket 了解信息](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

&nbsp;

### Socket.io

[socket.io](https://socket.io/docs/v4/) 是一个开源库，它基于 WebSocket 协议封装，兼容不支持`ws`的浏览器采用 ajax 轮询，可以帮助开发者在浏览器和服务器之间实现实时、双向和基于事件的通信。它包含服务端（`socket.io`）与客户端（`socket.io-client`）两个内容。

特点：

- 可靠性
- 短线自动重连
- 断线检测
- 支持二进制文件
- 多路传输
- room 支持

&nbsp;

### 使用 Socket.IO 进行开发

&nbsp;

#### 服务端

```js
npm install socket.io
或
yarn add socket.io
```

创建 socket.io 实例

```js
const io = require("socket.io")();
// or
const { Server } = require("socket.io");
const io = new Server(httpServer, [options]); // 传入需要绑定的服务器，可选配置项
// or
const io = new Server(port, [options]); // 传入端口，可选配置项
// or
const io = new Server(options); // 传入配置项
```

构建服务端简单案例：

```js
/**
 * 原生node http模块构建 socket.io服务端
 **/
const http = require("http");

const { Server } = require("socket.io");

const app = http.createServer();

// 创建socket.io服务，（必须设置cors，否则会出现跨域）
const io = new Server(app, { cors: true });

// 客户端连接
io.on("connection", (socket) => {
  console.log("Client connection successful");

  // 发送事件消息handleMsg 消息内容为{ msg: "Hello,Socket.io" }
  socket.emit("handleMsg", { msg: "Hello,Socket.io" });

  // 客户端断开连接
  socket.on("disconnect", () => {
    console.log("Client disconnection");
  });
});

// Listening port
app.listen(8044);

/**
 *  node koa搭建socket.io服务端
 **/
const koa = require("koa");
const app = new koa(); // create koa Instance Object
const server = require("http").createServer(app.callback()); // create server
const io = require("socket.io")(server, { cors: true }); // create socket.io

// 客户端连接
io.on("connection", (socket) => {
  console.log("Client connection successful");

  // 发送事件消息handleMsg 消息内容为{ msg: "Hello,Socket.io" }
  socket.emit("handleMsg", { msg: "Hello,Socket.io" });

  // 客户端断开连接
  socket.on("disconnect", () => {
    console.log("Client disconnection");
  });
});

// Listening port
server.listen(8044);
```

&nbsp;

#### 客户端

Socket.IO 确实支持 IE9 及以上。不再支持 IE 6/7/8。

```js
// 使用CDN
<script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.1.3/socket.io.min.js"></script>

// 使用npm包,客户端项目(如vue或react等)需要安装依赖:
npm install socket.io-client
# or
yarn add socket.io-client
```

构建客户端简单案例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.1.3/socket.io.min.js"></script>
    <script>
      // 连接socket.io
      const socket = io("http://localhost:8044");

      // 监听连接服务端
      socket.on("connect", () => {
        console.log("link successful");
      });

      // 监听服务端事件handleMsg
      socket.on("handleMsg", (msg) => {
        console.log(msg);
      });

      // 服务端断开连接
      socket.on("disconnect", () => {
        console.log("Failed to connect to the server");
      });
    </script>
  </body>
</html>
```

&nbsp;

### Socket.io 事件与消息

&nbsp;

#### 服务端

> 事件监听：socket.on(eventName, listener)、socket.once(eventName, listener)、socket.off(eventName, listener)

| 事件名称      | 事件含义                                                               | 实例                                                                                                        |
| ------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| connection    | 监听客户端成功连接服务器                                               | io.on('connection',socket=>{ ... })                                                                         |
| disconnect    | 监听客户端断开与服务器的连接(当用户关闭当前窗口后或手动断开连接时触发) | socket.on('disconnect',()=>{ ... })                                                                         |
| connect_error | 无法建立低级连接/连接被中间件功能中的服务器拒绝                        | 在第一种情况下，Socket 将在给定的延迟后自动尝试重新连接；在后一种情况下，需要手动重新连接。可能需要更新凭据 |

服务器可以使用 socket.disconnect()强行断开连接

&nbsp;

消息发送

```js
io.on("connection", (socket) => {
  // basic emit
  // 基础信息发送
  socket.emit(/* ... */);

  // to all clients in the current namespace except the sender
  // 向当前命名空间中除发送者之外的所有其他客户发送
  socket.broadcast.emit(/* ... */);

  // to all clients in room1 except the sender
  // 向当前room1房间中除发送者之外的其他客户发送
  socket.to("room1").emit(/* ... */);

  // to all clients in room1 and/or room2 except the sender
  // 向房间room1与room2中除了发送者之外的其他所有客户发送
  socket.to(["room1", "room2"]).emit(/* ... */);

  // to all clients in room1
  // 向room1房间中的所有客户发送
  io.in("room1").emit(/* ... */);

  // to all clients in room1 and/or room2 except those in room3
  // 向房间room1与room2中不是房间room3的所有客户发送
  io.to(["room1", "room2"]).except("room3").emit(/* ... */);

  // to all clients in namespace "myNamespace"
  // 向命名空间myNamespace中的所有客户发送
  io.of("myNamespace").emit(/* ... */);

  // to all clients in room1 in namespace "myNamespace"
  // 向命名空间 "myNamespace "中room1房间的所有客户发送。
  io.of("myNamespace").to("room1").emit(/* ... */);

  // to individual socketid (private message)
  // 向指定socketId的用户发送（私人信息）
  io.to(socketId).emit(/* ... */);

  // to all clients on this node (when using multiple nodes)
  // 给这个节点上的所有客户发送（当使用多个节点时）。
  io.local.emit(/* ... */);

  // to all connected clients
  // 给所有连接的客户发送
  io.emit(/* ... */);

  // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
  // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.

  // with acknowledgement
  socket.emit("question", (answer) => {
    // ...
  });

  // without compression
  // 不对发送的数据进行压缩
  socket.compress(false).emit(/* ... */);

  // a message that might be dropped if the low-level transport is not writable
  // 发送可能会发生信息数据丢失的消息
  socket.volatile.emit(/* ... */);
});
```

[更多服务端操作处理](https://socket.io/docs/v4/server-api/)

&nbsp;

#### 客户端

> 事件监听：socket.on(eventName, listener)、socket.once(eventName, listener)、socket.off(eventName, listener)

| 事件名称      | 事件含义                                        | 实例                                                                                                        |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| connect       | 监听连接服务端                                  | socket.on('connect',()=>{ ... })                                                                            |
| disconnect    | 服务端与客户端断开连接                          | socket.on('disconnect',()=>{ ... })                                                                         |
| connect_error | 无法建立低级连接/连接被中间件功能中的服务器拒绝 | 在第一种情况下，Socket 将在给定的延迟后自动尝试重新连接；在后一种情况下，需要手动重新连接。可能需要更新凭据 |

客户端可以使用 socket.disconnect()手动断开连接
客户端可以使用 socket.connect()手动进行重新连接

&nbsp;

消息发送

```js
// basic emit
// 基础信息发送
socket.emit(/* ... */);

// with acknowledgement
// 发送带有回执信息的消息
socket.emit("question", (answer) => {
  // ...
});

// without compression
// 不压缩发送的信息数据
socket.compress(false).emit(/* ... */);

// a message that might be dropped if the low-level transport is not writable
// 发送可能会发生信息数据丢失的消息
socket.volatile.emit(/* ... */);
```

[更多客户端操作处理](https://socket.io/docs/v4/client-api/)

&nbsp;

### room 与 namespace
room与namespace是socket提供的解决当服务端发送的消息有分类，不同的客户端需要接收不同的分类；服务端发送的消息只需要针对特定的群体进行发送时的情景。
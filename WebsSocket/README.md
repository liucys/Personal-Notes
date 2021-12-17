TOC

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。

#### 为什么需要 WebSocket?

> 解决 HTTP 协议的一个缺陷：通信只能由客户端发起，HTTP 协议做不到服务器主动向客户端推送信息。

以往为了实现推送技术，所用的技术都是通过`轮询`的方式进行消息推送（在特定的时间间隔内，由浏览器对服务器发出 HTTP 请求，然后服务器返回最新的数据给客户端的浏览器）。但是这种方式有着很明显的缺点，即浏览器需要不断的向服务器发出请求，然后 HTTP 请求可能包含较长的头部，其中真正有效的数据可能只是很小一部分，显然这样会浪费很多带宽资源。

较新的一种实现轮询效果的技术是`Comet`。然而这种技术虽然可以实现双向通信，但依然需要反复发出请求。而在`Comet`中，普遍采用的长连接，这种方式也会导致消耗服务器的资源。

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

[socket.io](https://socket.io/docs/v4/) 是一个开源库，它基于 WebSocket 协议封装，兼容不支持`ws`的浏览器其会转为采用 ajax 轮询，可以帮助开发者在浏览器和服务器之间实现实时、双向和基于事件的通信。它包含服务端（`socket.io`）与客户端（`socket.io-client`）两个内容。

特点：

- 可靠性
- 短线自动重连
- 断线检测
- 支持二进制文件
- 多路传输
- room 支持

&nbsp;

### 使用 Socket.IO 进行开发

无论是服务器还是客户端的 socket 实例，都拥有 `emit`和`on`这两个函数，通过这`emit`与`on`这两个函数，我们可以轻松实现服务器与客户端之间的双向通信。

- emit

> 该函数用来发送一个事件或者说触发一个事件，第一个参数为事件名（自定义/内置事件名），第二个参数为要发送的数据，第三个参数为回调函数（一般情况下省略，若是需要客户端接收到消息后立即得到响应时，则可以设置该回调函数）

```js
socket.emit(eventName, data, [callback]);
```

- on

> 该函数用来监听 `emit` 发送的事件，第一个参数为要监听的事件名称；第二个参数为一个匿名函数用来接收 `emit` 发送来的数据，该匿名函数的第一个参数为接收的数据，若有第二个参数，则为要返回的函数

```js
socket.on(eventName,function(data,[fn]))
```

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

在服务端有三种 `emit` 情况

- socket.emit()：向建立该连接的客户端广播
- socket.broadcast.emit()：向除了建立该连接之外的其他所有客户端广播
- io.sockets.emit()：向所有客户端广播。

&nbsp;

#### 客户端

Socket.IO 新版本只支持 IE9 及以上。不再支持 IE 6/7/8。

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

      // 向服务端发送消息事件sendMsg,发送内容为 'Hello'
      socket.emit("sendMsg", "Hello");

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

服务端消息发送

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

### namespace - 命名空间

命名空间类似于路由的概念，表示分配不同的端点或路径。命名空间在服务端创建，可以通过请求加入。

命名空间可以最大限度的减少资源数量，同时通过在通信通道之间引入分离来分离应用程序中的问题。多个命名空间之间是共享相同的 websocket 连接的，这在服务器上节省了我们的套接字端口。

根命名空间`/`是默认命名空间，如果客户端在连接到服务器时没有指定命名空间，则连接的都是默认命名空间。

每个命名空间都会触发一个 connection 事件。该事件接收一个 Socket 实例作为参数。

我们可以创建自己的自定义命名空间。在服务器中，我们通过调用 `io`的`of`函数进行设置。`io.of('namespace');`

```js
const koa = require("koa");
const app = new koa(); // create koa Instance Object
const server = require("http").createServer(app.callback()); // create server
const io = require("socket.io")(server, { cors: true }); // create socket.io

// default namespace '/'
io.on("connection", (socket) => {
  console.log("Client connection successful");

  // 发送事件消息handleMsg 消息内容为 "welcome"
  socket.emit("handleMsg", "welcome");

  // 客户端断开连接
  socket.on("disconnect", () => {
    console.log("Client disconnection");
  });
});

// custom namespace
const myNameSpace = io.of("my-namespace");
myNameSpace.on("connection", (socket) => {
  console.log("Client connection my-namespace successful");
  // 发送事件消息handleMyNameSpace 消息内容为 "Hi,come here"
  socket.emit("handleMyNameSpace", "Hi,come here");

  // 客户端断开连接
  scoket.on("disconnect", () => {
    console.log("Client disconnection my-namespace");
  });
});

server.listen(8044);
```

客户端若想连接相应的命名空间，只需要在配置中声明相应的空间名称即可。

```js
// 连接默认的命名空间 /
const defaultNameSpace = io("http://localhost:8044");
// 连接命名空间 my-namespace
const myNameSpaceSocket = io("http://localhost:8044/my-namespace");
```

&nbsp;

### room - 房间

在每个 `namespace` 中，我们可以任意定义一些频道，这些频道就是房间。房间也共享相同的套接字连接。`socket`可以加入或离开这些房间。我们应当注意：`房间只能在服务端进行加入/连接。`

加入房间：房间的加入/连接通过调用 `join` 方法进行实现。

离开房间：房间的离开通过调用 `leave` 方法进行实现。

可以通过监听 disconnecting 事件来获取 Socket 所在的房间

```js
io.on("connection", (socket) => {
  console.log("client connection");

  // join room
  // 加入房间 customRoom
  socket.join("customRoom");

  // 向 customRoom 房间广播消息
  // 这个'msg'事件只有'customRoom'频道中的socket们才能收到
  io.to("customRoom").emit("msg", "xxx 进入房间");

  // 离开房间 customRoom
  socket.leave("customRoom");

  // 所在房间
  socket.on("disconnecting", () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });
});
```

向多个房间发送消息

> io.to("room1").to("room2").to("room3").emit("some event");

广播或发射简单的消息时使用 to 或 in（它们是相同的）：

> io.to("some room").emit("some event");

&nbsp;

### 简单聊天室小案例

服务端构建

```js
const koa = require("koa");
const app = new koa();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server, { cors: true });

const allMessage = [];
io.on("connection", (socket) => {
  console.log("Client connection successful");

  // 发送之前的全部消息
  // send all previous messages
  io.emit("allMessage", allMessage);

  // 监听客户端名称，并向除了当前客户端之外的其他客户端发送消息提醒
  // listen to client names and send message alerts to clients other than the current client
  socket.on("user-name", (username) => {
    socket.nickName = username; // record client name
    socket.broadcast.emit("globalMsg", `${username}进入房间`);
  });

  // 监听新消息的发送
  // listening for new messages to be sent
  socket.on("sendMessage", (data) => {
    allMessage.push(data);
    // 转发新消息
    // forwarding new messages
    io.emit("newMessage", data);
  });

  // 客户端断开连接
  // client disconnection
  socket.on("disconnect", () => {
    if (socket.nickName) {
      socket.broadcast.emit("globalMsg", `${socket.nickName}已离开房间`);
      console.log("a client disconnects");
    }
  });
});

// listening port 3000
server.listen(3000);
```

客户端构建

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.common.dev.js"></script>
    <title>Socket.io</title>
    <style></style>
  </head>
  <body>
    <div id="app">
      <div v-if="userMsg.name">
        <div>
          <input
            type="text"
            v-model="userMsg.msg"
            key="message"
            placeholder="please enter a message"
          /><button @click="handleSendMsg">发送</button>
        </div>
        <p>{{globalMsg}}</p>
        <ul>
          <li v-for="(item,index) in listMsg" :key="index">
            {{item.name}}：{{item.message}}
          </li>
        </ul>
      </div>
      <div v-else>
        <input
          type="text"
          placeholder="please enter a username"
          v-model="userMsg.msg"
          key="name"
        /><button @click="submitName">提交</button>
      </div>
    </div>
    <script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.1.3/socket.io.js"></script>
    <script>
      const app = new Vue({
        el: "#app",
        data: {
          globalMsg: "",
          listMsg: [],
          userMsg: {
            name: "",
            msg: "",
          },
          socket: null,
        },
        mounted() {
          // create connection
          this.socket = socket = io("http://localhost:3000");
          // listening to broadcast messages
          this.socket.on("globalMsg", (message) => {
            this.globalMsg = message;
            setTimeout(() => {
              this.globalMsg = "";
            }, 2000);
          });

          // listening to all previous message content (for new clients)
          this.socket.on("allMessage", (data) => {
            this.listMsg = data;
          });

          // listening for new messages to be added
          this.socket.on("newMessage", (data) => {
            this.listMsg.push(data);
          });
        },
        methods: {
          // user name submission
          submitName() {
            this.userMsg.name = this.userMsg.msg;
            this.socket.emit("user-name", this.userMsg.name);
            this.userMsg.msg = "";
          },
          // new message sent
          handleSendMsg() {
            const info = {
              name: this.userMsg.name,
              message: this.userMsg.msg,
            };
            this.socket.emit("sendMessage", info);
            this.userMsg.msg = "";
          },
        },
      });
    </script>
  </body>
</html>
```

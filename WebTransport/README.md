#### 什么是 WebTransport？

[WebTransport](https://w3c.github.io/webtransport/) 是一个 Web API，使用 [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) 协议作为双向传输。它用于 Web 客户端和 HTTP/3 服务器之间的双向通信。它支持通过其[数据报 API](https://web.dev/i18n/zh/webtransport/#datagram) 以不可靠方式发送数据以及通过其[流 API](https://web.dev/i18n/zh/webtransport/#stream) 以可靠方式发送数据。

[数据报](https://datatracker.ietf.org/doc/html/draft-ietf-quic-datagram-00)非常适合发送和接收不需要严格保证交付的数据。单个数据包的大小受到[底层连接的最大传输单元（MTU)](https://en.wikipedia.org/wiki/Maximum_transmission_unit)的限制，可能会或可能不会成功传输，如果传输，他么可能以任意顺序到达。这些特性使数据报 API 成为低延迟、尽力而为的数据传输的理想选择。您可以将数据报视为[用户数据报协议（UDP）](https://en.wikipedia.org/wiki/User_Datagram_Protocol)消息，但经过加密和拥塞控制。

相比之下，流 API 提供[可靠](<https://en.wikipedia.org/wiki/Reliability_(computer_networking)>)、有序的数据传输，非常适合需要发送或接收一个或多个有序数据流的场景。使用多个 WebTransport 流类似于建立多个 [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) 连接，但由于 HTTP/3 在底层使用了[轻量级的 QUIC 协议](https://www.chromium.org/quic/)，因此可以在没有太多开销的情况下打开和关闭。

```
WebTransport同时支持TCP与UDP
Websocket属于TCP协议
```

`WebTransport 与 UDP 套接字 API 不相同`，WebTransport 不是 `UDP 套接字 API`。虽然 WebTransport 使用 `HTTP/3`，而 `HTTP/3 在幕后使用 UDP`，但 WebTransport 对加密和拥塞控制有要求，这使其不仅仅是基本的 UDP 套接字 API。

WebTransport 可以替代 WebRTC 数据通道，用于客户端-服务端连接。[WebTransport 与 WebRTC 数据通道](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCDataChannel)共享许多相同的属性。

通常，与维护 WebRTC 服务器相比，运行兼容 HTTP/3 的服务器需要更少的设置和配置，HTTP/3 涉及了解多种协议（[ICE](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates)、[DTLS](https://webrtc-security.github.io/#4.3.1.) 和 [SCTP]()）以获得有效的传输。WebRTC 需要更多可能导致客户端/服务器协商失败的移动部分。与 WebRTC 不同，[WebWorkers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers) 内部支持 WebTrandport，它允许您独立于给定的 HTML 页面执行客户端-服务器通信。由于 WebTransport 有一个兼容[流](https://streams.spec.whatwg.org/)的接口，因此支持围绕[背压](https://streams.spec.whatwg.org/#backpressure)的优化。

WebTransport 的设计基于现代 Web 平台基本类型（如 [Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)）。它在很大程度上依赖于 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)，并且可以很好的与 [async 和 await](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Async_await) 配合使用。

WebTransport [初始试用](https://web.dev/i18n/zh/webtransport/#register-for-ot)支持三种不同类型的流量：数据报、单向流、双向流。

&nbsp;

[一个测试连接到服务端的客户端小页面](https://googlechrome.github.io/samples/webtransport/client.html)

- 连接到服务器

可以通过创建 `WebTransport` 实例连接到 `HTTP/3` 服务器。`URL 的模式`应为 `https`（需要直接指定端口号）。

使用 `ready` Promise 来等待建立连接。在完成设置之前，不会履行该 Promise，如果在 QUIC/TLS 阶段连接失败，被拒绝该 Promise。

closed Promise 在连接正常关闭时会履行，如果意外关闭，则会被拒绝。

如果服务器由于[客户端指示](https://datatracker.ietf.org/doc/html/draft-vvv-webtransport-quic-01#section-3.2)错误（如 URL 的路径无效）而拒绝连接，则会导致`closed`拒绝，而`ready`任未解析。

```js
const url = "https://example.com:4999/foo/bar";
const transport = new WebTransport(url);

// 连接关闭
transport.closed
  .then(() => {
    console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
  })
  .catch((error) => {
    console.log(`The HTTP/3 connection to ${url} close due to ${error}.`);
  });

// 一旦 .ready 满足，就可以使用连接
await transport.ready;
```

- 数据报 API

一旦拥有连接到服务器的 WebTransport 实例，就可以使用它来发送和接收离散的数据位，称为[数据报](https://en.wikipedia.org/wiki/Datagram)。

`writeable` getter 返回一个 WriteableStream，Web 客户端可以使用它向服务器发送数据。`readable` getter 返回一个 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)，允许侦听来自服务器的数据。这两个流本质上都是不可靠的，因此服务器可能收不到写入的数据，反之亦然。两种类型的流都使用 [Unit8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 实例进行数据传输。

```js
// 向服务器发送两个数据报
const writer = transport.datagrams.writable.getWriter();
const data1 = new Unit8Array([65, 66, 67]);
const data2 = new Unit8Array([68, 69, 70]);
write.write(data1);
write.write(data2);

// 从服务器读取数据报
const reader = transport.datagrams.readable.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    break;
  }
  // 值位 Unit8Array
  console.log(value);
}
```

- 流 API

连接到服务器后，您还可以使用 WebTransport 通过其 Streams API 发送和接收数据。

所有流的每个块都是一个 Unit8Array。与数据报 API 不同，这些流都是可靠的。

> 发送流 SendStream

[SendStream](https://w3c.github.io/webtransport/#sendstream) 有 Web 客户端使用 `WebTransport 实例`的 `createSendStream()`方法创建，该方法返回对 `SendStream` 的 Promise。

使用 [WriteableStreamDefaultWriter](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter) 的 close()方法关闭关联的 HTTP/3 连接。浏览器尝试在实际关闭关联的连接之前发送所有挂起的数据。

```js
// 向服务器发送两个 Unit8Array
const stream = await transport.createSendStream();
const writer = stream.writeable.getWriter();
const data1 = new Unit8Array([65, 66, 67]);
const data2 = new Unit8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);
try {
  await writer.close();
  console.log("All data has been sent.");
} catch (error) {
  console.error(`An error occurred: ${error}`);
}
```

同样，使用 WriteableStreamDefaultWriter 的 abort() 方法将 QUIC RESET STREAM 发送到服务器。使用 abort()时，浏览器可能会丢弃任何尚未发送的挂起的数据。

```js
const ws=await transport.createSendStream();
const writer=ws.getWriter();
writer.write(...)
writer.write(...)
await writer.abort();
// 并非所有数据都已写入。
```

> 接收流 ReceiveStream

ReceiveStream 由服务器发起。对于网络客户端，获取 ReceiveStream 的过程分为两步。 首先，它调用 WebTransport 实例的 receiveStreams() 方法，该方法返回一个 ReadableStream。该 ReadableStream 的每个块又是一个 ReceiveStream，可用于读取服务器发送的 Uint8Array 实例。

```js
async function readFrom(receiveStream) {
  const reader = receiveStream.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // 值为 Uint8Array
    console.log(value);
  }
}

const rs = transport.receiveStreams();
const reader = rs.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  // 值为 ReceiveStream 的一个实例
  await readFrom(value);
}
```

您可以使用 ReadableStreamDefaultReader 的 closed promise 来检测流关闭。当使用 FIN 位关闭底层 HTTP/3 连接时，在读取所有数据后会履行 closed promise。当 HTTP/3 连接突然关闭时（例如，由 STREAM_RESET 关闭)，则 closed promise 会被拒绝。

```js
// 假设一个活动的接收流
const reader = receiveStream.readable.getReader();
reader.closed
  .then(() => {
    console.log("The receiveStream closed gracefully.");
  })
  .catch(() => {
    console.error("The receiveStream closed abruptly.");
  });
```

> BidirectionalStream

BidirectionalStream 可能由服务器或客户端创建。

Web 客户端可以使用 `WebTransport` 实例的 {code 0}createBidirectionalStream() 方法创建一个，该方法会返回对 `BidirectionalStream` 的 promise。

```js
const stream = await transport.createBidirectionalStream();
// stream 是一个 BidirectionalStream
// stream.readable 是一个 ReadableStream
// stream.writable 是一个 WritableStream
```

您可以使用 `WebTransport` 实例的 `receiveBidirectionalStreams()` 方法侦听服务器创建的 `BidirectionalStream`，该方法返回 `ReadableStream{ /code3}`。该 `<code data-md-type="codespan">ReadableStream` 的每个块又是一个 `BidirectionalStream`

```js
const rs = transport.receiveBidrectionalStreams();
const reader = rs.getReader();
while (true) {
const {done, value} = await reader.read();
if (done) {
break;
}
// value 是一个 BidirectionalStream
// value.readable 是一个 ReadableStream
// value.writable 是一个 WritableStream
}
BidirectionalStream 只是 SendStream 和 ReceiveStream 的组合。前两个部分中的示例解释了如何使用它们中的每一个。
```

&nbsp;

---

Example of sending unreliable game state to server using datagrams

使用数据报向服务器发送不可靠的游戏状态的例子

```js
// The app provides a way to get a serialized state to send to the server
function getSerializedGameState() { ... }

const wt = new WebTransport('https://example.com:10001/path');
const writer = wt.datagrams.writable.getWriter();
setInterval(() => {
const message = getSerializedGameState();
writer.write(message);
}, 100);
```

Example of sending reliable game state to server using a unidirectional send stream

使用单向发送流向服务器发送可靠游戏状态的例子

```js
// The app provides a way to get a serialized state to send to the server.
function getSerializedGameState() { ... }

const wt = new WebTransport('https://example.com:10001/path');
setInterval(async () => {
const message = getSerializedGameState();
const stream = await wt.createUnidirectionalStream();
const writer = stream.getWriter();
writer.write(message);
writer.close();
}, 100);
```

Example of receiving media pushed from server using unidirectional receive streams

使用单向接收流接收从服务器推送的媒体的例子

```js
// The app provides a way to get a serialized media request to send to the server
function getSerializedMediaRequest() { ... }

const wt = new WebTransport('https://example.com:10001/path');

const mediaSource = new MediaSource();
await new Promise(resolve => mediaSource.addEventListener('sourceopen', resolve, {once: true}));
const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="opus, vp09.00.10.08"');

// App-specific request
const mediaRequest = getSerializedMediaRequest();
const requestStream = await wt.createUnidirectionalStream();
const requestWriter = requestStream.getWriter();
requestWriter.write(mediaRequest);
requestWriter.close();

// Receive the responses.
for await (const receiveStream of wt.incomingUnidirectionalStreams) {
for await (const buffer of receiveStream) {
sourceBuffer.appendBuffer(buffer);
}
await new Promise(resolve => sourceBuffer.addEventListener('update', resolve, {once: true}));
}
```

Example of receiving notifications pushed from the server, with responses

接收从服务器推送的通知的例子，并有回应

```js
// The app provides a way to deserialize a notification received from the server.
function deserializeNotification(serializedNotification) { ... }
// The app also provides a way to serialize a "clicked" message to send to the server.
function serializeClickedMessage(notification) { ... }

const wt = new WebTransport('https://example.com:10001/path');
for await (const {readable, writable} of wt.incomingBidirectionalStreams) {
const buffers = []
for await (const buffer of readable) {
buffers.push(buffer)
}
const notification = new Notification(deserializeNotification(buffers));
notification.addEventListener('onclick', () => {
const clickMessage = encodeClickMessage(notification);
const writer = writable.getWriter();
writer.write(clickMessage);
writer.close();
});
}
```

Example of requesting over pooled HTTP and receiving media pushed out-of-order and unreliably over the same network connection

通过汇集的 HTTP 请求，并在同一网络连接上接收不按顺序和不可靠地推送的媒体的例子

```js
const mediaSource = new MediaSource();
await new Promise((resolve) =>
  mediaSource.addEventListener("sourceopen", resolve, { once: true })
);
const sourceBuffer = mediaSource.addSourceBuffer(
  'video/webm; codecs="opus, vp09.00.10.08"'
);
const wt = new WebTransport("/video", { allowPooling: true });
await fetch("https://example.com/babyshark");
for await (const datagram of wt.datagrams.readable) {
  sourceBuffer.appendBuffer(datagram);
  await new Promise((resolve) =>
    sourceBuffer.addEventListener("update", resolve, { once: true })
  );
}
```

Example of requesting over HTTP and receiving media pushed out-of-order and reliably over the same network connection

通过 HTTP 请求，并通过同一网络连接可靠地接收不按顺序推送的媒体的例子

```js
const mediaSource = new MediaSource();
await new Promise((resolve) =>
  mediaSource.addEventListener("sourceopen", () => resolve(), { once: true })
);
const sourceBuffer = mediaSource.addSourceBuffer(
  'video/webm; codecs="opus, vp09.00.10.08"'
);
const wt = new WebTransport("https://example.com/video");
for await (const receiveStream of transport.incomingUnidirectionalStreams) {
  for await (const buffer of receiveStream) {
    sourceBuffer.appendBuffer(buffer);
  }
  await new Promise((resolve) =>
    sourceBuffer.addEventListener("update", resolve, { once: true })
  );
}
```

WebTransport 可以支持多种协议，每种协议都提供以下一些功能。

单向流是在一个方向上无限长的字节流，当接收器无法足够快地读取或受网络容量/拥塞限制时，向发送器施加背压。对于发送不期望响应的消息很有用。通过在单个流中发送许多消息，可以实现有序、可靠的消息传递。可以通过每个流发送一条消息来实现无序消息传递。

双向流是全双工流。双向流实际上是一对单向流。

数据报是小的、无序的、不可靠的消息。它们对于发送比流更少的 API 复杂性和更少的网络开销的消息很有用。

WebTransport over HTTP/3 是建立在 HTTP/3 之上的 WebTransport 协议。它是 WebTransport 目前唯一支持的协议。未来可能会支持更多协议，例如基于 HTTP/2 的 WebTransport。

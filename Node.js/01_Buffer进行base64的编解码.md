#### 进行 Base64 的编解码操作

```js
// 使用 Buffer.from()方法与toString()方法进行base64编码
const str = "我是待编码的字符串"; // 需要进行base64编码的字符串
const strBase64 = Buffer.from(str, "utf-8").toString("base64"); // 进行base64编码

// 使用Buffer.from()方法与toString()进行base64解码
const verifyStr = Buffer.from(strBase64, "base64").toString("utf-8"); // 进行base64解码
```

[TOC]

什么是 url
通常我们在浏览器地址栏中输入的网站地址叫做 url（Uniform Resource Locator，统一资源定位符）。就像每户人家的门牌地址一样，每个网页都有哟个 internet 地址。当我们在浏览器地址框中输入一个 url 或是单击一个超级链接时，url 就确定了要浏览的地址。

一个简单的 url 地址：http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument

- http:// ：代表超文本传输协议，通常不用输入，协议类型有：http、https、ftp（文件转换）、file（获取文件）、data（获取外部资源）、mailto（用户打开邮箱和客户端）
- www.example.com：表示域名，标明需要请求的服务器的地址
- :80：端口号，标明获取服务器资源的入口。用于区分服务器的端口，可通过 IP 地址+端口号来区分不同的服务。
- /path/to/myfile.html 文件路径， 表示服务器上资源的路径。此路径表示的是一个抽象地址，并不指代任何物理地址。
- ?key1=value1&key2=value2 请求参数，这些参数以键值对的形式，通过&符号分割开来。
- #SomewhereInTheDocument 对资源的部分补充(fragment),可以理解为资源内部的书签。用来向服务器指明战士的内容所在书签的点。比如对于 html 来说，点击目录会滚动到特定的位置或者上次浏览过的位置。

&nbsp;

-获取 url 请求参数对象

```js
/**
 * 获取url地址栏查询参数
 * url：可选参数，默认值是当前url网页地址
 * name：可选参数，表示需要获取的查询参数
 * **/
function queryUrlParams(url, name) {
  // 如果没有传递
  const currentUrl = url || window.location.href;
  const regular =
    /([0-9a-zA-Z_-\u4e00-\u9fa5]+)=([0-9a-zA-Z-_\u4e00-\u9fa5]+)/g;
  const params = {};
  if (!currentUrl.includes("?")) return undefined;
  currentUrl
    .split("?")[1]
    .split("#")[0]
    .replace(regular, function (_, k, v) {
      params[k] = v;
    });
  return name ? params[name] : params;
}

queryUrlParams(
  "http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument",
  "name"
); // undefined

queryUrlParams(
  "http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument"
); // { key1:"value1", key2:"value2" }

queryUrlParams(
  "http://www.runoob.com/index.php?id=1-234-2&image=awesome.jpg",
  "id"
); // 1-234-2

queryUrlParams("http://www.runoob.com/index.php?name=张三&sex=男&age=18"); // { name: "张三", sex: "男", age: "18" }

queryUrlParams(null, "name"); // undefined
```

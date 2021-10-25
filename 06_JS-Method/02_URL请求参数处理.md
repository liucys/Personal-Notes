URL：统一资源定位器

- 语法规则：

  > scheme://host.domain:port/path/filename

- scheme - 定义因特网服务的类型。最常见的类型是 http
- host - 定义域主机（http 的默认主机是 www）
- domain - 定义因特网域名，比如 baidu.com
- :port - 定义主机上的端口号（http 的默认端口号是 80）
- path - 定义服务器上的路径（如果省略，则文档必须位于网站的根目录中）。
- filename - 定义文档/资源的名称

获取 url 查询参数,以对象形式返回

```js
const url =
  "http://github.com/user/authorize?response_type=code&client_id=y6i6J5isppy27biV22ap&redirect_uri=http://localhost:3002/login&scope=openid&state=xxxx";

// 获取url查询参数内容,以对象形式输出。
function getURLParams(url) {
  uri = url ? url : window.location.href;
  return (uri.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => (
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  );
}
console.log(getURLParams(url)); // {response_type: 'code', client_id: 'y6i6J5isppy27biV22ap', redirect_uri: 'http://localhost:3002/login', scope: 'openid', state: 'xxxx'}
```

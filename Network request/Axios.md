Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

#### 特性

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

安装

```js
npm install axios
# or
yarn add axios
```

axios 简单配置

```typescript
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: 5000,
};

// axios example
const request = axios.create(baseConfig);

// request interceptor
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You can add a token to the request header here
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// response interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can do some custom error handling here
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default request;
```

#### 安装 axios

```js
npm install -s axios
# 或者
yarn add axios
```

&nbsp;

#### 首先自定义配置 axios

> 在 src 文件夹中新建 utils 文件夹,并在该文件夹下创建 request.js 文件

```js
/*
 * /src/utils/request.js
 */
import axios from "axios"; // 引入axios
import { getYuanXiToken } from "./token"; // token

// 创建axios实例
const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:8044" : "",
  timeout: 5000, // 超时时间
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    if (getYuanXiToken()) {
      // 如果存在token,就将token加入请求头中
      config.headers = { authorization: getYuanXiToken(), ...config.headers };
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    // 响应错误处理,可以通过响应状态码进行相应的操作
    if (err.response) {
      if (err.response.status === 401) {
        alert("需要登录");
      }
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err.message);
  }
);

export default http;
```

#### 其次,在 src 文件夹下的 main.js 文件进行引入使用声明

```js
/**
 * /src/main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "./utils/request"; // 引入axios

const app = createApp(App);

// 全局挂载
app.config.globalProperties.$http = http;

app.use(store).use(router).mount("#app");
```

#### 接下来我们就可以在其他 .vue 文件中通过 Composition(组合)API 获取到该挂载实例进行使用了

```html
<template>
  <div class="home">
    <span>Home Page</span>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
  import { getCurrentInstance } from "vue"; // 从vue中导入getCurrentInstance,getCurrentInstance支持访问内部组件实例。

  export default {
    name: "Home",
    components: {},
    setup() {
      const { proxy } = getCurrentInstance(); // proxy相当于一个vue2中的this(但是请不要真的把它当做this使用)
      // 调用$http进行网络请求
      proxy.$http
        .post("/api/v1/official-account", { title: "今日社死" })
        .then((res) => {
          console.log(res);
        });
      return {
        msg: "Hello",
      };
    },
  };
</script>
```

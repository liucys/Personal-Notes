在项目中封装 请求插件 axios

- 首先，安装 axios

```
yarn add axios
```

- 然后，在项目 src 文件夹下创建 axios 文件夹，并创建 index.js 文件和 api.js 文件,分别进行配置

配置 `index.js` 文件

```js
import axios from "axios";
import { Message } from "element-ui";
import { getUserToken } from "../utils/contant";

// Error code information
const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "登录信息已过期，请重新登录",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://test.com";

// basic configuration
const baseConfig = {
  baseURL,
  timeout: 50000,
};

// global default configuration
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.withCredentials = false;

const http = axios.create(baseConfig);

// request interception
http.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    token && (config.headers.authorization = `Bearer ${token}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interception
http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    const { response } = error;
    if (response && response.status) {
      const errorCode = response.status;
      const errorMessage = codeMessage[errorCode] || response.statusText;
      switch (error.response.status) {
        case 400:
          error.message = errorMessage;
          break;
        case 401:
          error.message = errorMessage;
          Message.error(errorMessage);
          break;
        case 403:
          error.message = errorMessage;
          break;
        case 404:
          error.message = errorMessage;
          break;
        case 500:
          error.message = errorMessage;
          break;
        default:
          error.message = errorMessage;
      }
      return Promise.reject(error);
    }
    Message.error("服务器响应超时，请刷新当前页进行重试");
    error.message = "服务器响应超时，请刷新当前页进行重试";
    return Promise.reject(error);
  }
);

export default http;
```

配置 `api.js` 文件（用于统一管理接口）

```js
// api.js文件，进行请求api统一管理
import http from "./index";

const ErrorInfo = {
  status: "error",
  message: null,
};

const user = {
  getCurrentUser: async () => {
    try {
      const result = await http.get("/api/v1/user/currentUser");
      return result.data;
    } catch (error) {
      ErrorInfo.message = error.message;
      return ErrorInfo;
    }
  },
  login: async (data) => {
    try {
      const result = await http.post("/api/v1/user/login", data);
      return result.data;
    } catch (error) {
      ErrorInfo.message = error.message;
      return ErrorInfo;
    }
  },
};

export default {
  user,
};
```

- 接下来，在 `main.js` 文件中进行引入挂载 `api.js` 文件。

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import element from "./plugins/element.js";
import api from "./axios/api";

Vue.config.productionTip = false;
Vue.use(element);

Vue.prototype.$api = api; // 可以在页面中通过 this.$api.xxx的方式调用

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

- 最后，我们在 .vue 文件中调用即可

```js
methods: {
    async handleClickLogin() {
      this.loading = true;
      const { username, password } = this.loginForm;
      if (username && password) {
        const result = await this.$api.user.login(this.loginForm);
        this.loading = false;
        const { status, message, data } = result;
        // login success
        if (status === "ok") {
          saveUserToken(data.token);
          return;
        }
        // login failed
        this.$message.error(message);
        return;
      }
      this.$message.error("用户名或密码不能为空");
      this.loading = false;
    },
  },
```

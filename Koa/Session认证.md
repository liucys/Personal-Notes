基于 Session 进行的登陆认证

> session 是一种记录服务器和客户端会话状态的机制，它是`基于 cookie 实现`的。`session 存储在服务器端，sessionId 会被存储到客户端的 cookie 中。`

Session 认证基本流程：

- 客户端发起认证请求（比如提交用户名密码等信息进行登陆认证）
- 服务端验证通过后，生成相应的 Session 对象（比如用户角色、登陆状态等）。
- 服务器响应时将此 Session 的唯一标识信息 SessionId 返回给客户端。客户端接收到后，会自动将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionId 属于那个域名。
- 之后客户端每次进行新的请求时（连接访问服务端），浏览器会自动判断此域名下是否存在 Cookie 信息，如果存在则自动将 Cookie 信息也发送到服务端。
- 在服务端解析 Cookie，获取 SessionId，查找与之对应的 Session 对象，如果 Session 对象存在，则表示用户已经登陆，可以进行后面的操作（返回请求的数据等)。如果 Session 对象不存在或已过期，怎进行相应的错误信息处理。

使用 session 时需要考虑的问题：

- 将 session 存储在服务器里面，当用户同时在线量比较多时，这些 session 会占据较多的内存，需要在服务端定期的去清理过期的 session
- 当网站采用集群部署的时候，会遇到多台 web 服务器之间如何做 session 共享的问题。因为 session 是由单个服务器创建的，但是处理用户请求的服务器不一定是那个创建 session 的服务器，那么该服务器就无法拿到之前已经放入到 session 中的登录凭证之类的信息了。
- 当多个应用要共享 session 时，除了以上问题，还会遇到跨域问题，因为不同的应用可能部署的主机不一样，需要在各个应用做好 cookie 跨域的处理。
- sessionId 是存储在 cookie 中的，假如浏览器禁止 cookie 或不支持 cookie 怎么办？一般会把 sessionId 跟在 url 参数后面即重写 url，所以 session 不一定非得需要靠 cookie 实现
- 移动端对 cookie 的支持不是很好，而 session 需要基于 cookie 实现，所以移动端常用的是 token。

Cookie 和 Session 的区别

- 安全性不同：Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。
- 存取值的类型不同：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。
- 有效期不同：Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效。
- 存储大小不同：单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源，因此选用 cookie 还是 session 技术，更多取决于你自身系统的需求。

### 在 koa 服务中使用 session 进行认证

安装插件

```
yarn add koa-session
```

- 首先，在入口文件中声明 session

```ts
import koa from "koa";
import { loadControllers } from "koa-router-ts";
import staticDev from "koa-static";
import logger from "koa-pino-logger";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import path from "path";
import cors from "koa2-cors";

// init db model
import "./models";

const staticPath = "./public";
const PORT = process.env.PORT || 8080;

const app = new koa();

// 密钥字符串
app.keys = [`${process.env.APP_SESSION_AUTH}`];

// session 配置信息
const CONFIG = {
  key: "koa.sess", // 默认值，cookie 中sessionId的格式
  maxAge: 2 * 60 * 60 * 1000, // cookie过期时间，这里表示 2小时
  autoCommit: true, // 默认 true , 自动将 session 及 sessionid 提交至 header 返回给客户端
  overwrite: true, // 默认 true , 是否允许重写。
  httpOnly: true, //  默认 true , 防止XSS攻击, 防止恶意脚本代码劫持 session。
  signed: true, // 默认 true , 会自动给cookie加上一个sha256的签名, 防止篡改和伪造 Cookie 。
  rolling: false, // 默认false，每次响应是否刷新session有效期
  renew: false, // 默认 false , 在 session 过期时刷新有效期。
  secure: false, // 默认 false , 只在 https 中传输。
  sameSite: null, // 默认 null , 不设置
};

// 以中间件的方式使用session
app.use(session(CONFIG, app));

app.use(staticDev(path.join(__dirname, staticPath)));
app.use(bodyParser());
app.use(logger());
app.use(cors());

const router = loadControllers(path.join(__dirname, "controllers"), {
  recurse: true,
});

router.prefix("/api/v1");

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`The service statrs on port ${PORT}`);
});
```

- 然后，声明一个中间件用于鉴权路由是否携带了 session 信息。

```ts
export default function auth() {
  return async function (ctx: any, next: any) {
    // ...进行路由session鉴权
  };
}
```

- 在入口文件中挂在鉴权中间件
- 在第一次请求服务时进行设置 session（如登陆)

```ts
/**
   * 登陆
   * @param ctx
   * @param form
   * @returns
   */
  async login(ctx: any, form: any): Promise<IResponse> {
    try {
      const { username, password } = form;
      if (!username || !password) {
        return new ErrorResponse(INVALID_REQUEST, "账户或密码不能为空!");
      }
      const user = await this.checkUserName(username);
      if (!user) {
        return new ErrorResponse(INVALID_REQUEST, "该账户不存在!");
      }
      if (user.password !== md5(password)) {
        return new ErrorResponse(INVALID_REQUEST, "密码不正确!");
      }
      const payload = {
        id: user.id,
        name: user.fullname,
        email: user.email,
        avatar: user.avatar,
        company: user.company,
        role: user.role,
      };
    //   设置session（鉴权路由时可以判断是否存在ctx.session.user或是否过期
      ctx.session.user = payload;
      return new SuccessResponse(
        {
          user: payload,
        },
        "操作成功"
      );
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }
```

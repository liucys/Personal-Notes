在 next.js 中使用 next-auth 实现账户、密码登陆。

安装依赖

```
yarn add next-auth
```

- 第一步：创建目录文件 `/pages/api/auth/[...nextauth].js`

```js
// [nextauth].js 文件
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 配置登陆供应方
const providers = [
  CredentialsProvider({
    // 唯一域名（根据官方文档设置）
    name: "Credentials",
    //  声明希望自动生成的表单内容(当没有自定义登陆页面时，默认会根据此处选项生成相应的页面表单)
    credentials: {
      username: {
        label: "账户",
        type: "text",
        placeholder: "请输入登陆账户",
      },
      password: {
        label: "密码",
        type: "password",
        placeholder: "请输入登陆密码",
      },
    },
    /**
     * 此处用于校验表单数据有效：可以进行http请求、sql查询等。
     * @param {*} credentials 对象类型，表示接收到的表单值
     * @param {*} req 对象类型，表示 http request 信息
     *
     * 当逻辑处理成功时，返回用户信息（例如：{ id: 1, name: 'J Smith', email: 'jsmith@example.com' }），则表示登陆成功。
     * 当逻辑处理失败时，应当返回值为 null 或者 false。表示请求失败
     */
    async authorize(credentials, req) {
      try {
        const result = await fetch("http://localhost:8080/api/v1/user/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const response = await result.json();
        const { user, token } = response.data;
        // 返回用户信息
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          company: user.company,
          email: user.email,
          role: user.role,
          accessToken: token,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  }),
];

export default NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // 如果这里设置的不是 jwt，那么 jwt 回调函数不会触发
    maxAge: 2 * 60 * 60,
  },
  //   回调函数，可以进行访问控制并于外部数据库或API集成
  callbacks: {
    /**
     * // 控制是否允许用户登陆
     * return true 表示允许登陆
     * return false 表示不允许登陆
     * @param {*} param0
     * @returns
     */
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    /**
     * 每当用户被重定向到回调URL（例如登陆或注销）时，都会调用此函数；
     * 默认情况下，仅允许与站点位于同一 URL 上的 URL，您可以使用重定向回调来自定义该行为。
     * @param {*} param0
     * @returns
     */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    /**
     * 每当创建 JSON Web令牌（即登陆）或更新（即每当在客户端访问会话）时都会调用此回调，返回的值将被加密，并存储在cookie中。
     * 参数 user、account、profile、isNewUser仅在用户登陆后第一次在新绘画上调用此回调时传递。在后续调用中，仅token可用。
     * @param {*} param0
     */
    async jwt({ token, user, account, profile, isNewUser }) {
      // 在登录后立即将OAuth access_token 保留到该令牌
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    /**
     * 每当检查会话时，都将调用此回调。
     * 使用数据库会话时，用户对象将作为参数传递。
     * 将 JSON Web token 用于会话时，将提供JWT有效负载
     * @param {*} param0
     * 当使用JSON Web Tokens时，jwt()回调在session()回调之前被调用，所以你添加到JSON Web Token中的任何东西都将立即在session回调中可用，例如，来自提供者的access_token。
     */
    async session({ session, user, token }) {
      // 将属性发送到客户端，比如来自提供者的访问令牌。
      session.accessToken = token.accessToken;
      return session;
    },
  },
  //   相关页面配置
  pages: {
    signIn: "/login", // 自定义登陆页面
  },
  debug: process.env.NODE_ENV === "development",
});
```

- 第二步：设置 目录文件 `/pages/_app.js`

```js
// _app.js文件
import "../styles/globals.less";
import { SessionProvider, useSession } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default MyApp;

// 加载动画
function Loading() {
  return (
    <div className="loading_container">
      <div className="loading_balls">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <style jsx>
        {`
          .loading_container {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .loading_balls {
            width: 3.5em;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
          }

          .loading_balls div {
            width: 0.8em;
            height: 0.8em;
            border-radius: 50%;
            background-color: #262626;
            transform: translateY(-100%);
            animation: wave 0.8s ease-in-out alternate infinite;
          }

          .loading_balls div:nth-of-type(1) {
            animation-delay: -0.4s;
          }

          .loading_balls div:nth-of-type(2) {
            animation-delay: -0.2s;
          }

          @keyframes wave {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(100%);
            }
          }
        `}
      </style>
    </div>
  );
}

// 认证判断
function Auth({ children }) {
  const { status } = useSession({ required: true });
  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  }
  return children;
}
```

- 第三步：设置登陆页面 `/pages/login.js`

```js
// /pages/login.js 文件
import React from "react";
import styles from "../styles/SignIn.module.less";
import { Form, Input, Button, Alert } from "antd";
import { useRouter } from "next/router";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getCsrfToken, signIn } from "next-auth/react";

function SignIn({ csrfToken }) {
  const [form] = Form.useForm();
  const router = useRouter();
  const { callbackUrl, error } = router.query;

  //   提交数据
  const handleFormSubmit = async (values) => {
    // 方式一(需要手动登陆成功后的回调地址)
    signIn("credentials", { ...values, callbackUrl: callbackUrl || "/" });

    // 方式二
    // const formEle = document.createElement("form");
    // formEle.setAttribute("action", "/api/auth/callback/credentials");
    // formEle.setAttribute("method", "POST");
    // const keys = Object.keys(values);
    // keys.forEach((key) => {
    //   const inputEle = document.createElement("input");
    //   inputEle.setAttribute("name", key);
    //   inputEle.setAttribute("value", values[key]);
    //   formEle.appendChild(inputEle);
    // });
    // document.body.appendChild(formEle);
    // formEle.submit();
    // document.body.removeChild(formEle);
  };

  return (
    <div className={styles.container}>
      <div className={styles.login_content}>
        <div className={styles.header}>
          <div>
            {error && (
              <Alert
                message="账户或密码错误，请确认后重新登陆!"
                closable
                type="error"
                showIcon
              />
            )}
          </div>
        </div>
        <Form
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{ csrfToken }}
        >
          <Form.Item hidden name="csrfToken">
            <Input />
          </Form.Item>
          <Form.Item
            label=""
            name="username"
            rules={[{ required: true, message: "请输入登陆账户" }]}
          >
            <Input prefix={<UserOutlined />} autoComplete="off" size="large" />
          </Form.Item>
          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: "请输入登陆密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => form.submit()}
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default SignIn;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
```

- 第四步：在其他页面调用登陆/退出登陆相关的方法

```js
import Head from "next/head";
import { Button } from "antd";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/Home.module.less";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {session?.user ? (
            <Button onClick={() => signOut()} type="primary">
              退出登陆
            </Button>
          ) : (
            <Button onClick={() => signIn()} type="primary">
              登陆
            </Button>
          )}
        </div>
        <div>
          {session?.user && (
            <h1>
              欢迎您，{session.user.name},<Link href="/admin">前往万春楼</Link>
            </h1>
          )}
        </div>
      </main>
    </div>
  );
}
```

- 其他：设置需要登陆才能进入的页面

```js
//  例如 admin页面
import React from "react";
import { getSession } from "next-auth/react";
import { GET } from "../service/axios";

function Admin() {
  return (
    <div>
      <h1>欢迎您，管理员</h1>
    </div>
  );
}

export default Admin;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let users;
  try {
    users = await GET(
      "/api/v1/user",
      {},
      { headers: { authorization: `Bearer ${session.user.accessToken}` } }
    );
    console.log(users);
  } catch (error) {
    console.log(error);
  }
  return {
    props: {},
  };
}

// 当页面设置auth时，表示需要登陆后才能访问
Admin.auth = true;
```

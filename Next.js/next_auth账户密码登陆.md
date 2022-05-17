在 next.js 中使用 next-auth 实现账户、密码登陆。

安装依赖

```
yarn add next-auth
```

- 第一步：创建目录文件 `/pages/api/auth/[...nextauth].js`

```js
// [...nextauth].js 文件
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const providers = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    // 若是不自定义登陆界面，则默认以此内容渲染相应的表单
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
    // 登陆验证逻辑，返回用户信息表示登陆成功，返回 null 或 false 表示登陆失败
    async authorize(credentials, req) {
      try {
        const result = await fetch(
          `${process.env.APP_URL}/api/v1/users/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const resultData = await result.json();
        const { user, access_token } = resultData.data;
        return {
          ...user,
          access_token,
        };
      } catch (error) {
        return null;
      }
    },
  }),
];

export default NextAuth({
  providers,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  jwt: {
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login", // 自定义登陆界面
  },
  theme: {
    colorScheme: "light",
  },
  /**
   * 回调
   * jwt：每当创建 JSON WEB 令牌（即登录时）或更新（即每当在客户端访问会话时）时都会调用此回调，返回的值将被加密并存储在cookie中。
   * session：每当检查会话时（调用getSession()、useSession()、/api/auth/session等方法时），都会调用此会话回调。想使通过jwt()回调添加到令牌中的某些内容可用，则必须在此处显式转发以使其对客户端可用。
   * 回调的优先级：jwt > session
   */
  callbacks: {
    async jwt({ token, user, account }) {
      // 在登陆时判断是否是自定义登录的方式，并将用户信息保存到next-auth生成的token中，（因为next-auth最终提供的用户信息很少，不能满足需要，因此需要我们自己通过传递设置）
      if (account && account.type === "credentials" && user) {
        token.user = user;
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // 自定义会话中的user（因为默认的会话中的user信息不能满足我们的需求）
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
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
      {/* 当页面存在auth属性时，表示需要登陆后才能访问 */}
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

// 权限
function Auth({ children }) {
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  // 已经登陆时，直接进入访问页面
  if (user) {
    return children;
  }
  // 当没有登陆时，展示加载内容（然后会自动定向到登陆页面）
  return <div>...loading</div>;
}
```

- 第三步：设置登陆页面 `/pages/login.js`

```js
// /pages/login.js 文件
import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getCsrfToken, signIn } from "next-auth/react";
import styles from "@/styles/Login.module.less";

function Login({ csrfToken }) {
  const [form] = Form.useForm();
  const router = useRouter();

  //   表单提交
  const handleFormSubmit = async (values) => {
    signIn("credentials", { ...values, callbackUrl: router.query.callbackUrl });
  };

  useEffect(() => {
    // 因为next-auth处于安全考虑，不主动提供错误信息的详细内容传递。因此这里自己判断
    if (router.query.error && router.query.error === "CredentialsSignin") {
      message.error("登录账户或登录密码错误，请重试！");
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.login_bg} />
      <div className={styles.login_form}>
        <div className={styles.form_content}>
          <div className={styles.header}>
            <div className={styles.title}>欢迎，登录</div>
            <div className={styles.sub_title}>请使用集团 OA 账户登录</div>
          </div>
          <Form
            form={form}
            initialValues={csrfToken}
            onFinish={handleFormSubmit}
          >
            <Form.Item name="csrfToken" hidden>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="username"
              label=""
              rules={[{ required: true, message: "请输入登陆账户" }]}
            >
              <Input
                prefix={<UserOutlined />}
                size="large"
                autoComplete="off"
                placeholder="请输入登陆账户"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label=""
              rules={[{ required: true, message: "请输入登陆密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                size="large"
                placeholder="请输入登陆密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                size="large"
                onClick={() => form.submit()}
                className={styles.login_btn}
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;

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
import styles from "../styles/Home.module.less";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "antd";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>HOME PAGE</h1>
        {user ? (
          <Button onClick={() => signOut()}>退出登陆</Button>
        ) : (
          <Button onClick={() => signIn()}>登陆</Button>
        )}
        {user && <div>欢迎您，{user.name}</div>}
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

[TOC]

### 在 Next.js 项目中通过 next-oauth 进行第三方登录（以 github 为例）

&nbsp;

```
// 创建 Next.js 项目
npx create-next-app [project-name]

// 安装 next-auth 库
npm install -s next-auth
```

&nbsp;

案例版本号

```
"next": "12.0.7",
"next-auth": "^4.1.2",
"react": "17.0.2",
"react-dom": "17.0.2"
```

- 首先，在 GitHub 上 [进行配置](https://github.com/settings/developers) 获取 `client_id` 与 `client_secret`。其中 `Authorization callback URL` 配置为 `http://xxxxx/api/auth/callback/github`

- 接下来，创建并配置文件 `[...nextauth].js` ，目录层级为 `pages/api/auth/[...nextauth].js`

```js
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"; // 获取github oauth身份验证提供者

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID, // github client id
      clientSecret: process.env.GITHUB_SECRET, // github client secret
      profile(profile) {
        return {
          id: profile.id,
          name: profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
        };
      },
    }),
    // 使用自定义的第三方oauth应用登陆
    {
      id: "", // 应用的唯一标识
      name: "", // 应用的名称
      type: "oauth",
      clientId: "", // 应用颁发的 client_id
      clientSecret: "", // 应用颁发的 client_secret
      authorization: "", // 应用的认证地址
      token: "", // 认证后请求 access_token的地址
      userinfo: "", // 获取access_token后请求用户信息的地址
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          // ....
        };
      },
    },
  ],
  pages: {
    // 自定义登录页面
    signIn: "/signin",
  },
  theme: {
    colorScheme: "light",
  },
});
```

- 在 `pages/_app.js` 层级文件中配置共享会话状态

```js
import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import Loading from "../components/Loading";

// authority
function Auth({ children }) {
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;

  // if user
  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user. if no user, useEffect() will redirect login page.
  return <Loading />;
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session} refetchInterval={60 * 60}>
      {/* Determine if permission is required by children's auth */}
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
```

Loading 组件

```js
import React from "react";

export default function Loading() {
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
            background-color: #001141;
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
```

- 在 `pages/signin.js` 层级文件中自定义登录界面

```js
import styles from "../styles/Signin.module.css";
import React from "react";
import { getProviders, signIn } from "next-auth/react";

export async function getServerSideProps(context) {
  // 获取在 [...nextauth].js文件中配置的登录配置的程序列表
  const providers = await getProviders();
  return {
    props: {
      providers: providers,
    },
  };
}

export default function signin({ providers }) {
  return (
    <div className={styles.container}>
      {Object.values(providers).map((provider) => {
        return (
          <div
            key={provider.name}
            className={styles.auth}
            // 调用singIn方式进行oauth登录，并且设置登录成功后返回首页
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <div>Sign in with {provider.name}</div>
          </div>
        );
      })}
    </div>
  );
}
```

- 在页面中进行状态判断

```js
import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home(props) {
  // 获取状态信息
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className={styles.container}>
      <header>
        {session ? (
          <button onClick={() => signOut()}>退出登录</button>
        ) : (
          <button onClick={() => signIn()}>登录</button>
        )}
      </header>
      <section>{session && <div>Hello,{session?.user.name}</div>}</section>
    </div>
  );
}

// 设置进入该页面需要登录
// Login access is required to proceed to this page
Home.auth = true;
```

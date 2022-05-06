Next.js 框架并不需要我们去手动配置路由路径。它会根据我们在 `pages` 文件夹下创建的 `.js `文件，从而自动为我们生成相应的路由路径。

目录：

&nbsp;

- [Next.js 中的路由设置案例](#nextjs-中的路由设置案例)
- [Nextjs 中的静态路由跳转方式](#nextjs-中的静态路由跳转方式)
- [Nextjs 中的动态路由跳转方式](#nextjs-中的动态路由跳转方式)
- [Nextjs 中的路由参数处理（传递参数与获取路由参数）](#nextjs-中的路由参数处理传递参数与获取路由参数)
- [路由钩子事件](#路由钩子事件)

&nbsp;

### Next.js 中的路由设置案例

- 静态路由生成

  > 项目文件路径: pages/index.js → 则生成相应的路由路径: `/`
  >
  > 项目文件路径: pages/blog/index.js → 则生成相应的路由路径: `/blog`
  >
  > 项目文件路径: pages/blog/first-post.js → 则生成相应的路由路径: `/blog/first-post`
  >
  > 项目文件路径: pages/dashboard/settings/username.js → 则生成相应的路由路径: `/dashboard/settings/username`

- 动态路由生成

  > 项目文件路径: pages/blog/[slug].js → 则生成相应的路由路径: `/blog/任意路径名称` (例如: `/blog/12345、/blog/hello-world、/blog/new、.....二级路由`都可成功访问跳转)
  >
  > 项目文件路径: pages/blog/[pid].js → 则生成相应的路由路径: `/blog/任意路径名称` (例如: `/blog/12345、/blog/new、.....`都可成功访问跳转)
  >
  > 项目文件路径: pages/[username]/settings.js → 则生成相应的路由路径: `/任意自定义路径名称/settings` (例如: `/ok/settings、/haha/settings、/12345/settings、....`都可成功访问跳转)
  >
  > 项目文件路径: pages/post/[...all].js → 则生成相应的路由路径: `/post/任意多级嵌套自定义路径名称` (例如: `/post/hello、/post/hello/12345、/post/453455、/post/23423/asfaf、/post/news/images/12455、....` 这些路径都可以成功访问跳转)
  >
  > 项目文件路径: pages/post/[...slug].js → 则生成相应的路由路径: `/post/任意多级嵌套自定义路径名称` (例如: `/post/hello、/post/hello/12345、/post/453455、/post/23423/asfaf、/post/news/images/12455、....` 这些路径都可以成功访问跳转)

- 注意
  > 若是已经存在了指定的固定路径路由，则固定路径路由的优先级高于动态路径路由的优先级。例如：
  >
  > 有项目文件路径：pages/profile/create.js —> /profile/create 与 pages/[slug].js —> /profile/:slug(任意自定义路由名称)
  >
  > 则当访问 `/profile/create` 路由路径时,优先访问 `pages/profile/create.js 文件`生成的路径,而不是` pages/profile/[slug].js 文件`生成的路径。

&nbsp;

### Nextjs 中的静态路由跳转方式

- 声明式跳转

  > 通过`next/link`导入的 `Link` 组件将 `<a>` 标签进行包裹，通过 `href` 属性声明我们需要跳转的路由路径。
  >
  > 注意：当我们需要为链接添加样式时,`只能在被 Link 组件包裹的子组件上进行设置`,因为其他任何添加到 Link 组件上的任何非 Link 组件自身属性都不起作用。同时，`被Link组件包裹的元素必须共有一个共同的父元素`。

  ```js
  import React from "react";
  import Link from "next/link";

  export default function FirtsPost() {
    return (
      <div>
        <h1>First Post</h1>
        {/* 返回首页，字符串的形式传递参数 */}
        <Link href="/?username=zhangsan">
          <a>Go Bakc Home</a>
        </Link>
        <br />
        {/* 返回首页，以对象的形式传递参数 */}
        <Link href={{ pathname: "/", query: { username: "zhangsan" } }}>
          <a>Go Back Home</a>
        </Link>
      </div>
    );
  }
  ```

- 函数式跳转

  > 通过`next/router`导入的 Router 对象在函数中进行页面跳转。

  ```js
  import React from "react";
  import Router from "next/router";

  export default function FirtsPost() {
    // 点击事件
    const handleClick = () => {
      /* 返回首页，字符串的形式传递参数 */
      // Router.push("/?username=zhangsan");
      /* 返回首页，对象的形式传递参数 */
      Router.push({
        pathname: "/",
        query: {
          username: "zhangsan",
        },
      });
    };
    return (
      <div>
        <h1>First Post</h1>
        <div onClick={handleClick}>Go Back Home</div>
      </div>
    );
  }
  ```

&nbsp;

### Nextjs 中的动态路由跳转方式

- Link 组件进行跳转

  > 动态路由使用 Link 组件进行跳转时,推荐使用 `as` 重命名这个属性 和 `href` 搭配使用。当出现错误时能够进入 404 中。

```js
import Link from "next/link";

export default function Blog() {
  return (
    <div>
      <h1>Blog Page</h1>
      {/* 形如路径 /pages/list/[id].js 生成的动态路由 /list/:id */}
      <Link href="/list/[id]" as="/list/123456">
        <a>查看</a>
      </Link>
      {/* 形如路径 /pages/list/[...id].js 生成的多级动态路由 /list/:id1/:id2 .... */}
      <Link href="/list/[...id]" as="/list/520/1314">
        <a>查看</a>
      </Link>
    </div>
  );
}
```

- 函数式路由跳转

  > 通过从 `next/router` 中引入的 `useRouter` 获取路由对象，然后调用路由对象的 `push` 方法进行路由跳转。

  ```js
  import { useRouter } from "next/router";

  export default function Blog() {
    const router = useRouter();

    const handleClick = () => {
      // 形如路径 /pages/list/[id].js 生成的动态路由 /list/:id
      router.push("/list/[id]", "/list/123456");
      // 形如路径 /pages/list/[...id].js 生成的多级动态路由 /list/:id1/:id2 ....
      // router.push("/list/[...id]", "/list/520/1314");
    };

    return (
      <div>
        <h1>Blog Page</h1>
        <span onClick={handleClick}>查看</span>
      </div>
    );
  }
  ```

&nbsp;

### Nextjs 中的路由参数处理（传递参数与获取路由参数）

> 在 next.js 框架中,`路由传参仅支持以 query 的形式进行传递`。在 Nextjs 中，如路径：`/pages/blog/[id].js -> /blog/:id`，这种形式生成的动态路由，有 `/blog/123456` 在 Nextjs 路由传参解析中。会被解析为 {query：{id:123456}}的形式。

- 路由传参

  ```js
  import React from "react";
  import Link from "next/router";
  import { useRouter } from "next/router";

  export default function Home() {
    const router = useRouter();

    // 函数式跳转传参
    const handleClick = () => {
      router.push({
        pathname: "/profile",
        query: {
          more: true,
        },
      });
    };

    return (
      <div>
        <h1>Learn Next.js</h1>
        {/* 形如路径：`/pages/blog/[id].js -> /blog/:id`，在next中解析时也相当于query传参 */}
        <Link href="/blog/123456">
          <a>文章</a>
        </Link>
        <Link href="/profile?username=张三">
          <a>张三</a>
        </Link>
        <Link href={{ pathname: "/profile", query: { username: "李四" } }}>
          <a>李四</a>
        </Link>
        <span handleClick={handleClick}>更多</span>
      </div>
    );
  }
  ```

- 获取路由传递参数的方式

  > 因为 nextjs 仅支持 query 传参，且是动态生成路由。因此 next.js 为我们内置了一些方法用于获取参数传递。

1. withRouter 方法

   > 从 `next/router` 中引入的方法，该方法接收一个路由组件作为参数进行处理。被该方法接收的路由组件的 `props` 就会存在一个 `router` 属性，该属性包含了路由相关的数据信息。
   >
   > 注意：该 `withRouter 方法只能作用与页面组件`

   ```js
   import React from "react";
   import { withRouter } from "next/router";

   function Blog(props) {
     // 被withRouter方法接收的页面组件将被添加router属性
     const router = props.router;
     return (
       <div>
         <h1>Blog Page</h1>
       </div>
     );
   }

   // 将页面组件作为参数传递
   export default withRouter(Blog);
   ```

2. useRouter 方法

   > useRouter 方法也是属性 `next/router` 下的一个方法，该方法`返回一个 router 实例对象`。我们可以通过这个实例对象获取到路由的详细信息，同时,该实例对象的 push 方法可以进行新的路由跳转与传参。

   ```js
   import { useRouter } from "next/router";
   export default function Blog() {
     const router = useRouter(); // 获取 router 实例对象;
     console.log(router.query); // 输出路由请求参数

     return (
       <div>
         <h1>Blog Page</h1>
       </div>
     );
   }
   ```

3. getServerSideProps 方法

   > 对于服务端渲染，在导出页面组件的同时，也导出一个 `async` 的 `getServerSideProps` 方法。该方法接收一个 context 参数，这个参数相当于一个上下文对象。这个对象存在一个 `query` 属性，这个属性`解析为对象的 URL 的查询字符串部分`。getServerSideProps 方法`返回一个含有 props 属性的对象`，这个 props 属性值最终会被传递给页面组件的 props 对象属性。
   >
   > 注意：使用 getServerSideProps 方法接收动态路由传参的参数，则进行跳转到此页面时的跳转方法传递参数必须是以对象的形式进行传递，否则会出现 bug 问题。

   ```js
   import React from "react";

   export default function PostsID(props) {
     // 从getServerSideProps方法传递过来的query属性
     const query = props.query;
     return (
       <div>
         <h1>IDs</h1>
       </div>
     );
   }

   export async function getServerSideProps(context) {
     /**
      * 获取查询参数
      * 形如路径：pages/blog/[id].js -> /blog/:id
      * 有 /blog/123456?username=zhangsan
      *  对于query最终会被解析为 query:{ username:'zhangsan', id:'123456' } （若是使用字符串的形式进行跳转传参，则只为 query:{id:'123456'}）
      *  对于params则为{id: '123456'}
      */
     const query = context.query;
     console.log(query);
     return {
       props: {
         query,
       },
     };
   }
   ```

&nbsp;

### 路由钩子事件

> Nextjs 的 router 对象为我们提供了一些可用路由事件，我们可以通过监听这些事件以达到在不同的路由时期实现不同的效果。
>
> 利用路由钩子事件是可以作很多事情的，比如跳转时的加载动画，关掉页面的一些资源计数器.....
>
> 提升：推荐在`pages/_app.js` 中进行路由事件的监听以达到全局的效果

```js
/** pages/_app.js */
import React, { useEffect } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter(); // 获取router对象

  useEffect(() => {
    router.events.on("事件名称", function () {});
  }, []);
  return <Component {...pageProps} />;
}
```

事件名称列表及回调函数参数：

- `routeChangeStart`及`function(url, { shallow })` ： 当路由开始变化时触发
- `routeChangeComplete`及 `function(url, { shallow })`： 当路由结束变化时触发
- `routeChangeError`及 `function(err, url, { shallow })`：当路由跳转出现错误或取消路线加载时触发。
- `beforeHistoryChange`及`function(url, { shallow })`：在更改浏览器历史记录之前触发。
- `hashChangeStart`及`function(url, { shallow })`： hash 跳转开始时触发
- `hashChangeComplete`及`function(url, { shallow })`：hash 跳转完成时触发

```js
** pages/_app.js */
import React, { useEffect } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter(); // 获取router对象

  useEffect(() => {
    router.events.on("routeChangeStart", function (url, { shallow }) {
        console.log('1.routeChangeStart->路由开始变化')
    });

    router.events.on("routeChangeComplete", function (url, { shallow }) {
        console.log('routeChangeComplete->路由结束变化')
    });

    router.events.on("beforeHistoryChange", function (url, { shallow }) {
        console.log('beforeHistoryChange->在改变浏览器 history之前触发')
    });

    router.events.on("routeChangeError", function (url, { shallow }) {
        console.log('routeChangeError->跳转发生错误')
    });
  }, []);

  return <Component {...pageProps} />;
}
```

&nbsp;

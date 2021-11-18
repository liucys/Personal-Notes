[TOC]

#### 什么是 [Next.js](https://www.nextjs.cn/)？

> Next.js 是一个面向生产使用的 React 框架。它为我们提供了许多开箱即用的特性，支持静态渲染/服务端渲染混用，支持 TypeScript，支持打包优化，支持动态路由，按路由加载等。

Next.js 内置的部分功能

- 直观的，基于页面的路由系统（支持动态路由）。
- 预渲染，支持在页面级的静态生成（SSG）和服务端渲染（SSR）。
- 自动代码拆分，提升页面加载速度。
- 具有经过优化的预取功能的客户端路由。
- 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库。
- 开发环境支持快速刷新。
- 利用 serverless function 及 API 路由构建 API 功能
- 完全可扩展。
- ......

Next.js 项目安装

```js
# 若没有全局安装next脚手架，则先全局安装
npm install -g create-next-app

# 然后在文件目录下创建Next项目
npx create-next-app <project name>

# 安装好初始项目后进入项目根目录下，运行命令启动
yarn dev
or
npm run dev
```

&nbsp;

项目结构部分 `根文件夹` 介绍：

- components 文件夹：这里是专门放置自己写的组件的，这里的组件不包括页面，指公用的或者有专门用途的组件。

  > 新的脚手架创建的默认已经不带 components 文件夹了，需要自己手动创建

- pages 文件夹：这里是放置页面的，在这里面创建的文件会自动根据 `二级目录名称以及其下的文件名称` 生成相应的路由，并在服务器端渲染，渲染好后进行数据同步。

  > 若是我们想要建立嵌套路由,如 `/user/profile`, 则只需要在该 `pages 文件夹`下创建 `user 文件夹`,然后 在该文件夹下`创建 profile.js` 文件即可。例如路径：`/pages/blog.js` ,则可以直接通过 `/blog` 进行页面访问

- public 文件夹： 这个是静态文件夹，比如项目需要的图片、图标和静态资源都可以放到这里。

  > 静态文件存放文件夹,存放在 `public` 文件夹下的静态文件可以直接通过路径 `/public/xxx` 的方式获取,例如有图片存放路径 `public/images/me.jpg `,则可以直接通过 `/images/me.jpg` 的方式引用此图片。

- styles 文件夹：存放公共样式文件（当然，要是在 pages 文件夹下的页面组件的样式文件也可存放，但是文件必须以 `.modeule.css结尾`）
  > 全局公共样式文件夹,该文件夹下默认存在两个文件 `globals.css`、`Home.module.css`。但是注意`globals.css` 文件只能在 `pages` 目录下的`_app.js` 文件中引入,它是整个项目的全局样式文件。

&nbsp;

#### Nextjs 默认支持 styled-jsx 库，它是一个 CSS-in-JS 库语法

> 它允许你在 React 组件中编写 CSS，并且 CSS 样式将被限定（其他组件不会受到影响）。我们可以直接在组件界面实现区域通过 style 标签(该标签必须声明 jsx 属性)进行样式的嵌入声明

```js
import React from "react";

export default function FirtsPost() {
  return (
    <div>
      <h1>First Post</h1>
      {/* 嵌入式的样式声明 */}
      <style jsx>
        {`
          h1 {
            color: red;
          }
        `}
      </style>
    </div>
  );
}
```

&nbsp;

### Next.js 中的路由设置

> next.js 框架并不需要我们去手动配置路由路径。它会根据我们在 pages 文件夹下创建的.js 文件，从而自动为我们生成相应的路由路径。

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

### 预渲染与数据获取

默认情况下，Next.js 预渲染每个页面。这意味着 Next.js 会提前为每个页面生成 HTML，而不是全部由客户端 JavaScript 完成。预渲染可以带来更好的性能和 SEO。

> Next.js 有两种形式的预渲染：静态生成和服务端渲染。不同之处在于它何时为页面生成 HTML。
>
> 静态生成是在构建时（即项目进行打包 build）生成 HTML 的预渲染方法。然后在每个请求上重用预渲染的 HTML。
>
> 服务器端渲染是在每个请求上生成 HTML 的预渲染方法。

&nbsp;

#### 静态生成 - getStaticProps 函数

> 静态生成又分为有数据和没有数据的静态生成。当我们需要实现营销页面、博客文章、电子商务产品列表、帮助和文档等页面时，我们应该使用静态生成的方式进行实现。

对于博客文章这一类页面，如果我们不首先获取一些外部数据,就无法呈现 HTML 内容。这就是有数据的静态生成（需要在构建时访问文件系统、获取外部 API 或查询数据库）。Nextjs 为我们提供了一个方法为我们解决这种情况 --- `getStaticProps(context)`

当我们在导出页面组件时，同时也导出一个 `async` 的名为 `getStaticProps` 的函数，这个函数`返回一个含有 props 属性的对象`，该对象的 `props 属性可以透传给页面组件的 props 对象参数`。我们可以在这个函数内部进行访问文件系统、获取外部 API 或查询数据库等操作，然后将数据通过 props 属性透传给页面组件。

即：`getStaticProps 方法的作用是获取组件静态生成需要的数据。`

在开发模式下， getStaticProps 改为在每个请求上运行。
在生产模式下， getStaticProps 只会在构建的时候执行（即构建完静态页面后就不会再调用 getStaticProps 函数了）

```js
import React from 'react';
import axios from 'axios';

export default Blog(props){
    // props对象将会接收到getStaticProps函数透传的data属性。
    return (
        <div>
            <h1>My Blog</h1>
            <ul>
                <li>{data.title}</li>
                <li>{data.author}</li>
                <li>{data.time}</li>
                <li>{data.content}</li>
            </ul>
        </div>
    )
}

export async function getStaticProps(contxt){
    // 外部数据请求
    const data=await axios.get('http://xxxxxx');

    // 透传数据给页面组件的props
    return {
        props:{
            data,
        }
    }
}
```

&nbsp;

#### 静态生成-动态路由 getStaticPaths 函数

> 对于生成静态文件，有时候我们需要根据动态路由的变化预渲染生成相应的静态 HTML。因此需要先获取路由参数。在 nextjs 中为我们提供了`一个用于处理动态路由从而搭配 getStaticProps 函数生成静态文件的函数`。 --- getStaticPaths

当我们在导出页面组件时，同时也导出一个 `async` 的名为 `getStaticPaths` 的函数,这个函数返回一个含有 paths 属性以及 fallback 属性的对象（paths 属性值为数组，表示多个路由路径参数；fallback 属性值是布尔值，表示当用户访问的动态路由参数没有在当前函数中返回时（没有在你要返回的 paths 数组属性中时），是否显示 404 页面，false 表示显示 404，true 表示不显示 404。

```js
import React from "react";

export default function PostsForId(props) {
  return (
    <div>
      <h1>动态路由界面</h1>
      <p>消息：{props.msg}</p>
    </div>
  );
}

/**
 * getStaticPaths函数
 * 返回能够进行匹配的动态路由参数
 *
 * */
export async function getStaticPaths() {
  // 匹配的动态路由参数，这里可以通过网络请求先获取动态路由参数
  const paths = [{ params: { id: "1234" } }, { params: { id: "520" } }];

  return {
    paths, // 返回匹配的动态路由参数列表
    fallback: true, // 当动态路由传递的参数不在paths列表中时，不显示404页面
  };
}

/**
 * getStaticProps函数
 * 返回生成静态HTML所需要的数据
 */
export async function getStaticProps(context) {
  // 当存在getStaticPaths函数时，通过getStaticProps函数的context参数的params属性获取从getStaticPaths函数传递过来的路由参数
  const { id } = context.params;
  let msg = "";
  switch (id) {
    case "1234":
      msg = "再来一次";
      break;
    case "520":
      msg = "我爱你";
      break;
    default:
      msg = "大家好，我是渣渣灰";
      break;
  }
  return {
    props: {
      msg,
    },
  };
}
```

&nbsp;

### 服务端渲染 getServerSideProps 函数

当我们需要进行实时渲染，动态的请求数据，根据不同的数据变换渲染不同的内容时，我们应该使用服务端渲染的方式。nextjs 为我们提供了一个函数用于实现该功能。

当我们在导出页面组件时，也导出一个 `async` 的名为 `getServerSideProps` 的函数。这个函数`返回一个含有 props 属性的对象`，该对象的 `props 属性可以透传给页面组件的 props 对象参数`。我们可以在这个函数内部进行访问文件系统、获取外部 API 或查询数据库等操作，然后将数据通过 props 属性透传给页面组件。

```js
import React from "react";
import axios from "axios";

export default function View(props) {
  const { data } = props;

  return (
    <div>
      <h1>数据展示页面</h1>
      {data.map((item) => {
        <ul key={item.id}>
          <li>{item.title}</li>
          <li>{item.author}</li>
          <li>{item.time}</li>
          <li>{item.content}</li>
        </ul>;
      })}
    </div>
  );
}

/**
 * getServerSideProps函数
 * 返回服务端渲染所需要的数据
 */
export async function getServerSideProps(context) {
  const data = await axios.get("xxxxx");

  return {
    props: {
      data,
    },
  };
}
```

注意：Nextjs 会通过导出的函数是 getStaticProps 还是 getServerSideProps 来区分这个页面是哪种渲染，因此这两个函数在一个页面里面只能存在一个。

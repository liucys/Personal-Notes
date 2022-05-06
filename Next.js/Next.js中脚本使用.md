### 在 nextjs 中加载脚本

在 Nextjs 中，Next.js 的 Script 组件可以让开发者设置第三方脚本的加载优先级，以节省开发者的时间，提高加载性能。
注意：Script 组件不能写在 Head 组件中

```js
// CustomHead.js文件
import Head from "next/head";
import Script from "next/script";

export default function CustomHead({ children }) {
  return (
    <>
      <Head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <meta name="description" content="一个页面描述" />
        <title>Create Next.js App</title>
      </Head>
      {/* 使用Script组件加载脚本 */}
      <Script src="https://cdn.jsdelivr.net/gh/TaylorLottner/Fork/sakura.js" />
      <div>{children}</div>
    </>
  );
}
```

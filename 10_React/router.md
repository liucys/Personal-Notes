在 React 中，有着自己的专属路由库 React-Router。它是由官方维护的，它通过管理 URL,实现组件的切换和状态的变化。我们基于 React 的项目大部分都可以用到这个路由库。

安装：

> npm install react-router-dom

&nbsp;

#### react-router-dom 内置的路由相关 API

[内置组件,对象]()

- `<BrowserRouter>`
- `<HashRouter>`
- `<Switch>`
- `<Route>`
- `<Redirect>`
- `<Link>`
- `<NavLink>`
- history 对象
- match 对象
- witchRouter 函数

&nbsp;

#### react-router-dom 内置相关 API 介绍

- `<BrowserRouter>`组件

  > history 模式。表示一个路由的根容器，所有跟路由相关的东西都应该包裹在其中。

- `<HashRouter>`组件

  > hash 模式。表示一个路由的根容器，所有跟路由相关的东西都应该包裹在其中。

- `<Switch>`组件

  > 有时候，路由路径的匹配会不精确，出现多个匹配的情况。而我们只想要匹配相应的路由路径，因此我们可以通过使用`<Switch>组件`将 `<Route> 组件`进行包裹来解决这个情况。

- `<Route>组件`

  > Route 组件具有两种身份：（1）它是一个路由匹配规则；（2）它是一个占位符，表示将来匹配到的组件都放到这个位置上。其具有三个属性：（1）exact 属性表示是否精确匹配，该属性需要与 Switch 组件配合使用。（2）path 属性，该属性用于声明路由的路径地址。（3）component 属性用于声明渲染使用的组件

- `<Redirect>组件`

  > Redirect 组件用于进行路由重定向，Redirect 组件的使用存在两种情况：（1）当访问某个界面时，该界面不存在，此时`可以使用 Redirect 组件进行重定向`。（2）一般可以`放在 Switch 组件内的最后一行`，表示上述路由均为匹配到时，重定向到哪里。

- `<Link>组件`

  > Link 组件用于设置路由的链接，该组件在页面中最终会被渲染为 a 标签。其具有的属性：（1）to 属性，to 属性用于指定路由链接的地址。

- `<NavLink>组件`

  > 与 Link 组件作用相同，属于 Link 组件的加强版，会在匹配上当前的 url 的时候给已经渲染的元素添加参数。其具有的属性有：（1）`activeClassName属性`，string 类型。用于设置当路径元素被选中时的样式类名，默认为 active。（2）`activeStyle属性`，object 类型。用于设置当路径元素被选中时，为元素添加的样式。（3）`exact属性`，布尔类型。当被设置为 true 时，表示只有路由完全匹配时，class 和 style 才起作用。（4）`strict属性`，布尔类型，表示 pathname 在确定位置是否与当前 URL 匹配时，将考虑位置的尾部斜杠。（5）`isActive属性`，函数类型，用于添加自定义的判断当前路由路径是否被选中的逻辑。

- history 对象
  > 可以帮助我们在事件中操作路由相关内容。它具有多个属性：length（number 类型）、action（string 类型）、location（object 类型）、push、replace、go、goBack、goForward、block 等。

&nbsp;

#### 简单路由的声明使用

1. 明确好界面中的导航区域、展示区域。
2. 通过`<Link>`组件声明导航的导航标签，例如：`<Link to="/about">About</Link>`
3. 在内容展示区域通过`<Route>`组件进行路径的匹配。例如：`<Route path="/about" component={About} />`
4. 在 index.js 文件中通过`<BrowserRouter>组件或<HashRouter>组件`将`<App/>组件`包裹。

```jsx
import React from "react";
import { BrowerRouter, Route, Link, Switch } from "react-router-dom";

export default function App() {
  // home页面
  const Home = () => <div>Home Page</div>;
  // about页面
  const About = () => <div>About Page</div>;
  return (
    <BrowerRouter>
      <div>
        <nav className="head">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="main">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </div>
    </BrowerRouter>
  );
}
```

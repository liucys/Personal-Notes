安装

```js
npm install react-router-dom
```

常用 Router API（`这里以版本 6.x 进行说明`）

- `<BrowserRouter>` 或者 `<HashRouter>`：决定最终使用的 `history 模式` 还是 `hash 模式`的 URL。通常用来包住其他需要路由的组件，应该在应用的最外层使用它。

  ```js
  import ReactDOM from "react-dom";
  import * as React from "react";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";

  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("app")
  );
  ```

- `<Link>`：是一个元素，它最终将被渲染为 `<a> 标签`。通过其 `to 属性`声明链接地址。例如：`<Link to="/blog?id=123">博客</Link>`

- `NavLink`：与 `<Link>` 相同，不同点在于，它可以记录当前是否处于活跃状态。允许将一个函数传递给 `style`或 `className`，根据组件的活动状态自定义内联样式或类字符串。同时也`允许将函数作为子项传递`，以根据组件的活动状态自定义组件的内容。

  ```js
  import { NavLink } from "react-router-dom";

  function App() {
    return (
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "activeClassName" : null
              }
            >
              首页
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              style={({ isActive }) => (isActive ? { fontSize: "16px" } : null)}
            >
              博客
            </NavLink>
          </li>
          <li>
            <NavLink to="/edit">
              {({ isActive }) => (
                <span className={isActive ? "activeClassName" : null}>
                  编辑
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
  ```

- `<Routes>`：用于包裹路由访问路径 `<Route>`的。它决定用户在浏览器中输入的路径对应加载什么 React 组件。

  ```js
  import { Routes, Route } from "react-router-dom";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    );
  }
  ```

- `<Route>`：用来定义一个访问路径 与 React 组件之间的关系。例如：当希望访问路径 `"/blog"` 时加载 `<Blog>`这个 React 页面的内容时，需声明 `<Route path="/blog" element={<Blog/>} />`。它应该被包裹在`<Routes>`中。

  ```js
  import { Routes, Link, Route } from "react-router-dom";
  import "./App.css";
  import Home from "./pages/index";
  import Other from "./pages/other";
  import NotFound from "./pages/notFound";
  function App() {
    return (
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/home">首页</Link>
            </li>
            <li>
              <Link to="/home/other">其他</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/home/other" element={<Other />} />
          <!-- 404 -->
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }
  export default App;
  ```

- `useLocation`：返回当前 `location` 对象。

  ```js
    import { useLocation } from 'react-router-dom';

    function Blog(){
        const location = useLocation();
        // 假设当前 路径为 '/blog?id=123&name=zhangsan',则location内容为：{ pathname: "/other",search: "?id=123&name=zhangsan",hash: "",state: null,key: "default" }

        return (
            // ....
        )
    }
  ```

- `useNavigationType`：返回当前导航类型或用户如何来到当前页面 `const type = useNavigationType()`；值：`POP（弹出）`、`PUSH（推送）`、`REPLACE（替换）`。
- `useNavigate`：返回一个函数，可以用于事件导航。这个函数接收两个参数，第一个参数表示路径地址，第二个参数可选。

  ```js
  import React from "react";
  import { useNavigate } from "react-router-dom";

  function Other() {
    const navigate = useNavigate();
    return (
      <div>
        <div>Other Page</div>
        <span onClick={() => navigate("/profile")}>离开</span>
      </div>
    );
  }

  export default Other;
  ```

- `useParams`：返回 params 对象。例如对于路径 `/blog/123` ,可以有 `const { id } = useParams()`;
- `useSearchParams`：用于 `读取和修改当前位置 URL 中的查询字符串`。它`返回一个包含两个值的数组`：当前位置的搜索参数和一个可用于更新他们的函数。

```js
// 假设在列表页面中，当前URL为：/tables?name=zhangsan&company=中国XXX公司&year=2021
import { useSearchParams } from "react-router-dom";

function TableList() {
  /*
   * 通过searchParams的get方法或getAll方法可以获取URL的search对象值
   * get(key:string)：获取指定搜索参数的第一个值
   * getAll(key:string)：获取指定搜索参数的所有值，返回值是一个数组。
   * has(key:string)：判断是否存在指定搜索参数,返回布尔值
   */
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeSearch = () => {
    // 此处执行后，当前URL变为：/tables?name=孙悟空&year=2022&company=花果山旅游集团
    setSearchParams({
      name: "孙悟空",
      year: 2022,
      company: "花果山旅游集团",
    });
  };

  return (
    <div>
      <div>
        <p>姓名：{searchParams.get("name")}</p>
        <p>公司：{searchParams.get("company")}</p>
        <p>年度：{searchParams.get("year")}</p>
      </div>
      <button onClick={handleChangeSearch}>修改</button>
    </div>
  );
}
```

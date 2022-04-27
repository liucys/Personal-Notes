Redux 是一个使用叫做 `action` 的事件来管理和更新应用状态的模式和工具库。

应该在什么情况下使用`Redux`？

- 在应用的大量地方，存在大量的状态
- 应用状态会随着时间的推移而频繁更新
- 更新该状态的逻辑可能很复杂
- 中型和大型代码量的应用，很多人协同开发。

&nbsp;

Redux 是一个管理全局应用状态的库

- Redux 通常与 React-Redux 库一起使用,把 Redux 和 React 集成在一起
- Redux Toolkit 是编写 Redux 逻辑的推荐方式

Redux 使用 单向数据流

- State 描述了应用程序在某个时间点的状态,UI 基于该状态渲染。
- 当应用程序中发生某些事情时：（1）UI `dispatch` 一个 `action`；（2）`store` 调用 `reducer`，随后根据发生的事情来更新 `state`；（3）`store` 通知 UI `state 发生了变化`；（4）UI 基于`新的 State` 重新渲染。

Redux 有这几种类型的代码

- `Action` 是有 type 字段的纯对象，描述发生了什么。
- `Reducer` 是纯函数，基于先前的 `state 和 action` 来计算新的 state。
- 每当 `dispatch` 一个 `action` 后，`store` 就会调用 `root reducer`。

&nbsp;

- [安装](#安装)
- [简单使用 redux](#简单使用-redux)
- [如何解决页面刷新导致的数据丢失问题。](#如何解决页面刷新导致的数据丢失问题)

### 安装

```js
/**
 * 方式一：初始项目时，声明使用 Redux 进行状态管理
**/

// 对于 JS 模板
npx create-react-app <project-name> --template redux

//  对于 TS 模板
npx create-react-app <project-name> --template redux-typescript

/**
 * 方式二：在已有项目中添加 Redux 进行状态管理
**/

npm install @reduxjs/toolkit react-redux
```

部分工具说明

```
# configureStore()：包装createStore以提供简化的配置选项和良好的默认值。它可以自动组合你的 slice reducer，添加你提供的任何 Redux 中间件，Redux-thunk默认包含，并启用 Redux DevTools Extension。

# createReducer()：这使你可以为 case reducer函数提供操作类型的查找表，而不是编写 switch语句。此外，他自动使用该 immer库让你使用普通的可变代码编写更简单的不可变更新，例如：state.todos[3].completed=true。

# createAction()：为给定的动作类型字符串生成动作创建函数。该函数本身已 toString()定义，因此可以使用它来代替类型变量。

# createSlice()：接受reducer函数的对象、切片名称和初始状态值，并自动生成切片reducer，并带有相应的动作创建者和动作类型。

# createAsyncThunk：接收一个动作类型字符串和一个返回承诺的函数，并生成一个 pending/fulfilled/rejected基于该承诺分派动作类型的thunk。

# createEntrityAdapter：生成一组可重用的reducer和selector来管理store中的规范化数据。
```

官方示例文件结构

- `/src`
  - `index.js`：呈现 React 组件树的入口点文件
  - `/app`
    - `store.js`：store 设置`
    - `rootReducer.js`：根减速器（可选)
    - `app.js`：根 React 组件
  - `/common`：hook、通用组件、实用程序等
  - `/features`：包含所有“功能文件夹”
    - `/todos`：单个功能文件夹
      - `todosSlice.js`： Redux reducer 逻辑和相关操作
      - `Todos.js`：相关反应组件

`/app` 包含依赖于所有其他文件夹的应用程序范围的设置和布局
`/common` 包含真正同样和可重用的实用程序和组件。
`/features` 具有包含与特写功能相关的所有功能的文件夹。在这个例子中`todosSlice.js` 是一个鸭子风格的文件，具有包含对 RTK `createSlice()`函数的调用，并导出切片缩减器和动作创建者。

---

&nbsp;
部分 API 说明

- `configureStore()`：创建仓库,Redux store 是使用 Redux Tookit 中的 `configureStore 函数`创建的。 该函数要求我们传入一个 `reducer` 参数。

```js
import { configureStore } from "@reduxjs/toolkit";
export default configureStore({
  reducer: {
    // 这里放入管理的模块
  },
});
```

- `createSlice()`：创建切片，Slice Reducer 切片是应用中单个功能的 Redux reducer 逻辑和 action 的集合，通常一起定义在一个文件中。该名称来自于将根 Redux 状态对象拆分为多个"状态切片"。

```js
import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "唯一空间名称",
  initialState: {
    // 初始内容
    value: 0,
  },
  reducers: {
    // ... actions操作
    increase: (state, action) => {
      state.value += 1;
    },
  },
});

// 导出action方法
export const { increase } = slice.actions;

// 导出reducer
export default slice.reducer;
```

- `useSelector()`：仓库查询器,从 store 中读取数据。选择器函数接收整个 state 对象，并且返回需要的部分数据。每当 Redux store 更新时，选择器将重新允许，如果他们返回的数据发生改变，则将重新渲染组件。

```js
import { useSelector } from "react-redux";

// ...
const count = useSelector((state) => state.count);
```

- `useDispatch()：`是一个将仓管行为准则 action 发给 reducer 仓库管理员的动作（用于对仓库指定某些操作）- React 组件使用 `useDispatch` 钩子 `dispatch action 来更新 store`。

```js
import { useDispatch } from "react-redux";
import { increase } from "xxxx/slice.js";

// ....
const dispatch = useDispatch();

<button onClick={() => dispatch(increase())}>add</button>;
```

&nbsp;

### 简单使用 redux

- 首先，安装相关依赖后，在 src 文件夹下创建 `store` 文件夹，并分别创建 `index.js` 文件与 `reducers` 文件夹。
- 然后，在 `reducers` 文件夹下创建一个 `userSlice.js` 文件

```js
// userSlice.js 文件
import { createSlice } from "@reduxjs/toolkit";

/**
 * 通过 createSlice 函数生成 action 类型的字符串、action creator函数和 action对象。
 * name：必须属性，会被转换为 { type: "name/xxx" } 中的name。
 * initialState：必须属性，设置初始值。
 * reducers：必须属性，声明使用到的 action 方法
 **/
export const userSlice = createSlice({
  name: "user", // 空间名，必须唯一
  initialState: {
    value: null, // 设置初始值
  },
  // reducer 中必须遵守：（1）仅使用 state 和 action 参数计算新的状态值。（2）禁止直接修改 state。必须通过复制现有的 state 并对复制的值进行更改的方式来进行不可变更新。（3）禁止任何异步逻辑、依赖随机值或导致其他副作用的代码。
  reducers: {
    increment: (state, action) => {
      return {
        ...state,
        value: action.payload,
      };
    },
    decrement: (state) => {
      return {
        ...state,
        value: null,
      };
    },
  },
});

// 设置 selector 函数，以 state 作为参数，并返回状态树中 state.user 的内容
export const selectUser = (state) => state.user.value;

// 导出 action 方法
export const { increment, decrement } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;
```

注意：`（1）永远不允许在 reducer 中更改 state 的原始对象（例如：state.value = 123; 这中操作是非法的。）；（2）只能在 Redux Tookit 的 createSlice 和 createReducer 中编写 "mutation"逻辑。 `

- 接下来，在 `store` 文件夹下的 `index.js` 文件中创建 `redux store`

```js
// store 文件夹下的index.js文件
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";

/**
 * 通过 configureStore 函数创建 Redux store
 * 要求传入一个对象中所有不同的reducer。对象中的键名 key 将被定义为最终状态树中的键名 key。
 **/
export default configureStore({
  reducer: {
    //   向 Redux 状态对象中添加一个 state.user 部分，通过 userReducer 函数负责决定是否以及如何在 dispatch action时更新 state.user 部分。
    user: userReducer,
  },
});
```

- 在 `src 文件夹`下的 `index.js` 文件中 通过 `Provider 组件`全局传递 Redux store。

```js
import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";
import App from "./App";
// 引入 Provider组件
import { Provider } from "react-redux";
// 引入store
import store from "./store";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

- 最后，我们就可以在组件中通过引入相关方法进行操作了,例如：

```jsx
// App.js文件
import { increment, decrement, selectUser } from "./store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

function App() {
  // 通过 useDispatch 获取 dispatch 方法。
  const dispatch = useDispatch();
  // 通过 useSelector 获取 状态树中的 state.user
  const currentUser = useSelector(selectUser);

  return (
    <div className="App">
      <div>姓名：{currentUser?.name}</div>
      <div>
        {/* 通过 dispatch 方法操作对应的 action */}
        <span onClick={() => dispatch(increment({ id: 1, name: "zhangsan" }))}>
          登陆
        </span>
        &nbsp;
        <span onClick={() => dispatch(decrement())}>注销</span>
      </div>
    </div>
  );
}
```

&nbsp;

### 如何解决页面刷新导致的数据丢失问题。

> 解决方式：通过插件 redux-presist 实现数据持久化

```
npm install redux-presist

# or

yarn add redux-presist
```

redux 状态管理数据持久化案例:

- 首先，在 `src 文件夹`下创建 `reducers 文件夹`,并创建 `user` 子文件夹，添加 `user.js` 文件

```js
// 目录 /src/reducers/user/user.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // 唯一空间名
  initialState: {}, // 初始值
  //   reducer action 操作
  reducers: {
    //   添加
    increase: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 移除
    decrease: (state) => {
      return {};
    },
  },
});

// 导出 action 操作
export const { increase, decrease } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;
```

- 然后，在 `src 目录` 下创建 `store 文件夹`，并创建 `index.js 文件`

```js
/**
 * 在目录 /src/store/index.js
 * combineReducers：把一个由多个不同reducer函数作为value的object合并成一个最终的reducer函数。
 */
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
// 导入user Reducer
import userReducer from "../reducers/user/user";

// 配置持久化数据的存储引擎
const persistConfig = {
  key: "root",
  storage, // 表示将数据存储在localStorage中
};

// 合并为 rootReducers
const rootReducers = persistReducer(
  persistConfig,
  combineReducers({
    user: userReducer,
    // ... 可添加多个需要管理的 state
  })
);

// 生成 redux store
const store = configureStore({
  reducer: rootReducers,
  // 这里暂且需要这样设置，不然会出现序列化错误警告
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
```

- 接下来，在 src 根目录下的 index.js 文件中引入相关配置

```js
// 在目录 /src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
// 路由
import { BrowserRouter } from "react-router-dom";
// redux
import { Provider } from "react-redux";
import { persistor } from "./store";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
```

- 接着我们就可以在页面中通过相关 api 处理 state 中的数据了

```js
/**
 * 在 目录 /src/pages/home.js
 */
import React from "react";
import { useDispatch } from "react-redux";
import { increase, decrease } from "../reducers/user/user";

function Home() {
  // 通过 useDispatch 获取发射器 dispatch
  const dispatch = useDispatch();

  // 监听登陆
  const handleLogin = () => {
    dispatch(increase({ id: "21ffsd2-sfs4234-vdasd54", name: "孙悟空" }));
  };

  // 监听退出
  const handleLogout = () => {
    dispatch(decrease());
  };
  return (
    <div>
      <div>This is Home Page</div>
      <button onClick={handleLogin}>登陆</button>
      <button onClick={handleLogout}>退出登陆</button>
    </div>
  );
}

export default Home;


/**
 * 在目录 /src/pages/other.js
 */
import React from "react";
import { useSelector } from "react-redux";

function Other() {
  // 通过 userSelector 从 store 中读取 user数据
  const currentUser = useSelector((state) => state.user);
  return (
    <div>
      <div>This is other page</div>
      {currentUser.id && (
        <div>
          <p>Hello,{currentUser.name}</p>
        </div>
      )}
    </div>
  );
}

export default Other;

```

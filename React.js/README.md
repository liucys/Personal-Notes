React 是一个声明式，高效且灵活的用于构建用户界面的 JavaScript 库。可以将一些简短、独立的代码片段组合成复杂的 UI 界面，这些代码片段被称作“组件”。即 react 可以帮助我们将界面分成各个独立的小块，每一个独立的小块就是一个组件，这些组件之间可以进行组合、嵌套、从而形成我们所看到的界面。

React 的特点：

- 声明式设计
- 高效性。采用虚拟 DOM 来实现 DOM 的渲染，最大限度上减少了对于 DOM 的操作。
- 能够灵活的跟其他 JavaScript 库进行搭配使用
- 使用 JSX 语法声明，使得我们可以在 js 中进行 html 内容写入
- 组件化与模块化开发
- 单向数据流

&nbsp;

安装

```js
#首先全局安装脚手架
npm install -g create-react-app

# 然后在空文件夹下安装react项目
npx create-react-app <project name>

# 安装好项目后，进入项目下，运行项目
cd <project name>
npm start
```

&nbsp;

#### JSX 语法

所谓 JSX 是一个对于 JavaScript 的语法扩展。在 React 中，JSX 可以很好的描述 UI 应该呈现出它应有交互的本质形式。

- 一个简单的 JSX 语法
  ```jsx
  const name = "XiaoMei";
  const element = <h1>hello,{name}</h1>;
  ```

JSX 语法的构成：由 HTML 元素构成，中间如果需要插入变量，可以通过`{变量名}`的方式进行插入。在`{}`中间我们也可以写入表达式。在 JSX 中，对于元素属性的声明和 html 内容的声明，我们都可以通过使用`{}`进行动态声明。

- 在使用 JSX 语法时，我们应该注意只声明一个共同的根节点（元素的声明都在同一个父节点下进行）。
- 因为在 React 中，`class`是一个关键字，因此我们在进行元素的类名声明时，不能再通过直接使用`class`进行声明，而应该使用`className`进行元素类名的声明。
- 在 JSX 语法中进行元素样式声明

  ```jsx
  const theme = {
    width: "20px",
    height: "10px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#000",
  };
  const element = <div style={theme}>Theme</div>;
  ```

- 在 JSX 语法中使用条件渲染
  ```jsx
  const flag = true;
  const element = <h1>{flag ? "帅哥" : "美女"}</h1>;
  ```
- 在 JSX 语法中使用列表渲染
  ```jsx
  const list = [1, 2, 3, 4];
  const element = (
    <ul>
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  ```
  &nbsp;

#### 组件

React 的组件声明方式有两种，一种是函数式组件（无状态组件）的声明方式，一种是类组件的声明方式。react 的每一个组件(无论是函数式组件还是类组件)，声明组件名称时都应以大写字母开头。当 React 遇到的元素是用户自定义的组件时，它会将 JSX 属性作为单个对象传递给该组件，这个对象通常称为“props”。“props”仅具有只读性，每个组件并不能自己修改自己的“props”。

- 一个简单的类组件声明

  ```js
  import React, { Component } from "react";

  export default class HelloWorld extends Component {
    constructor(props) {
      super(props);
      this.state = {
        msg: "Hello,World",
      };
    }
    render() {
      const { msg } = this.state;
      return <div>{msg}</div>;
    }
  }
  ```

- 一个简单的函数式组件声明

  ```js
  import React from "react";

  export default function HelloWorld(props) {
    const msg = "Hello,World";
    return <div>{msg}</div>;
  }
  ```

虽然类组件与函数式组件的写法存在差异，但是他们最终渲染出来的内容却是一致的。

&nbsp;

#### 类组件

react 的类组件使用 ES6 中的 `class` 进行声明，同时继承自 React 的 `Component` 基类。当我们想要接收来自父组件传递的数据时，可以通过`props`进行接收。react 的类组件是一个状态型组件，在 `constructor` 中，首先我们需要通过 `super` 处理 `props` 对象，然后我们可以通过 this.state 进行状态的初始化声明。`render()`方法输出内容，对于事件方法的声明处理，在声明事件方法后，我们需要在 `constructor` 函数中通过 `bind` 方法进行一次 `this` 的指向绑定行为（也可以直接在调用事件方法的地方进行 this 指向绑定）。

```js
import React, { Component } from "react";

export default class HelloPeople extends Component {
  constructor(props) {
    super(props);
    // init
    this.state = {
      name: "XiaoMei",
    };
    // bind this
    this.handleClick = this.handleClick.bind(this);
  }
  //func
  handleClick() {
    const { name } = this.state;
    this.setState({
      name: name === "XiaoMei" ? "XiaoHong" : "XiaoMei",
    });
  }
  render() {
    const { name } = this.state;
    return (
      <div>
        <p>{name}</p>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    );
  }
}
```

- 对于 react 中的类组件，我们声明初始状态时通过`this.state`进行声明，当我们想要获取 this.state 中声明的状态时，可以通过`this.state`对象中读取。当我们需要更改 this.state 中声明的某个状态时，必须通过`this.setState`进行声明更改。
- 对于类组件中，state 是完全受控与组件自身的。我们可以通过 this.setState 的方式进行 state 的更改。但是在 React 中，HTML 表单元素通常会自己保持一些内部的 state。我们可以通过使其与组件的 state 进行相结合，成为一个受控的表单元素。

&nbsp;

在类组件中的生命周期方法调用

- componentDidMount() 方法会在组件已经被渲染到 DOM 中后运行，所以，我们通常可以在这里进行定时器的设置，数据的请求等操作
- componentWillUnmount() 方法会在组件即将销毁时运行，因此我们可以在这里进行定时器的清除等操作。

```jsx
import React, { Component } from "react";

export default class CustomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      console.log("componentDidMount");
    }, 1000);
  }

  componentWillUnmount() {
    this.timer = clearInterval(this.timer);
  }

  render() {
    return <div>生命周期</div>;
  }
}
```

&nbsp;

#### 函数式组件

react 中的函数式组件即以声明函数的语法方式声明，返回值为一个 JSX 语法的呈现内容。函数式组件不同于类组件，不存在生命周期，不能使用 state 与 react 的一特性。因此在 `React 16.8` 版本中提供了 Hook 的方式供我们使用 state。

```JSX
import React from 'react';

export default function CustomComponent(){
    const msg="函数式组件";
    return (
        <div>{msg}</div>
    )
}
```

在函数式组件中通过 hook 使用 state 与 react 的其他特性。(React 版本必须在 16.8 及以上版本)，使用`hook`，我们可以不必像类组件中那样通过`this.setState`进行`state`的更改。

- 一个简单的 hook 使用

  ```jsx
  import React, { useState } from "react";
  export default function CustomComponent() {
    // 声明一个新的叫做“count”的state变量，初始值为0
    const [count, setCount] = useState(0);

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    );
  }
  ```

&nbsp;

#### Hook API

我们`可以在一个组件中多次调用相同的 Hook API`。

- useState

> `useState` 用于为组件内部添加 `state`。React 在重复渲染时会保留这个 `state`。`useState` 会返回一对值：`当前状态 state `以及一个`用于更新这个状态的函数`。这个函数类似于类组件中的 `this.setState`,但是又不会将`新的 state `与`旧的 state `进行合并。我们可以在事件处理函数中或其他一些地方调用这个函数进行`state`的更新。useState 唯一接收的参数就是初始的 state ，这个初始的 state 只有在第一次渲染时才会被使用到。

```jsx
import React, { useState } from "react";
export default function CustomComponent() {
  // 声明一个新的叫做count的state
  const [count, setCount] = useState(0);
  // 声明一个新的叫做loading的state
  const [loading, setLoading] = useState(true);

  return (
    <div className={loading ? "active" : "default"}>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click Count
      </button>
      <button onClick={() => setLoading(false)}>Click loading</button>
    </div>
  );
}
```

- useReducer

> useReducer 同样用于 state 管理。useReducer 可以接收三个参数：reducer 函数、初始化的 initialArg 参数、init 函数。返回值为最新的 state 和 dispatch 函数（用来触发 reducer 函数，计算对应的 state）。即`const [state, dispatch] = useReducer(reducer, initialArg,init)`；一般情况下我们只需传入 reducer 以及 initialArg 参数即可。当我们需要使用第三个参数时，我们需要将第二个参数设置为 undefined。`useReducer 的使用场景：`state 是一个数组或者对象、state 变化很复杂，经常一个操作需要修改很多 state、需要在深层子组件里面去修改一些状态（配合 useContext 使用）、应用程序比较大，希望 UI 和业务能够分开维护等。

```jsx
import React, { useReducer } from "react";
import axios from "axios";

// 声明初始化的state
const initialState = {
  username: "",
  password: "",
  isLoading: false,
  error: "",
  isLoggedIn: false,
};

// 声明reducer函数
const reducer = (state, action) => {
  switch (action.type) {
    // 处理账户输入state
    case "username":
      return {
        ...state,
        username: action.payload.value,
      };
    // 处理密码输入state
    case "password":
      return {
        ...state,
        password: action.payload.value,
      };
    // 处理登录state
    case "login":
      return {
        ...state,
        isLoading: true,
      };
    // 处理登录成功state
    case "success":
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
      };
    // 处理登录失败state
    case "error":
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    // 处理默认情况下的state
    default:
      return state;
  }
};

export default function Login() {
  // 使用useReducer声明一个state。
  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password, isLoading, error, isLoggerIn } = state;

  // login事件监听
  const handlelogin = () => {
    dispatch({ type: "login" });
    axios
      .post("/api/v1/xxxx", { username, password })
      .then((res) => {
        dispatch({ type: "success" });
      })
      .catch((err) => {
        dispatch({
          type: "error",
          payload: {
            error: error.message,
          },
        });
      });
  };

  return (
    <div>
      <div>
        <span>账户：</span>
        <input
          placeholder="请输入账户"
          onChange={(e) =>
            dispatch({ type: "username", payload: { value: e.target.value } })
          }
        />
      </div>
      <div>
        <span>密码：</span>
        <input
          placeholder="请输入密码"
          onChange={(e) =>
            dispatch({ type: "password", payload: { value: e.target.value } })
          }
        />
      </div>
      <div>
        <button onClick={handleLogin}>login</button>
      </div>
    </div>
  );
}
```

- useEffect

> useEffect 是一个 Effect Hook，给函数式组件增加了操作副作用的能力。它相当于类组件中生命周期方法 componentDidMount、componentDidUpdate、componentWillUnmount 的组合体。它可以直接访问到组件的 props 和 state。默认情况下，react 会在每次渲染后调用该 useEffect。useEffect `支持返回一个函数来指定如何清除副作用`。我们可以在 useEffect 中进行数据的请求、定时器设置、消息订阅等操作。`useEffect 接收两个参数`：一个是一个`包含命令式、且可能有副作用代码的函数`，另外一个是一个`数组`。函数中是我们的事务逻辑。数组用于管理需要监听的 state，当数组中监听的某一个 state 发生了改变，将会重新触发 useEffect 执行渲染。

```jsx
import React, { useState, useEffect } from "react";
import moment from "moment";

export default function CustomComponent() {
  // 声明一个新的叫做time的state
  const [time, setTime] = useState(null);

  useEffect(() => {
    // 声明定时器
    let timer = setInterval(() => {
      const str = moment().format("YYYY-MM-DD HH:mm:ss");
      setTime(str);
    }, 1000);

    // 清除定时器
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h3>当前时间：{time}</h3>
    </div>
  );
}
```

- [useContext](https://react.docschina.org/docs/context.html)

> useContext 是一个用于跨组件共享数据（组件之间进行值传递）的 Hook API。通过 useContext，我们可以实现复杂情况下复合组件，嵌套组件等之间进行数据传递。常用于进行项目主题、地区偏好设置时使用。使用时通过 `React.createContext()`方法创建一个 `context 对象`，当使用 `context 对象`的 `provider 组件`将需要订阅 context 对象的子组件进行包裹时，在这些子组件中，可以通过 `useContext`接收 context 对象，从而这些子组件会从组件树中离自身最近的那个匹配的 `Provider 组件`的 `value 属性`中读取到当前的 context 对象的值。`只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效`。

```jsx
/*
 * 1.在ContextProvider.js文件中
 */
import React from "react";

// 声明defaultValue，只有当没有使用context对象的Provider组件进行包裹时，defaultValue才会生效
const initState = {
  name: "秀吉",
  gender: "秀吉",
};

// 创建一个context对象
export const CustomContext = React.createContext(initState);

// 包装context对象返回的Provider组件。通过Provider组件的value属性进行传递
export const CustomContextProvider = (props) => {
  return (
    <CustomContext.Provider value={props.value}>
      {props.children}
    </CustomContext.Provider>
  );
};

/*
 * 2.在HelloPerson.js文件中
 */
import React, { useContext } from "react";
// 导入context对象
import { CustomContext } from "./ContextProvider";

export default function HelloPerson() {
  // 获取context对象
  const context = useContext(CustomContext);
  return (
    <div>
      Hello,{context.name}。你是{context.gender}孩子吗？
    </div>
  );
}

/*
 *   3.在App.js文件中
 */
import React, { useState } from "react";
// 导入经过处理的context对象的Provider组件
import { ContextProvider } from "./CustomProvider";
import HelloPerson from './HelloPerson';

export default function App(){
    // 声明一个新的叫做person的state
    const [person,setPerson]=useState({
        name:'XiaoHong',
        gender:'女'
    })

    // 点击事件
    const handleClick=()=>{
        setState({
            name:'XiaoCheng',
            gender:'男'
        })
    }

    return (
        <div>
            <p>{person.name}是一个{person.gender}孩子哟！</p>
            <button onClick={handleClick}>Click Me</button>
            {/* 将需要获取公共数据的组件通过context对象的Provider组件进行包裹 */}
            <CustomProvider value={person}>
                <HelloPerson/>
            </CustomProvider>
        </div>
    )
}
```

- useRef

> useRef 可以用来`获取`组件`实例对象`或 `DOM 对象`。useRef 返回一个可变的 `ref` 对象，其`.current`属性被初始化为传入的参数 （initialValue）。返回的 `ref对象`在组件的整个生命周期内保持不变。当 `ref 对象`内容发生变化时，useRef 并不会进行通知。变更`.current `属性不会引发组件的重新渲染。使用时需先通过 `useRef 声明一个 ref 对象`，然后再在元素上`通过 ref 属性指定该 ref 对象`。我们也`可以使用 useRef 来进行跨越渲染周期存储数据（组件被多次渲染后依旧不会改变），并且对它进行修改也不会引发组件的重新渲染`。

```jsx
import React, { useState, useRef } from "react";

export default function CustomComponent() {
  //声明一个新的叫做count的state
  const [count, setCount] = useState(0);
  // 获取一个叫做countRef的ref对象
  const countRef = useRef();

  // 事件监听
  const handleChange = (e) => {
    // 获取input元素的DOM对象
    const { input } = countRef.current;
    setCount(e.target.value);
    console.log(input.value === e.target.value);
  };

  return (
    <div>
      {/* 通过ref属性挂载 */}
      <input ref={countRef} value={count} onChange={handleChange} />
    </div>
  );
}
```

- useCallback

> `useCallback 用于返回缓存的函数`；它接收两个参数：内联函数、依赖项数组。useCallback 的使用场景在于`有一个父组件，其中包含子组件，子组件接收一个函数作为props；通常而言，如果父组件更新了，子组件也会执行更新；但是大多数场景下，更新是没有必要的，我们可以借助useCallback来返回函数，然后把这个函数作为props传递给子组件；这样，子组件就能避免不必要的更新`。它接收两个参数：内联回调函数以及数组依赖项。它会返回一个 memoized 函数，只有在依赖项改变时才会返回一个更新的函数。注意`使用时需要配合使用 React.memo方法（此方法内会对 props 做一个浅层比较，如果 props 没有发生改变，则不会重新渲染此组件。）`。

```jsx
/*
 * CustomComponent.js文件中
 */
import React from "react";

// 这里必须使用React.memo进行包裹处理，否则起不到优化效果
export default React.memo(function CustomComponent({ count, callback }) {
  console.log("CustomComponent");
  return (
    <div>
      <p>{count}</p>
      <button onClick={callback}>相关state的改变</button>
    </div>
  );
});

/*
 * 在App.js文件中
 */
import React, { useState, useCallback } from "react";
import CustomComponent from "./CustomComponent";

export default function App() {
  // 声明一个新的叫做count的state
  const [count, setCount] = useState(1024);
  // 声明一个新的叫做msg的state
  const [msg, setMsg] = useState("Message is Number");

  // 使用useCallback缓存函数,依赖项为count
  const callback = useCallback(() => {
    setCount(count + 1024);
  }, [count]);

  return (
    <div>
      <p>{msg}</p>
      <button
        onClick={() => {
          setMsg(`Message is ${Math.random()}`);
        }}
      >
        改变无关的state
      </button>
      <CustomComponent count={count} callback={callback} />
    </div>
  );
}
```

- useMemo

> 与 useCallback 不同，`useMemo 返回缓存的变量`。它接收两个参数：数据生产函数以及依赖项数组。它仅在某个依赖项数组值发生改变时才会更新新的缓存值。传入 useMemo 的函数会在渲染期间执行一次。如果我们没有设置依赖项数组，那么 useMemo 在每次进行渲染时都会计算新的值。使用场景：`当我们需要计算数据，又要避免因为其他原因导致的重渲染从而引起的重新计算数据问题时，我们可以使用useMemo`，为其设置依赖项，只有依赖项数组中的某一项发生改变时才会重新计算。

```jsx
import React, { useState, useMemo } from "react";

export default function CustomComponent() {
  // 声明一个新的叫做count的state
  const [count, setCount] = useState(10);
  // 声明一个新的叫做msg的state
  const [msg, setMsg] = useState("Hello");

  // 使用useMemo计算数据，当msg发生变化时，会导致组件重新渲染，但是因为使用useMemo，因此calc值并不会通过重新计算返回，而是返回缓存的值，因为它的依赖项count并没有发生改变。
  const calc = useMemo(() => {
    return count + 10;
  }, [count]);

  return (
    <div>
      <p>{msg}</p>
      <p>{calc}</p>
      <button
        onClick={() => {
          setMsg("World!");
        }}
      >
        Click Me
      </button>
    </div>
  );
}
```

- [其他更多相关 Hook API](https://react.docschina.org/docs/hooks-reference.html)

- 自定义 Hook

> 自定义 hook 是一个函数，其名称以“use”开头，函数内部可以调用其他的 Hook。

```jsx
/*
 * 自定义useMouseMove
 * useMouseMove.js文件
 */
import { useState, useEffect } from "react";

export default function useMouseMove() {
  const [position, setPosition] = useState([0, 0]);
  useEffect(() => {
    function handleMove(e) {
      setPosition([e.clientX, e.clientY]);
    }
    document.body.addEventListener("mousemove", handleMove, false);
    return () => {
      document.body.removeEventListener("mousemove", handleMove, false);
    };
  }, []);
  return position;
}

/*
 * 使用
 * const [x,y] = useMouseMove();
 */
```

&nbsp;

### 路由使用

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

  > history 模式。表示一个路由的根容器，所有跟路由相关的东西都应该包裹在其中。拥有的部分属性：`basename<string>`,表示基准 URL，如果你的应用程序是从服务器上的子目录中提供的，你需要将其设置为子目录。一个正确格式化的 basename 应该有一个开头斜杠，但没有结尾斜杠。、`forceRefresh<boolean>`，表示路由跳转时是否刷新页面。

- `<HashRouter>`组件

  > hash 模式。表示一个路由的根容器，所有跟路由相关的东西都应该包裹在其中。拥有的部分属性：`basename<string>`,表示基准 URL，如果你的应用程序是从服务器上的子目录中提供的，你需要将其设置为子目录。一个正确格式化的 basename 应该有一个开头斜杠，但没有结尾斜杠。、`hashType <string>`，表示 window.location.hash 的编码类型

- `<Switch>`组件

  > 有时候，路由路径的匹配会不精确，出现多个匹配的情况。而我们只想要匹配相应的路由路径，因此我们可以通过使用`<Switch>组件`将 `<Route> 组件`进行包裹来解决这个情况。

- `<Route>组件`

  > Route 组件具有两种身份：（1）它是一个路由匹配规则；（2）它是一个占位符，表示将来匹配到的组件都放到这个位置上。其具有三个属性：（1）exact 属性表示是否精确匹配，该属性需要与 Switch 组件配合使用。（2）path 属性，该属性用于声明路由的路径地址。（3）component 属性用于声明渲染使用的组件

- `<Redirect>组件`

  > Redirect 组件用于进行路由重定向，Redirect 组件的使用存在两种情况：（1）当访问某个界面时，该界面不存在，此时`可以使用 Redirect 组件进行重定向`。（2）一般可以`放在 Switch 组件内的最后一行`，表示上述路由均为匹配到时，重定向到哪里。

- `<Link>组件`

  > Link 组件用于设置路由的链接，该组件在页面中最终会被渲染为 a 标签。其具有的属性：（1）`to<string | object | function>`，to 属性用于指定路由链接的地址。支持三种模式，string 模式为链接路径的字符串形式，由路由路径、搜索参数和 Hash 属性构成；object 模式具有的部分属性：pathname<string>表示要链接到的路径，search<string>表示查询参数；function 模式表示将当前路由信息作为参数传递，该函数返回 string 或者 object

- `<NavLink>组件`

  > 与 Link 组件作用相同，属于 Link 组件的加强版，会在匹配上当前的 url 的时候给已经渲染的元素添加参数。其具有的属性有：（1）`activeClassName属性`，string 类型。用于设置当路径元素被选中时的样式类名，默认为 active。（2）`activeStyle属性`，object 类型。用于设置当路径元素被选中时，为元素添加的样式。（3）`exact属性`，布尔类型。当被设置为 true 时，表示只有路由完全匹配时，class 和 style 才起作用。（4）`strict属性`，布尔类型，表示 pathname 在确定位置是否与当前 URL 匹配时，将考虑位置的尾部斜杠。（5）`isActive属性`，函数类型，用于添加自定义的判断当前路由路径是否被选中的逻辑。

- `history 对象`

  > 可以帮助我们在事件中操作路由相关内容。它具有多个属性：`length<number>`、`action<string>`、`location<object>`、`push<function>`、`replace<function>`、`go<function>`、`goBack<function>`、`goForward<function>`、`block<function>` 等。

- `match对象`
  > 对于路由页面组件中，我们可以通过 props 对象获取到 match 对象。match 对象包含了关于 <Route path> 如何匹配 URL 的信息。它包含了多个属性：`params<object>`，表示从 URL 解析到的键值对、`isExact<boolean>`，表示如果匹配整个 URL(没有末尾字符)，则为 true、`path<string>`，表示用于匹配的 path 模式。、`url<string>`，表示 URL 的匹配部分。

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

&nbsp;

[更多路由详情](https://segmentfault.com/a/1190000039190541)

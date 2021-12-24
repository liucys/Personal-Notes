[TOC]

在 React 中使用 hook 方法 useState 声明了一个 Map 数据，如何进行实时更新。

在函数式组件中

```js
import { useState } from "react";

export default function App() {
  // declare a variable type is Map
  const [mapData, setMapData] = useState(() => new Map());

  // update data
  const handleOtherUsers = (others) => {
    setMapData((pre) => new Map([...pre, [others.id, others]]));
  };

  return <div></div>;
}

// or

// declare a variable type is Map
const [map, setMap] = useState(new Map());

// update map data
const handleUpdateMap = () => {
  const newMap = new Map(map);
  newMap.set("key", "value"); // add
  newMap.delete("key"); // delete
  setMap(newMap);
};
```

&nbsp;

在类组件中

```js
import React from "react";

export default class App extends React.Component {
  constructor(props) {
    this.state = {
      // declare a varible type is Map
      mapData: new Map(),
    };
  }

  // update data
  handleOtherUser() {
    const { mapData } = this.state;
    const newMap = new Map(mapData);
    newMap.set("key", "value"); // add
    newMap.delete("key"); // delete
    this.setState({
      mapData: newMap,
    });
  }
}
```

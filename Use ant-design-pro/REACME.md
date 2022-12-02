Question：

#### Question 1：在页面中，当用户想要离开当前页面时，想要提示用户当前数据尚未保存，提示用户是否确认离开。

```jsx
import { Prompt, history } from "umi";
import { Modal } from "antd";
import { useState } from "react";

// 是否弹出确认提示
const [warnState, setWarnState] = useState(false);

// 当数据修改，但是没有保存时，需要弹出确认框
setWarnState(true);

// 主体内容
<Prompt
  when={warnState}
  message={(location) => {
    Modal.confirm({
      title: "提示",
      content: "当前表单尚未保存，您确认离开吗？",
      onOk: () => {
        setWarState(false);
        history.push(location.pathname);
      },
    });
    return false;
  }}
/>;
```

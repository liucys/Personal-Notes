`THREE.js `的核心专注于 3D 引擎最重要的组件。其他很多有用的辅助组件 -- 如`控制器(control)、加载器(loader)以及后期处理效果(post-processing effect)等`是`examples/jsm`目录的一部分。因此引入需要从该目录下导入。

- 控制器

```js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
```


[Three.js](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene) 是基于原生 WebGL 封装运行的三维引擎。通过 WebGL 可以渲染出来各种各样炫酷的 3D 效果。`three.js就是使用javascript来写3D程序`

---

npm 方式使用

```
npm install --save three
# or
yarn add three
```

使用

```js
/* 全部引入 */
import * as THREE from "three";

// 创建场景
const scene = new THREE.Scene();

/* 按需引入 */
import { Scene } from "three";

// 创建场景
const scene = new Scene();
```

CDN 方式使用

```js
// 2.通过 CDN安装
<script type="module">
    import * as THREE from 'https://cdn.skypack.dev/three@<version>'

    const scene=new THREE.Scene()
</script>
```

`THREE.js `的核心专注于 3D 引擎最重要的组件。其他很多有用的辅助组件 -- 如`控制器(control)、加载器(loader)以及后期处理效果(post-processing effect)等`是`examples/jsm`目录的一部分。因此引入需要从该目录下导入。

```js
/* npm安装方式引入控制器 */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 创建控制器
const controls = new OrbitControls();


/* CDN安装方式的引入 */
<script type="module">
import { OrbitControls } from 'https://cdn.skypack.dev/three@<version>/examples/jsm/controls/OrbitControls.js';

  const controls = new OrbitControls();
</script>
```

&nbsp;

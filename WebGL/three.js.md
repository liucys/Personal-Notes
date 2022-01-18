[Three.js](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene) 是基于原生 WebGL 封装运行的三维引擎。通过 WebGL 可以渲染出来各种各样炫酷的 3D 效果。

安装引入

```js
// 1.通过npm安装
npm install --save three
// or
yarn add three

/** 引入方式一 : 引入整个 three.js核心库 **/
import * as THREE from 'three'

const scene=new THREE.Scene();

/** 引入方式二 : 仅引入需要的部分 **/
import { Scene } from 'three'

const scene=new Scene();


// 2.通过 CDN安装
<script type="module">
    import * as THREE from 'https://cdn.skypack.dev/three@<version>'

    const scene=new THREE.Scene()
</script>
```

three,js 的核心专注于 3D 引擎最重要的组件。其他很多有用的组件 --如控制器(control)、加载器(loader)以及后期处理效果(post-processing effect)等是`examples/jsm`目录的一部分。因此引入需要从该目录下导入。

```js
// npm 安装方式的引入
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const controls = new OrbitControls();


// CDN安装方式的引入
<script type="module">
import { OrbitControls } from 'https://cdn.skypack.dev/three@<version>/examples/jsm/controls/OrbitControls.js';

  const controls = new OrbitControls();
</script>
```

&nbsp;

### 对于 WebGL 支持性检测

```js
// 声明一个WEBGL类
class WEBGL {
  static isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  static isWebGL2Available() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));
    } catch (e) {
      return false;
    }
  }

  static getWebGLErrorMessage() {
    return this.getErrorMessage(1);
  }

  static getWebGL2ErrorMessage() {
    return this.getErrorMessage(2);
  }

  static getErrorMessage(version) {
    const names = {
      1: "WebGL",
      2: "WebGL 2",
    };

    const contexts = {
      1: window.WebGLRenderingContext,
      2: window.WebGL2RenderingContext,
    };

    let message =
      'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

    const element = document.createElement("div");
    element.id = "webglmessage";
    element.style.fontFamily = "monospace";
    element.style.fontSize = "13px";
    element.style.fontWeight = "normal";
    element.style.textAlign = "center";
    element.style.background = "#fff";
    element.style.color = "#000";
    element.style.padding = "1.5em";
    element.style.width = "400px";
    element.style.margin = "5em auto 0";

    if (contexts[version]) {
      message = message.replace("$0", "graphics card");
    } else {
      message = message.replace("$0", "browser");
    }

    message = message.replace("$1", names[version]);

    element.innerHTML = message;

    return element;
  }
}

const webgl = new WEbGl();

if (webgl.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = webgl.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
```


[TOC]

### 什么是 React-three-fiber？

React-three-fiber 是 Three.js 的 React 渲染器

```js
npm install three @react-three/fiber

// or

yarn add three @react-three/fiber
```

可搭配使用的其他生态库

```js
@react-three/gltfjsx //将 GLTF 转换为 JSX 组件

@react-three/drei // react-three-fiber 的有用助手

@react-three/postprocessing // 后处理效果

@react-three/flex // 用于 react-three-fiber 的 flexbox

@react-three/xr // VR/AR 控制器和事件

@react-three/cannon // 基于物理的钩子

@react-three/a11y // react-three-fiber 的可访问性工具

zustand // 状态管理

react-spring // 基于弹簧物理的动画库

react-use-gesture // 鼠标/触摸手势
```

&nbsp;

### 设置画布

我们可以从 `@react-three/fiber` 中导入一个封装好的 `Canvas` 组件。它可以在幕后帮助我们进行一些重要的设置工作：（1）设置`Scene`和`Camera`，这是渲染所需的基本构件块。（2）它每帧渲染我们的场景，我们不需要使用传统的渲染循环。`Canvas 组件响应适应父节点，因此我们可以通过改变父节点的宽高来控制它的大小。`

```jsx
import { Canvas } from "@react-three/fiber";
export default function Earth() {
  return (
    <div id="earth_container">
      <Canvas></Canvas>
    </div>
  );
}

/**
Canvas支持的属性
children： three.js JSX 元素或常规组件
gl：进入默认渲染器或您自己的渲染器的道具。还接受一个同步回调，如gl={canvas => new Renderer({ canvas })}
camera：进入默认相机或您自己的道具 THREE.Camera。默认{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }
shadows：阴影，默认为false
raycaster：进入默认光线投射器的道具
vr：将渲染器切换到 VR 模式，然后使用 gl.setAnimationLoop,默认为false
mode：React 模式egacy, blocking, concurrent.默认blocking
frameloop：渲染模式：always, demand, never。默认为always
resize：调整配置，查看 react-use-measure 的选项。默认{ scroll: true, debounce: { scroll: 50, resize: 0 } }
orthographic：创建正交相机，默认为false
dpr：像素比，使用window.devicePixelRatio，或自动：[min, max]
linear：关闭自动 sRGB 编码和伽玛校正，默认为false
flat：使用THREE.NoToneMapping代替THREE.ACESFilmicToneMapping。默认为false
onCreated：画布渲染后的回调
onPointerMissed：对未命中任何目标的指针单击的响应
**
```

`<mesh />`原生元素，它直接等同于 `new THREE.Mesh()`（即声创建一个`Mesh对象`）。对于在`<mesh></mesh>`原生元素中，我们不需要导入任何内容。因为所有的`three.js`对象都将被视为原生的`JSX`元素。一个`Mesh`对象是 three.js 中的基本场景对象，它用于保存在 3D 空间中表示形状所需的几何图形和材质。

```jsx
import { Canvas } from "@react-three/fiber";
export default function Earth() {
  return (
    <div id="earth_container">
      <Canvas>
        <mesh></mesh>
      </Canvas>
    </div>
  );
}
```

&nbsp;

### 支持的几何图形

- [BoxGeometry](https://threejs.org/docs/index.html#api/zh/geometries/BoxGeometry)：立方缓冲几何体`<boxGeometry />`。它通常使用构造函数所提供的 `width、height、depth` 参数来创建立方体或者不规则四边形。我们可以使用`args`属性进行这些参数的传递`<boxGeometry args={[2,2,2]} />`。
- [CircleGeometry](https://threejs.org/docs/index.html#api/zh/geometries/CircleGeometry)：圆形缓冲几何体`<circleGeometry />`
- [ConeGeometry](https://threejs.org/docs/index.html#api/zh/geometries/ConeGeometry)：圆锥缓冲几何体`<coneGeometry />`
- [CylinderGeometry](https://threejs.org/docs/index.html#api/zh/geometries/CylinderGeometry)：圆柱缓冲几何体`<cylinderGeometry />`
- [DodecahedronGeometry](https://threejs.org/docs/index.html#api/zh/geometries/DodecahedronGeometry)：十二面缓冲几何体`<dodecahedronGeometry />`
- [EdgesGeometry](https://threejs.org/docs/index.html#api/zh/geometries/EdgesGeometry)：边缘几何体`<edgesGeometry/>`
- [ExtrudeGeometry](https://threejs.org/docs/index.html#api/zh/geometries/ExtrudeGeometry)：挤压缓冲几何体`<extrudeGeometry />`
- [IcosahedronGeometry](https://threejs.org/docs/index.html#api/zh/geometries/IcosahedronGeometry)：二十面缓冲几何体`<icosahedronGeometry />`
- [LatheGeometry](https://threejs.org/docs/index.html#api/zh/geometries/LatheGeometry)：车削缓冲几何体`<latheGeometry />`
- [OctahedronGeometry](https://threejs.org/docs/index.html#api/zh/geometries/OctahedronGeometry)：八面缓冲几何体`<octahedronGeometry />`
- [PlaneGeometry](https://threejs.org/docs/index.html#api/zh/geometries/PlaneGeometry)：平面缓冲几何体`<planeGeometry />`
- [RingGeometry](https://threejs.org/docs/index.html#api/zh/geometries/RingGeometry)：圆环缓冲几何体`<ringGeometry/>`
- [ShapeGeometry](https://threejs.org/docs/index.html#api/zh/geometries/ShapeGeometry)：形状缓冲几何体`<shapeGeometry />`
- [SphereGeometry](https://threejs.org/docs/index.html#api/zh/geometries/SphereGeometry)：球缓冲几何体`<sphereGeometry />`
- [TetrahedronGeometry](https://threejs.org/docs/index.html#api/zh/geometries/TetrahedronGeometry)：四面缓冲几何体`<tetrahedroneGeometry />`
- [TorusGeometry](https://threejs.org/docs/index.html#api/zh/geometries/TorusGeometry)：圆环缓冲几何体`<TorusGeometry />`
- [TorusKnotGeometry](https://threejs.org/docs/index.html#api/zh/geometries/TorusKnotGeometry)：圆环缓冲扭结几何体`<torusKnotGeometry />`
- [TubeGeometry](https://threejs.org/docs/index.html#api/zh/geometries/TubeGeometry)：管道缓冲几何体`<tubeGeometry />`

```jsx
import { Canvas } from "@react-three/fiber";
export default function Earth() {
  return (
    <div id="earth_container">
      <Canvas>
        <mesh>
          <sphereGeometry />
        </mesh>
      </Canvas>
    </div>
  );
}
```

&nbsp;

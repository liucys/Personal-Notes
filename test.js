import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "@/styles/Earth-2.module.css";

// THREE加载图片
const GetTextureLoader = async (url) => {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (texture) => {
      resolve(texture);
    });
  });
};

// 通过canvas读取图片数据
const GetImageData = async (img_url) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = img_url;
    image.onload = function () {
      const { width, height } = image;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.scale(1, -1);
      ctx.drawImage(image, 0, 0, width, height * -1);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        imageData,
      });
    };
  });
};

// 定义一个着色器
const Shaders = {
  atmosphere: {
    uniforms: {},
    vertexShader: [
      "varying vec3 vNormal;",
      "void main() {",
      "vNormal = normalize(normalMatrix * normal);",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n"),
    fragmentShader: [
      "varying vec3 vNormal;",
      "void main() {",
      "float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 12.0);",
      "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity;",
      "}",
    ].join("\n"),
  },
};

// 获取着色器程序
const GetAtmosphere = () => {
  // 创建着色器
  const shader = Shaders["atmosphere"];
  // 复制引用shader的uniforms
  const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  // 创建一个网络模型对象，并添加球几何体、着色器材质
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 64, 64),
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader, // 加载顶点着色器程序
      fragmentShader: shader.fragmentShader, // 加载片元着色器程序
    })
  );

  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.1;
  // 渲染背面
  mesh.material.side = THREE.BackSide;
  // 是否计算每一帧的位移、旋转（四元变换）和缩放矩阵，并重新计算matrixWorld属性
  mesh.matrixAutoUpdate = false;
  // 更新局部变换
  mesh.updateMatrix();
  return mesh;
};

export default function Earth2() {
  const init = async () => {
    // 获取容器
    const webglContainer = document.querySelector("#webgl_container");
    // 创建场景对象
    const scene = new THREE.Scene();
    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 设置相机在y轴上的位置，使得其与几何体分隔
    camera.position.z = 5;

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 将渲染器的dom元素添加到容器中
    webglContainer.appendChild(renderer.domElement);

    // 创建点光源
    const light = new THREE.PointLight(0xffffff, 1, 5000);
    // 设置点光源位置
    light.position.set(10, 10, 10);
    // 将点光源添加到场景中
    scene.add(light);

    // 通过自定义着色器的方式绘制一个背景光球
    scene.add(GetAtmosphere());

    const { imageData } = await GetImageData("/map.png");
    console.log(imageData);

    // 创建几何体
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    // 加载图片
    const texture = await GetTextureLoader("/map.png");
    // 创建材质对象
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    // 创建网格模型
    const cube = new THREE.Mesh(geometry, material);
    // 将网格模型添加到场景中
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);
      // 设置物体的局部旋转
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
    return renderer;
  };

  useEffect(() => {
    const renderer = init();

    return () => {
      renderer.then((res) => {
        res.dispose();
      });
    };
  }, []);

  return <div className={styles.container} id="webgl_container" />;
}

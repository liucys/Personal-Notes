#### 1. 事件锚点跳转

通过事件，触发锚点跳转功能。涉及到的方法有：`scrollIntoView()`
相关文档：[scrollIntoView](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)

- 首先，为需要跳转到的锚点元素设置唯一属性 `id` 值。
- 然后，在事件中，通过 `id` 属性获取此元素，并调用 `scrollIntoView()方法进行锚点跳转`。

```html
<div id="box">锚点位置</div>
<script>
  var element = document.getElementById("box");

  element.scrollIntoView(); // 相当于element.scrollIntoView(true)
  // element.scrollIntoView(false);
  // element.scrollIntoView({block: "end"});
  // element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
</script>
```

注意：在 `react` 的 `hook useEffect` 中，使用此方法需要加个延迟，不然无法确定滚动位置，不起作用。

```jsx
useEffect(() => {
  const anchorElement = document.getElementById("current-module"); // 第一步获取到滚动元素
  if (anchorElement) {
    setTimeout(() => {
      anchorElement.scrollIntoView(false);
    }, 100);
  }
}, [data]);
```

#### 2. `<a>download</a>` 标签跨域下载图片

实现方式：

- 首先，利用 `canvas` 绘制图片资源并转 `Data URLs` 返回。

- 然后，利用 `a` 标签下载资源（直接使用 `download`属性 只能下载同源文件）。

```js
function downloadImg(url, fileName) {
  const image = new window.Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "Anonymous");
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, image.width, image.height);
    const blob = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.style.display = "none";
    a.download = name;
    a.href = blob;
    const body = document.getElementsByTagName("body");
    body[0].appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  if (/http[s]{0,1}/.test(url)) {
    // 解决跨域问题
    image.src = url + "?random=" + Date.now();
  } else {
    image.src = url;
  }
}
```

#### 3. 在线预览实现思路

对于前端实现在线预览功能：如 docx、doc、pdf、xls、xlsx、png、jpg 等等文件的在线查看。

- 1.调用微软预览地址进行在线预览实现：https://view.officeapps.live.com/op/view.aspx?src=预览文档指定（此方式内网不可用）。
- 2.使用 XDOC 文档预览云服务：https://view.xdocin.com/view?src=你的文档地址（文档地址要用utf-8编码，并且此方式内网不可用）。
- 3.利用后端将文件转为图片，前端以图片形式预览。

#### 4.下载图片，并添加水印

前端实现添加水印（安全性较低）

```js
// 使用a标签的download属性进行下载
function downLoad(url, fileName) {
  const a = document.createElement("a");
  const body = document.getElementsByTagName("body")[0];
  a.style.display = "none";
  a.download = fileName;
  a.href = url;
  body.appendChild(a);
  a.click();
  body.removeChild(a);
}

// 给图片添加水印
function imgWaterMark(canvas, waterText) {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(0.08,0.08,0.2)";
    // 透明度
    ctx.globalAlpha = 0.3;
    ctx.font = "14px microsoft yahei";
    ctx.rotate((Math.PI / 180) * -15);
    let lineNumX = 0; // X轴行号
    let lineNumY = 0; // Y轴行号
    let tempX = 0;
    let targetX = 0; // 水印写入的X轴位置
    let targetY = 0; // 水印写入的Y轴位置
    for (let ix = 20; ix < canvas.width; ix += 180) {
      // 水印横向间隔
      lineNumX++;
      lineNumY = 0;
      for (let iy = 10; iy <= canvas.height; iy += 110) {
        // 水印纵向间隔
        lineNumY++;
        tempX = lineNumY * 110 * Math.sin((Math.PI / 180) * 15); // 由于canvas被旋转，所以需要计算偏移量
        targetX = lineNumY & 1 ? ix - tempX : ix - tempX + 60;
        targetY = iy + lineNumX * 180 * Math.tan((Math.PI / 180) * 15);
        // 写入水印文本
        ctx.fillText(waterText, targetX, targetY);
      }
    }
  });
}

// 通过图片链接获取图片
function imageFromURL(imgURL, waterText, fileName) {
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "Anonymous");
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // 添加水印
    imgWaterMark(canvas, waterText);
    const blob = canvas.toDataURL("image/png");
    // 下载图片
    downLoad(blob, fileName);
  };
  if (/http[s]{0,1}/.test(imgURL)) {
    // 解决跨域问题
    image.src = imgURL + "?random=" + Date.now();
  } else {
    image.src = imgURL;
  }
}

// 方法调用
imageFromURL(
  "https://alifei04.cfp.cn/creative/vcg/800/new/VCG41560336195.jpg",
  "水印-9527",
  "测试图片.png"
);
```

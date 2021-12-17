[TOC]

html 中引入即可生效的 js 视觉效果。

Introduced to take effect

- 樱花飘落背景效果
-

```html
<script src="https://cdn.jsdelivr.net/gh/TaylorLottner/Fork/sakura.js"></script>
```

- 下雪背景效果

```html
<script src="https://cdn.jsdelivr.net/gh/TRHX/CDN-for-itrhx.com@3.0.6/js/snow3.js"></script>
```

- ACG 看板娘

```html
<script src="https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js"></script>
<script src="https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.0.min.js"></script>
<script>
  L2Dwidget.init({
    model: {
      jsonPath:
        "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
      // replace people model： https://unpkg.com/live2d-widget-model-hibiki@1.0.5/assets/hibiki.model.json
      scale: 1,
    },
    display: {
      position: "right",
      width: 150,
      height: 300,
      hOffset: 0,
      vOffset: -20,
    },
    mobile: { show: true, scale: 0.5 },
    react: { opacityDefault: 0.7, opacityOnHover: 0.2 },
  });
</script>
```

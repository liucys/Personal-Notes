### 1.使用 transform:scale 进行适配

大屏可视化实现离不开 echarts,而 echarts 的文字适配实现：

```js
/* Echarts图表字体、间距自适应 defauleWidth为设计稿默认宽度分辨率 */
export const fitChartSize = (size, defaultWidth = 1920) => {
  let clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return size;
  let scale = clientWidth / defaultWidth;
  return Number((size * scale).toFixed(3));
};
```

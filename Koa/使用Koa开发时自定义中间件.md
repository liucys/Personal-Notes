#### 在进行 Koa 后端 api 开发时,自定义中间件

> 自定义 koa 中间件实现形式

```typescript
export default function customMiddleware(){
  return async function (ctx:any,next:any){
    /**
    * 实现自定义中间件的基本功能
    **/
   ......
   await next()
  }
}
```

> 一个最简单的中间件 demo

```typescript
export default function customLogger() {
  return async function (ctx: any, next: any) {
    const requestTime = new Date();
    const startTime = requestTime.getTime();
    await next();
    const responseTime = new Date();
    const endTime = responseTime.getTime();
    console.log(
      `请求方法：${ctx.method}，路由路径：${ctx.url}，经过了${
        endTime - startTime
      }ms`
    );
  };
}
```

然后在项目入口文件中进行引入加载即可

```typescript
import customLogger from 'xxxxx/customLogger'

...
app.use(customLogger());
...
```

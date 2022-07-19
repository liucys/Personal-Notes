Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用的程序框架。它使用渐进式 JavaScrpt，内置并完全支持 TypeScript，并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。

```
<!-- 第一次使用时，全局安装 Nest脚手架 -->
npm i -g @nestjs/cli

<!-- 然后就可以使用该脚手架命令创建项目了 -->
nest new [Project-name]
```

项目初始化后的目录结构

```
- dist 目录
- node_modules // 项目依赖包管理
- src
    - app.controller.spec.ts // 对于基本控制器的单元测试样例
    - app.controller.ts // 提供路由的基本控制器
    - app.module.ts // 应用程序的根模块
    - app.service.ts // 提供的基本服务
    - main.ts // 创建 Nest 应用程序的入口文件
- test
```

很明显这个结构是不满足我们的需求的，我们需要更改一下 `src 文件夹`下的结构

```
- src
    - constants // 管理常用内容方法的文件夹
    - controller // 管理路由基本控制器的文件夹
    - entities // 数据库表内容管理文件夹
    - module // 管理应用程序的根模块的文件夹
    - service // 管理基本服务的文件夹
    - dto // 管理处理客户端参数服务的文件夹
    - utils // 管理公共常用工具的文件夹
    - app.moodule.ts // 根模块关联文件
    - main.ts // 入口文件
    ...
```

### 配置绝对路径引用，使用 语法：`import xxx from '@/xxxx'`

```json
<!-- 在tsconfig.json文件夹中添加配置 -->
{
  "paths": {
    "@/*": ["src/*"],
    "@@/*": ["*"]
  }
}
```

### 配置全局路由前缀，在 `main.ts`文件中通过 `setGlobalPrefix` 方法设置

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/v1"); // 设置全局路由前缀
  await app.listen(3000);
}
bootstrap();
```

### 使用 TypeORM 连接访问数据库

```
<!-- 安装依赖 -->
yarn add @nestjs/typeorm typeorm mysql2
yarn add cross-env
yarn add @nestjs/config
```

- 首先，在根目录下创建 config 文件夹，并分别创建 `index.ts`、`development.ts`、`production.ts`文件

```ts
/** 开发测试环境配置文件 development.ts 文件 **/
export default {
  // 数据库配置
  database: {
    type: "mysql", // 数据库类型
    host: "localhost", // 数据库地址
    port: 3306, // 端口号
    username: "root", // 用户名
    password: "123456", // 密码
    database: "test", // 数据库名
    entities: [
      "dist/src/entities/**.{.ts,.js}",
      "dist/src/entities/**/**.{.ts,.js}",
    ], // 匹配所有表文件
    synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  // redis配置
  redis: {},
};

/** 生产环境配置文件 production.ts 文件 **/
export default {
  // 数据库配置
  database: {
    type: "mysql", // 数据库类型
    host: "localhost", // 数据库地址
    port: 3306, // 端口号
    username: "root", // 用户名
    password: "123456", // 密码
    database: "test", // 数据库名
    entities: [
      "dist/src/entities/**.{.ts,.js}",
      "dist/src/entities/**/**.{.ts,.js}",
    ], // 匹配所有表文件
    synchronize: false, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  // redis配置
  redis: {},
};

/** index.ts 文件 **/
import developConfig from "./development";
import productionConfig from "./production";

// 环境判断
const isProd = process.env.NODE_ENV === "production";

export default () => (isProd ? productionConfig : developConfig);
```

- 然后，需要修改一下`package.json`文件中的 `script` 部分配置（需要手动设置区分环境变量）

```json
{
  "script": {
    "build": "cross-env NODE_ENV=production nest build",
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:prod": "cross-env NODE_ENV=production node dist/main"
  }
}
```

- 接下来，在 `app.module.ts` 文件中进行配置注入就可以连接数据库了。

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import parseDev from "@@/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注入
      load: [parseDev], // 加载配置
    }),
    // 注入数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("database"),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

`main.ts`

```TS
// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 路由前缀
  app.setGlobalPrefix('/api/v1');
  // 使用DTO验证
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

```

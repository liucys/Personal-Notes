简单使用 Nestjs 构建服务端

- 构建的项目文件结构

```
- config // 配置文件
- src
    - helper // 自定义方法的文件夹
    - controller // 管理路由基本控制器的文件夹
    - entities // 数据库表内容管理文件夹
    - module // 管理应用程序的根模块的文件夹
    - service // 管理基本服务的文件夹
    - dto // 可选，管理处理客户端参数服务的文件夹，不使用DTO校验就不需要
    - utils // 管理公共常用工具的文件夹
    - app.moodule.ts // 根模块关联文件
    - main.ts // 入口文件
    ...
```

项目起步

```
nest new project-name

<!-- 安装依赖 -->
yarn add @nestjs/typeorm typeorm mysql2
yarn add cross-env
yarn add @nestjs/config
yarn add class-transformer class-validator // 可选，DTO使用，不适应DTO就补安装
```

### 第一步：使用 TypeORM 连接数据库

- 首先，在根目录下创建 config 文件夹，并分别创建 `index.ts`、`development.ts`、`production.ts`文件

`development.ts` 文件

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
      "dist/src/entities/**/**.{ts,js}",
    ], // 匹配所有.entity文件
    synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  // redis配置
  redis: {},
};
```

`production.ts` 文件

```ts
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
      "dist/src/entities/**/**.{ts,js}",
    ], // 匹配所有.entity文件
    synchronize: false, //根据实体自动创建数据库表， 生产环境建议关闭
  },
  // redis配置
  redis: {},
};
```

`index.ts`文件

```ts
/** index.ts 文件 **/
import developConfig from "./development";
import productionConfig from "./production";

// 环境判断
const isProd = process.env.NODE_ENV === "production";

export default () => (isProd ? productionConfig : developConfig);
```

- 然后，需要修改一下 `package.json` 文件中的 `script` 部分配置（需要手动设置区分环境变量）

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

### 第二步：构建以数据库为基础的服务

- 首先，在目录`src/entities`文件夹下创建文件`example.ts`用于构建数据库表

```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("example")
export class ExampleEntity {
  // 主键声明
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, length: 255, comment: "标题" })
  title: string;

  @Column({
    type: "varchar",
    nullable: true,
    default: "管理员",
    length: 100,
    comment: "作者",
  })
  author: string;

  @Column({ type: "boolean", default: false, comment: "是否发布" })
  publish: boolean;

  @Column({ type: "varchar", nullable: false, length: 3000, comment: "内容" })
  content: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
  })
  updated_at: Date;
}
```

- 在 helper 文件夹下创建`response.ts`文件，自定义响应格式

```ts
export interface IResponse {
  status: string;
  success: boolean;
}

/**
 * response TableList type
 */
export class TableListResponse<T> {
  data: T[];

  success: boolean;

  total: number;

  constructor(data: T[], total: number) {
    this.data = data;
    this.success = true;
    this.total = total;
  }
}

/**
 * response success type
 */
export class SuccessResponse {
  status: string;

  success: boolean;

  message: string;

  data: any;

  constructor(data: any, message = "") {
    this.status = "ok";
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

/**
 * response fail type
 */
export class ErrorResponse {
  status: string;

  success: boolean;

  message: string;

  constructor(message: string) {
    this.status = "error";
    this.success = false;
    this.message = message;
  }
}
```

- 其次，在目录`src/dto`文件夹下创建文件`example.ts`，用于声明 dto 内容；在目录`src/service`文件夹下创建 `example.ts`文件，用于构建服务相关实现。

dto `example.ts`文件

```ts
import { IsNotEmpty, IsBoolean } from "class-validator";

export class ExampleCreateDTO {
  @IsNotEmpty({ message: "标题不能为空" })
  title: string;

  @IsBoolean({ message: "发布状态必须为布尔类型" })
  publish: boolean;

  @IsNotEmpty({ message: "发布内容不能为空" })
  content: string;
}

export class ExampleTableParamsDTO {
  title?: string;

  publish?: boolean;

  author?: string;

  content?: string;

  current: number;

  pageSize: number;
}

export class ExampleTableDataDTO {
  title: string;
  author: string;
  publish: boolean;
  contet: string;
  created_at: Date;
  updated_at: Date;
}
```

service `example.ts`文件

```ts
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ErrorResponse,
  IResponse,
  SuccessResponse,
  TableListResponse,
} from "../helper/response";
import { ExampleEntity } from "../entities/example";
import { ExampleCreateDTO, ExampleTableParamsDTO } from "../dto/example";

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(ExampleEntity)
    private readonly ExampleRepository: Repository<ExampleEntity>
  ) {}

  /**
   * 分页查询
   * @param queryParams
   * @returns
   */
  async queryTableList(
    queryParams: ExampleTableParamsDTO
  ): Promise<TableListResponse<any>> {
    try {
      const {
        title,
        author,
        publish,
        content,
        current = 1,
        pageSize = 10,
      } = queryParams;
      const filter: any = {};
      if (title) {
        filter.title = `%${title}%`;
      }
      if (author) {
        filter.author = `%${author}%`;
      }
      if (publish) {
        filter.publish = publish;
      }
      if (content) {
        filter.content = `%${content}%`;
      }
      const [data, count] = await this.ExampleRepository.findAndCount({
        where: filter,
        take: pageSize,
        skip: (current - 1) * pageSize,
        order: {
          updated_at: "ASC",
        },
      });
      return new TableListResponse(data, count);
    } catch (error) {
      console.log(error);
      return new TableListResponse([], 0);
    }
  }

  /**
   * 创建
   * @param form
   * @returns
   */
  async create(form: ExampleCreateDTO): Promise<IResponse> {
    try {
      const result = await this.ExampleRepository.create(form);
      await this.ExampleRepository.save(result);
      return new SuccessResponse(result, "创建成功");
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }
}
```

- 接下来，在目录`src/controller`文件夹下创建`example.ts`文件用于构建路由路径。

```ts
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ExampleCreateDTO, ExampleTableParamsDTO } from "../dto/example";
import { IResponse, TableListResponse } from "../helper/response";
import { ExampleService } from "../service/example";

@Controller("/example")
export class ExampleController {
  constructor(private readonly service: ExampleService) {}

  @Get()
  async TableList(
    @Query() queryParams: ExampleTableParamsDTO
  ): Promise<TableListResponse<any>> {
    return this.service.queryTableList(queryParams);
  }

  @Post()
  async create(@Body() form: ExampleCreateDTO): Promise<IResponse> {
    return this.service.create(form);
  }
}
```

- 最后，我们在目录`src/module`文件夹下创建`example.ts`文件，用于将`example.controller.ts`、`example.service.ts`文件进行联合引入使用。然后再在`app.module.ts`文件中将其挂载即可。

module `example.ts`文件

```TS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleController } from '@/controller/example';
import { ExampleService } from '@/service/example';
import { ExampleEntity } from '@/entities/example';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleEntity])],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
```

`app.module.ts`文件

```TS
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import parseDev from '@@/config';
import { ExampleModule } from './module/example';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [parseDev],
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

`main.ts`

```TS
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 路由前缀
  app.setGlobalPrefix('/api/v1');
  // 使用DTO验证
  app.useGlobalPipes(new ValidationPipe());
  // 全局错误过滤器使用
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

这样我们就声明好了两个服务地址：

`创建 POST /api/v1/example`

`分页查询 GET /api/v1/example`

`httpException.ts`

```TS
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errResponse: any = exception.getResponse();
    let message = exception.message;
    if (errResponse && errResponse.message) {
      message = errResponse.message;
    }
    console.log('请求路径：', request.originalUrl);
    console.log(`错误信息：`, message);
    const errorResponse = {
      status: 'error',
      success: false,
      message: message,
    };
    if (status !== 401) {
      response.status(200);
    } else {
      response.status(401);
    }
    response.send(errorResponse);
  }
}
```

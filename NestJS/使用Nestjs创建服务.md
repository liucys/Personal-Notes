简单使用 Nestjs 构建服务端

- 构建的项目文件结构

```
- config // 配置文件
- src
    - constants // 管理常用内容方法的文件夹
    - controller // 管理路由基本控制器的文件夹
    - entity // 数据库表内容管理文件夹
    - module // 管理应用程序的根模块的文件夹
    - service // 管理基本服务的文件夹
    - dto // 管理处理客户端参数服务的文件夹
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
yarn add class-transformer class-validator // DTO使用
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
    entities: ["dist/**/*.entity{.ts,.js}"], // 匹配所有.entity文件
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
    entities: ["src/**/*.entity{.ts,.js}"], // 匹配所有.entity文件
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

- 首先，在目录`src/entity`文件夹下创建文件`example.entity.ts`用于构建数据库表

```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Entity构造器声明表名
@Entity("example")
export class ExampleEntity {
  // 主键声明
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // 字段
  @Column({ type: "varchar", length: 100, comment: "名称" })
  name: string;

  @Column({ type: "boolean", default: false, comment: "是否发布" })
  publish: boolean;

  @Column({ type: "varchar", comment: "内容" })
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

- 其次，在目录`src/dto`文件夹下创建文件`example.dto.ts`，用于声明 dto 内容；在目录`src/service`文件夹下创建 `example.service.ts`文件，用于构建服务相关实现。

`example.dto.ts`文件

```ts
import { IsNotEmpty, IsBoolean, IsString } from "class-validator";

export class ExampleCreateDTO {
  @IsNotEmpty({ message: "标题不能为空" })
  readonly name: string;

  @IsBoolean({ message: "发布状态不能为空" })
  readonly publish: boolean;

  @IsString({ message: "发布内容不能为空" })
  readonly content: string;
}
```

`example.service.ts`文件

```ts
import { Injectable } from "@nestjs/common";
import {
  SuccessResponse,
  IResponse,
  ErrorResponse,
  TableList,
} from "src/constants/response";
import { ExampleEntity } from "@/entity/example.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExampleCreateDTO } from "@/dto/example.dto";
import { ERROR_INTERNAL_SYSTEM } from "@/constants/response_code";

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(ExampleEntity)
    private readonly ExampleRepository: Repository<ExampleEntity>
  ) {}

  /**
   * 创建
   * @param form
   * @returns
   */
  async create(form: ExampleCreateDTO): Promise<IResponse> {
    try {
      const result = await this.ExampleRepository.create(form);
      await this.ExampleRepository.save(result);
      return new SuccessResponse(result);
    } catch (error) {
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 分页查询
   * @returns
   */
  async queryAll(queryParams): Promise<TableList<any>> {
    const { current = 1, pageSize = 10 } = queryParams;
    const [data, count] = await this.ExampleRepository.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    return new TableList(data, count);
  }
}
```

- 接下来，在目录`src/controller`文件夹下创建`example.controller.ts`文件用于构建路由路径。

```ts
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { IResponse, TableList } from "@/constants/response";
import { ExampleService } from "@/service/example.service";
import { ExampleCreateDTO } from "@/dto/example.dto";

@Controller("/example")
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  // 分页查询
  @Get()
  async getHello(@Query() queryParams): Promise<TableList<any>> {
    return this.appService.queryAll(queryParams);
  }

  // 创建，使用DTO进行数据校验
  @Post()
  async create(@Body() form: ExampleCreateDTO): Promise<IResponse> {
    return this.appService.create(form);
  }
}
```

- 最后，我们在目录`src/module`文件夹下创建`example.module.ts`文件，用于将`example.controller.ts`、`example.service.ts`文件进行联合引入使用。然后再在`app.module.ts`文件中将其挂载即可。

`example.module.ts`文件

```TS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleController } from '@/controller/example.controller';
import { ExampleService } from '@/service/example.service';
import { ExampleEntity } from '@/entity/example.entity';

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
import { ExampleModule } from './module/example.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [parseDev],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    ExampleModule, // 挂载
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

这样我们就声明好了两个服务地址：

`创建 POST /api/v1/example`

`分页查询 GET /api/v1/example`

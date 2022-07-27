#### 简单使用 Nest.js 构建服务端入门

```
<!-- 创建新项目 -->
npm i -g @nestjs/cli

nest new Project-name // 构建新nest项目
```

将生成的项目初始文件结构转变为：

```
- config // 配置文件夹
- src
    - helper // 自定义方法的文件夹
    - controller // 管理路由基本控制器的文件夹
    - entities // 数据库表内容管理文件夹
    - module // 管理应用程序的根模块的文件夹
    - service // 管理基本服务的文件夹
    - dto // 可选，管理处理客户端参数服务的文件夹，不使用DTO校验就不需要
    - utils // 管理公共常用工具的文件夹
    - app.module.ts // 根模块关联文件
    - main.ts // 入口文件
    ...
```

项目起步

```
<!-- 安装依赖 -->
yarn add @nestjs/typeorm typeorm mysql2 // 使用typeorm连接mysql数据库
yarn add cross-env
yarn add @nestjs/config
yarn add class-transformer class-validator // 可选，DTO校验使用，不使用DTO校验就不需要安装
```

#### 第一步：使用 TypeORM 连接数据库

- 首先，在 `config 文件夹` 下分别创建 `index.ts`、`development.ts`、`production.ts`文件

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
      "dist/src/entities/**{.ts,.js}",
      "dist/src/entities/**/**{ts,js}",
    ], // 匹配所有.entity文件
    synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  },
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
      "dist/src/entities/**{.ts,.js}",
      "dist/src/entities/**/**{ts,js}",
    ], // 匹配所有.entity文件
    synchronize: false, //根据实体自动创建数据库表， 生产环境建议关闭
  },
};
```

`index.ts` 文件

```ts
/** index.ts 文件 **/
import developConfig from "./development";
import productionConfig from "./production";

// 环境判断
const isProd = process.env.NODE_ENV === "production";

export default () => (isProd ? productionConfig : developConfig);
```

- 然后，需要修改一下 `package.json` 文件中的 `script` 部分配置（需要设置区分环境变量）

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

- 首先，在目录`src/entities`文件夹下创建文件`user.ts`用于构建数据库表

```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";

@Entity("users")
export class UsersEntity {
  /**
   *  检测密码是否一致
   * @param password 明文密码
   * @param hashPassword 加密的密码
   * @returns
   */
  static comparePassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true, comment: "账户" })
  username: string;

  @Exclude()
  @Column({ type: "varchar", length: 255, comment: "密码" })
  password: string;

  @Column({
    type: "varchar",
    default: new Date().getTime().toString(32),
    length: 255,
    comment: "用户名",
  })
  name: string;

  @Column({
    type: "varchar",
    length: 500,
    comment: "头像",
    nullable: true,
    default: "https://joeschmoe.io/api/v1/random",
  })
  avatar: string;

  @Column({ type: "timestamp", comment: "出生日期", nullable: true })
  birth_date: Date;

  @Column({
    type: "varchar",
    comment: "性别",
    nullable: true,
    length: 10,
    default: "未知",
  })
  gender: string;

  @Column({
    type: "varchar",
    nullable: true,
    comment: "邮箱",
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    nullable: true,
    comment: "手机号",
    length: 20,
    unique: true,
  })
  mobile: string;

  @Column({ type: "varchar", nullable: true, length: 500, comment: "地址" })
  address: string;

  @Column({
    type: "varchar",
    nullable: true,
    length: 255,
    comment: "权限",
    default: "readonly",
  })
  role: string;

  // locked、active
  @Column({ type: "varchar", default: "active", length: 100, nullable: true })
  status: string; // 用户状态

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // 在插入之前先进行加密
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
```

- 在 helper 文件夹下创建`response.ts`文件，自定义响应格式

```ts
export interface IResponse {
  success: boolean;
  status: string;
  data?: any;
  errorMessage?: string;
}

export class SuccessResponse implements IResponse {
  success: boolean;
  status: string;
  data?: any;
  constructor(data?: any) {
    this.data = data;
    this.status = "success";
    this.success = true;
  }
}

export class ErrorResponse implements IResponse {
  success: boolean;
  status: string;
  errorMessage: string;
  constructor(message: string) {
    this.errorMessage = message;
    this.status = "error";
    this.success = false;
  }
}

export class LimitResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  constructor(data: T[], total: number) {
    this.success = true;
    this.data = data;
    this.total = total;
  }
}
```

- 其次，在目录`src/dto`文件夹下创建文件`user.ts`，用于声明 dto 内容；在目录`src/service`文件夹下创建 `user.ts`文件，用于构建服务相关实现。

dto `user.ts`文件

```ts
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class limitParamsDto {
  readonly current: number;

  readonly pageSize: number;

  readonly name?: string;

  readonly mobile?: string;

  readonly email?: string;

  readonly gender?: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: "登录账户不能为空" })
  readonly username: string;

  @IsNotEmpty({ message: "登录密码不能为空" })
  readonly password: string;

  @IsOptional() // 该构造器设置字段为可选字段（非必须字段）
  @IsString({ message: "用户名必须是 String 类型" })
  name?: string;

  @IsOptional()
  @IsString({ message: "用户头像必须是 String 类型" })
  readonly avatar?: string;

  @IsOptional()
  readonly birth_date?: Date;

  @IsOptional()
  @IsString({ message: "性别必须是 String 类型" })
  readonly gender?: string;

  @IsOptional()
  @IsString({ message: "用户邮箱地址必须是 String 类型" })
  readonly email?: string;

  @IsOptional()
  @IsString({ message: "用户练习方式必须是 String 类型" })
  readonly mobile?: string;

  @IsOptional()
  @IsString({ message: "用户所在地址必须是 String 类型" })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: "用户权限必须是 String 类型" })
  readonly role?: string;

  @IsOptional()
  @IsString({ message: "用户账号状态必须是 String 类型" })
  readonly status?: string;
}

export class UpdateUserDto {
  @IsNotEmpty({ message: "登录账户不能为空" })
  readonly username: string;

  password?: string;

  @IsOptional()
  @IsString({ message: "用户名必须是 String 类型" })
  readonly name?: string;

  @IsOptional()
  @IsString({ message: "用户头像必须是 String 类型" })
  readonly avatar?: string;

  @IsOptional()
  readonly birth_date?: Date;

  @IsOptional()
  @IsString({ message: "性别必须是 String 类型" })
  readonly gender?: string;

  @IsOptional()
  @IsString({ message: "用户邮箱地址必须是 String 类型" })
  readonly email?: string;

  @IsOptional()
  @IsString({ message: "用户练习方式必须是 String 类型" })
  readonly mobile?: string;

  @IsOptional()
  @IsString({ message: "用户所在地址必须是 String 类型" })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: "用户权限必须是 String 类型" })
  readonly role?: string;

  @IsOptional()
  @IsString({ message: "用户账号状态必须是 String 类型" })
  readonly status?: string;
}
```

service `user.ts`文件

```ts
import { CreateUserDto, limitParamsDto, UpdateUserDto } from "@/dto/userDto";
import { UsersEntity } from "@/entities/user";
import {
  ErrorResponse,
  IResponse,
  LimitResponse,
  SuccessResponse,
} from "@/helper/response";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly UsersRepository: Repository<UsersEntity>
  ) {}

  /**
   * 分页列表查询
   * @param queryParams
   * @returns
   */
  async limitAll(queryParams: limitParamsDto): Promise<LimitResponse<any>> {
    try {
      const {
        name,
        mobile,
        email,
        gender,
        current = 1,
        pageSize = 10,
      } = queryParams;
      const filter: any = {};
      if (name) {
        filter.name = Like(`%${name}%`);
      }
      if (mobile) {
        filter.mobile = mobile;
      }
      if (email) {
        filter.email = email;
      }
      if (gender) {
        filter.gender = gender;
      }
      const [list, count] = await this.UsersRepository.findAndCount({
        where: filter,
        take: pageSize,
        skip: (current - 1) * pageSize,
        order: {
          updated_at: "DESC",
        },
      });
      return new LimitResponse(list, count);
    } catch (error) {
      return new LimitResponse([], 0);
    }
  }

  /**
   * 创建
   * @param form
   * @returns
   */
  async create(form: CreateUserDto): Promise<IResponse> {
    try {
      const { username, email, mobile } = form;
      if (await this.queryByUserName(username))
        return new ErrorResponse("此登录账户已存在");
      if (email && (await this.queryByEmail(email)))
        return new ErrorResponse("此用户邮箱已存在");
      if (mobile && (await this.queryByMobile(mobile)))
        return new ErrorResponse("此用户联系方式已存在");
      const newUser = this.UsersRepository.create(form);
      await this.UsersRepository.save(newUser);
      return new SuccessResponse(newUser);
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }

  /**
   * 更新
   * @param id
   * @param form
   * @returns
   */
  async update(id: string, form: UpdateUserDto): Promise<IResponse> {
    try {
      const { password, username, email, mobile } = form;
      if (password) delete form.password;
      const oldUser = await this.UsersRepository.findOne({ where: { id } });
      if (!oldUser) return new ErrorResponse("无效的用户唯一标识符");
      if (
        username &&
        (await this.queryByUserName(username)) &&
        (await this.queryByUserName(username)).id !== id
      )
        return new ErrorResponse("此登录账户已存在");
      if (
        email &&
        (await this.queryByEmail(email)) &&
        (await this.queryByEmail(email)).id !== id
      )
        return new ErrorResponse("此用户邮箱已存在");
      if (
        mobile &&
        (await this.queryByMobile(mobile)) &&
        (await this.queryByMobile(mobile)).id !== id
      )
        return new ErrorResponse("此用户联系方式已存在");
      await this.UsersRepository.update(id, form);
      return new SuccessResponse();
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }

  /**
   * 删除
   * @param id
   * @returns
   */
  async delete(id: string): Promise<IResponse> {
    try {
      await this.UsersRepository.delete(id);
      return new SuccessResponse();
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }

  /**
   *  根据id查询指定用户
   * @param id
   * @returns
   */
  async queryUserDetail(id: string): Promise<IResponse> {
    try {
      const user = await this.UsersRepository.findOne({ where: { id } });
      if (user) return new SuccessResponse(user);
      return new ErrorResponse("无效用户唯一标识符");
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }

  // 根据id查询
  public async queryById(id: string): Promise<any> {
    return await this.UsersRepository.findOne({
      where: {
        id,
      },
    });
  }

  // 根据username进行查询
  public async queryByUserName(username: string): Promise<any> {
    return await this.UsersRepository.findOne({
      where: {
        username,
      },
    });
  }

  // 根据email进行查询
  public async queryByEmail(email: string): Promise<any> {
    return await this.UsersRepository.findOne({
      where: {
        email,
      },
    });
  }

  // 根据email进行查询
  public async queryByMobile(mobile: string): Promise<any> {
    return await this.UsersRepository.findOne({
      where: {
        mobile,
      },
    });
  }
}
```

- 接下来，在目录`src/controller`文件夹下创建`user.ts`文件用于构建路由路径。

```ts
import { CreateUserDto, limitParamsDto, UpdateUserDto } from "@/dto/userDto";
import { IResponse, LimitResponse } from "@/helper/response";
import { UsersService } from "@/service/user";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  //   分页列表查询
  @UseInterceptors(ClassSerializerInterceptor) // 配合Exclude使用，排除密码
  @Get("/limit")
  async limit(
    @Query() queryParams: limitParamsDto
  ): Promise<LimitResponse<any>> {
    return this.service.limitAll(queryParams);
  }

  /**
   * 指定详情
   * @param params
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  async detail(@Param() params: { id: string }): Promise<IResponse> {
    return this.service.queryUserDetail(params.id);
  }

  // 新建
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/new")
  async create(@Body() form: CreateUserDto): Promise<IResponse> {
    return this.service.create(form);
  }

  // 更新
  @Put("/:id")
  async update(
    @Param() params: { id: string },
    @Body() form: UpdateUserDto
  ): Promise<IResponse> {
    return this.service.update(params.id, form);
  }

  // 删除
  @Delete("/:id")
  async delete(@Param() params: { id: string }): Promise<IResponse> {
    return this.service.delete(params.id);
  }
}
```

- 最后，我们在目录`src/module`文件夹下创建`user.ts`文件，用于将`user.controller.ts`、`user.service.ts`文件进行联合引入使用。然后再在`app.module.ts`文件中将其挂载即可。

module `user.ts`文件

```TS
import { UsersController } from '@/controller/user';
import { UsersEntity } from '@/entities/user';
import { UsersService } from '@/service/user';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

```

`app.module.ts`文件

```TS
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import parseDev from '@@/config';
import { UsersModule } from './module/user';

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
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    UsersModule,
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
import { HttpExceptionFilter } from './httpExeception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 添加全局路由前缀
  app.setGlobalPrefix('/api/v1');
  // 全局使用DTO验证
  app.useGlobalPipes(new ValidationPipe());
  // 全局错误过滤器使用
  app.useGlobalFilters(new HttpExceptionFilter());
  // 加监听端口
  await app.listen(3000);
}
bootstrap();

```

这样我们就声明好了一些服务地址：

`创建 POST /api/v1/users/new`

`分页查询 GET /api/v1/users/limit`

`httpException.ts`

```TS
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { timeYMD } from './utils/utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errResponse: any = exception.getResponse();
    let message = exception.message;
    if (errResponse && errResponse.message) {
      message = errResponse.message;
    }
    if (Array.isArray(message)) {
      message = message.join('、');
    }
    const errorInfo = {
      time: timeYMD(), // 当前时间
      status: 'error',
      status_code: status,
      method: request.method,
      url: request.originalUrl,
      errorMessage: message,
    };
    // 控制台打印错误信息
    console.log(`${JSON.stringify(errorInfo)}`);
    // 错误响应格式
    const errorResponse = {
      status: 'error',
      success: false,
      errorMessage: message,
    };
    if (status !== 401 && status !== 404) {
      response.status(200);
    } else {
      response.status(status);
    }
    response.send(errorResponse);
  }
}

```

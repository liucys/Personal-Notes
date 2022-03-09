[Koa](https://koa.bootcss.com/) 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 koa 通过利用 async 函数，解决了回调函数的嵌套问题，并有力地增强错误处理。

**通过 Koa、TypeScript、Sequelize、MySQL 进行后端服务 API 开发**

- [Sequelize](https://www.sequelize.com.cn/)：是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。通过实例对象的语法,完成关系型数据库的操作
- [TypeScript](http://ts.xcatliu.com/)：TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码开源于 GitHub 上。

#### 新建一个空项目文件,并进行初始化

```javascript
npm init
tsc --init
```

#### 必须要安装的依赖

```javascript
yarn add koa koa-router
yarn add mysql2 // 因为使用的是mysql数据库,所以安装mysql2驱动,若是使用其他数据库,请查看sequelize官方文档安装相关指定驱动
yarn add koa-pino-logger koa-static // 请求日志与静态文件
yarn add koa-router-ts // 路由控制器
yarn add typescript // typescript依赖
yarn add nodemon dotenv ts-node // 热启动依赖
yarn add sequelize-typescript sequelize // sequelize依赖
yarn add reflect-metadata // 使用sequelize-typescript必须
yarn add koa-jwt // 路由鉴权，设置哪些router需要携带token信息
yarn add koa-bodyparser koa2-cors // 跨域与post请求解析
yarn add @types/koa @types/koa-router
yarn add @types/node @types/validator
```

#### 配置 tsconfig.json 文件

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "ES6",
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist"
  },
  "lib": ["es2015"]
}
```

#### 在根目录下创建 nodemon.json 文件

```json
{
  "watch": ["src"],
  "ignore": ["build", ".git", "node_modules"],
  "exec": "ts-node -r dotenv/config ./src/index.ts",
  "ext": "js,json,ts,tsx"
}
```

#### 配置 package.json 文件的`scripts`

```json
"scripts": {
    "build": "tsc",
    "dev": "nodemon --watch",
    "start": "node ./dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

#### 主要功能实现在 src 文件夹下进行,src 文件夹下的二级文件夹及文件有

> 1. controllers 文件夹 // 控制器管理文件目录,用于实现路由 API
> 2. constants 文件夹 // 自定义配置文件目录
> 3. models 文件夹 // sequelize model 文件目录
> 4. services 文件夹 // sequeize 操作 model 实现目录
> 5. middleware 文件夹 // 自定义中间件目录
> 6. public 文件夹 // 公共静态文件目录
> 7. utils 文件夹 // 自定义工具文件夹
> 8. index.ts 文件 // 项目入口文件

#### 项目运行命令

> - yarn dev // 本地开发启动命令
> - yarn build // 生成部署产物运行命令
> - yarn start // 部署产物启动命令

#### 进行项目开发

##### 首先,在 models 文件夹下新建 index.ts 文件,配置连接数据库

```typescript
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE, // 数据库名称
  dialect: "mysql", // 使用的数据库
  username: process.env.MYSQL_USER, // 用户名
  password: process.env.MYSQL_PASS, // 密码
  port: Number(process.env.PORT), // 数据库端口号
  models: [`${__dirname}/**/*.model.ts`, `${__dirname}/**/*.model.js`], // 相关联的model文件
});

sequelize.sync({ force: false });

export { sequelize };
export { Sequelize };
export default sequelize.models;
```

##### 然后 src 下的项目入口文件 index.ts 文件中配置启动服务

```typescript
import koa from "koa";
import { loadControllers } from "koa-router-ts";
import staticDev from "koa-static";
import logger from "koa-pino-logger";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import path from "path";
import cors from "koa2-cors";

// init db model
import "./models";
import { ErrorResponse } from "./constants/response";
import { ERROR_INTERNAL_SYSTEM, UNAUTHORIZED } from "./constants/response_code";

const staticPath = "./public";
const PORT = process.env.PORT || 3000;

const app = new koa();

app.use(staticDev(path.join(__dirname, staticPath)));
app.use(bodyParser());
app.use(logger());
app.use(cors());

// 自定义错误监听
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.log.error(
      `Request handle process occurred error, status is ${error.status}`
    );
    ctx.log.error(error);
    if (error.status === 401) {
      ctx.status = 401;
      ctx.body = new ErrorResponse(UNAUTHORIZED, error.message);
    } else {
      ctx.status = 500;
      ctx.body = new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }
});

// jwt,不需要鉴权的路由
app.use(
  jwt({
    secret: process.env.JWT_SECRET, // 此处的secret值应与生成token时所使用的secret值相同（不相同会导致token验证一直无效）
    debug: true,
  }).unless({
    path: [/^\/api\/v1\/user\/login/],
  })
);

const router = loadControllers(path.join(__dirname, "controllers"), {
  recurse: true,
});

router.prefix("/api/v1");

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`The service statrs on port ${PORT}`);
});
```

在 constants 文件夹下分别创建 response.ts 文件与 response_code.ts 文件

> 配置 response_code.ts 文件

```typescript
/**
 * 自定义响应码
 */
export const SUCCESS = 20001;
export const INVALID_REQUEST = 40000;
export const CREATED_FAILED = 40001;
export const UPDATED_FAILED = 40002;
export const DELETED_FAILED = 40003;
export const MISSING_FILE = 41001;
export const UNAUTHORIZED = 40100;
export const ACCESS_DENIED = 40300;
export const GENERAL_NOT_FOUND = 40400;
export const ERROR_INTERNAL_SYSTEM = 50000;
```

> 配置 response.ts 文件

```typescript
/**
 * 自定义响应内容格式
 */
import { WorkSheet } from "xlsx";
import * as responseCodes from "./response_code";
import { ERROR_INTERNAL_SYSTEM } from "./response_code";

export interface IResponse {
  status: string;
  code: number;
  getHttpStatusCode(): number;
}

// response success type
export class SuccessResponse implements IResponse {
  status: string;

  code: number;

  message: string;

  data: any;

  tid?: string;

  constructor(data: any, message = "", tid = "") {
    this.status = "ok";
    this.code = responseCodes.SUCCESS;
    this.message = message;
    this.data = data;

    if (tid) {
      this.tid = tid;
    }
  }

  /**
   * 获取 HTTP status code
   */
  public getHttpStatusCode(): number {
    return 200;
  }
}

// Response fail type
export class ErrorResponse implements IResponse {
  status: string;

  code: number;

  message: string;

  tid?: string;

  constructor(code: number, message: string, tid = "") {
    this.status = "error";
    this.code = code;
    this.message = message;

    if (tid) {
      this.tid = tid;
    }
  }

  public getHttpStatusCode(): number {
    return this.code >= ERROR_INTERNAL_SYSTEM ? 500 : 400;
  }
}

// response page type
export class PendingResponse implements IResponse {
  status: string;

  code: number;

  message: string;

  data: any;

  constructor(code: number, message: string, data: any) {
    this.status = "pending";
    this.code = code;
    this.message = message;
    this.data = data;
  }

  public getHttpStatusCode(): number {
    return 201;
  }
}

export class Pagination {
  /**
   * 数据总数
   */
  total: number;

  /**
   * 当前页数
   */
  current: number;

  /**
   * 每页条数
   */
  pageSize: number;

  constructor(total: number, current: number, pageSize: number) {
    this.total = Number(total);
    this.current = Number(current);
    this.pageSize = Number(pageSize);
  }

  /**
   * 总页数
   */
  get totalPage(): number {
    if (this.total === 0 || this.pageSize === 0) {
      return 0;
    }

    return Math.ceil(this.total / this.pageSize);
  }
}

export class PagedList<T> {
  list: T[];

  pagination: Pagination;

  constructor(list: T[], pagination: Pagination) {
    this.list = list;
    this.pagination = pagination;
  }
}

export class TableList<T> {
  data: T[];

  success: boolean;

  total: number;

  constructor(data: T[], total: number) {
    this.data = data;
    this.success = true;
    this.total = total;
  }
}

// read excel
export function getCellVal(sheet: WorkSheet, cell: string): string {
  const sheetCell = sheet[cell];
  if (sheetCell) {
    return clearText(sheetCell.v);
  }
  return "";
}

export function clearText(input: string): string {
  if (!input || typeof input !== "string") {
    return input;
  }
  return input.trim();
}
```

##### 正式创建项目 API,示例如下

- 第一步：在 models 文件夹下创建相关数据库 model 文件

```typescript
/**
 * 在models文件夹下新建 example.model.ts文件
 * 这里以创建example表为例
 **/
import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "example", // 需要生成的数据库表名
  underscored: true, // 是否使用下划线格式
  timestamps: true, // 是否自动生成 createdAt字段和 updatedAt字段
  indexes: [
    {
      fields: ["title"], // title 索引
      unique: false, // 是否唯一
    },
  ],
})
export default class Example extends Model<Example> {
  @Column({
    type: DataType.UUID, // 字段类型
    defaultValue: DataType.UUIDV4, // 字段默认值
    primaryKey: true, // 是否主键
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "标题", // 字段描述
  })
  title!: string;

  @Column({
    type: DataType.STRING(255),
    comment: "标签",
  })
  // 获取字符串内容并将其输出为数组格式
  get tags(): any {
    const tag: any = this.getDataValue("tags");
    if (tag) return tag.split(",");
    return [];
  }
  // 接收数组转为字符串格式存储存储
  set tags(value: any) {
    if (value && Array.isArray(value) && value.length > 0) {
      this.setDataValue("tags", value.join(","));
      return;
    }
    this.setDataValue("tags", null);
  }

  @Column({
    type: DataType.STRING(50),
    comment: "作者",
  })
  author!: string;

  @Column({
    type: DataType.STRING(20),
    comment: "联系方式",
  })
  mobile!: string;

  @Column({
    type: DataType.BOOLEAN,
    comment: "是否发布",
  })
  publish!: boolean;

  @Column({
    type: DataType.JSON,
    comment: "详细内容",
  })
  content!: any;
}
```

- 第二步：在 services 文件夹下创建相关操作服务文件

```typescript
/**
 * example.ts 文件
 * 操作数据库表example的实现
 */
import {
  ErrorResponse,
  IResponse,
  SuccessResponse,
  TableList,
} from "../constants/response";
import {
  ERROR_INTERNAL_SYSTEM,
  INVALID_REQUEST,
} from "../constants/response_code";
import { sequelize } from "../models";
import Example from "../models/example.model";

export default class ExampleService {
  /**
   * 分页查询
   * @param current
   * @param pageSize
   * @returns
   */
  async getPaging(current: number, pageSize: number): Promise<TableList<any>> {
    const filter: any = {};
    const data = await Example.findAndCountAll({
      where: filter,
      limit: pageSize,
      offset: (current - 1) * pageSize,
      order: [["updated_at", "DESC"]],
    });
    return new TableList(data.rows, data.count);
  }

  /**
   * 创建数据
   * @param ctx ctx
   * @param form 表单
   * @returns
   */
  async create(ctx: any, form: any): Promise<IResponse> {
    try {
      // 使用sequelize的托管事务
      const data = await sequelize.transaction(async (t) => {
        const result = await Example.upsert(form, {
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(data, "数据创建成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 更新数据
   * @param ctx ctx
   * @param id  id
   * @param form 表单
   * @returns
   */
  async update(ctx: any, id: string, form: any): Promise<IResponse> {
    try {
      if (!id) {
        return new ErrorResponse(INVALID_REQUEST, "id值为空");
      }
      const data = await sequelize.transaction(async (t) => {
        const result = await Example.update(form, {
          where: {
            id,
          },
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(data, "数据更新成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 删除数据
   * @param ctx
   * @param id
   * @returns
   */
  async delete(ctx: any, id: string): Promise<IResponse> {
    try {
      const data = await sequelize.transaction(async (t) => {
        const result = await Example.destroy({
          where: {
            id,
          },
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(data, "数据删除成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 批量删除数据
   * @param ctx ctx
   * @param ids ids
   * @returns
   */
  async deleteMutil(ctx: any, ids: Array<string>): Promise<IResponse> {
    try {
      if (!ids || !Array.isArray(ids)) {
        return new ErrorResponse(INVALID_REQUEST, "ids无效或不存在");
      }
      const data = await sequelize.transaction(async (t) => {
        const result = await Example.destroy({
          where: {
            id: ids,
          },
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(data, "数据批量删除成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }
}
```

- 第三步：在 controllers 文件夹下创建 example 路由文件

```typescript
/**
 * example.ts 文件
 * /api/v1/example 路由路径
 */
import { Controller, Get, Post, Delete, Put } from "koa-router-ts";
import ExampleService from "../services/example";

// instantiation
const service = new ExampleService();

// 设置路由路径地址
@Controller("/example")
export default class {
  /**
   * GET /api/v1/example?current=1&pageSize=10
   * 分页查询数据
   * @param ctx
   */
  @Get("/")
  async getPaging(ctx: any) {
    const { current, pageSize } = ctx.query;
    const result = await service.getPaging(current || 1, pageSize || 20);
    ctx.body = result;
  }

  /**
   * POST /api/v1/example
   * 创建数据
   * @param ctx
   */
  @Post("/")
  async create(ctx: any) {
    const { body } = ctx.request;
    const result = await service.create(ctx, body);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * PUT /api/v1/example/:id
   * 更新指定id数据
   * @param ctx
   */
  @Put("/:id")
  async update(ctx: any) {
    const { id } = ctx.params;
    const { body } = ctx.request;
    const result = await service.update(ctx, id, body);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * DELETE /api/v1/example/:id
   * 删除指定id数据
   * @param ctx
   */
  @Delete("/:id")
  async delete(ctx: any) {
    const { id } = ctx.params;
    const result = await service.delete(ctx, id);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * DELETE /api/v1/example?ids=xxxxx,yyyyy,zzzzz
   * 删除多个指定id数据
   * @param ctx
   * @returns
   */
  @Delete("/")
  async deleteMutil(ctx: any) {
    const { ids } = ctx.query;
    if (!ids) {
      ctx.status = 400;
      ctx.body = {
        status: "error",
        code: 40000,
        message: "ids不存在",
      };
      return;
    }
    const result = await service.deleteMutil(ctx, ids.split(","));
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }
}
```

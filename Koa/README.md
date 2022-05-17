[Koa](https://koa.bootcss.com/) 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 koa 通过利用 async 函数，解决了回调函数的嵌套问题，并有力地增强错误处理。

**通过 Koa、TypeScript、Sequelize、MySQL 进行后端服务 API 开发**

- [Sequelize](https://www.sequelize.com.cn/)：是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。通过实例对象的语法,完成关系型数据库的操作
- [TypeScript](http://ts.xcatliu.com/)：TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码开源于 GitHub 上。

#### 新建一个空项目文件,并进行初始化

```javascript
npm init
tsc --init
```

#### 要安装的依赖

```javascript
yarn add koa koa-router
yarn add mysql2 // 因为使用的是mysql数据库,所以安装mysql2驱动,若是使用其他数据库,请查看sequelize官方文档安装相关指定驱动
yarn add koa-pino-logger koa-static // 请求日志与静态文件
yarn add koa-router-ts // 路由控制器
yarn add typescript // typescript依赖
yarn add nodemon dotenv ts-node // 热启动依赖
yarn add sequelize-typescript sequelize // sequelize依赖
yarn add reflect-metadata // 使用sequelize-typescript必须
yarn add koa-jwt uuid// 路由鉴权，设置哪些router需要携带token信息；生成uuid
yarn add md5 randomstring // MD5加密 随机字符串生成
yarn add koa-bodyparser @koa/cors // 跨域与post请求解析
yarn add @types/koa @types/koa-router
yarn add @types/node @types/validator
yarn add @koa/multer multer // 实现上传接口
yarn add jsonwebtoken // token 生成，配合koa-jwt插件进行路由鉴权
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
> 5. middleware 文件夹 // 自定义中间件目录（可选）
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
  database: process.env.SQL_DATABASE, // 数据库名称
  dialect: "mysql", // 使用的数据库
  username: process.env.SQL_USER, // 用户名
  password: process.env.SQL_PASS, // 密码
  port: Number(process.env.SQL_PORT), // 数据库端口号
  models: [`${__dirname}/**/*.model.ts`, `${__dirname}/**/*.model.js`], // 相关联的model文件
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
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
import cors from "@koa/cors";
import { ErrorResponse } from "./constants/response";
import { ERROR_INTERNAL_SYSTEM, UNAUTHORIZED } from "./constants/response_code";

// init db model
import "./models";

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
      ctx.body = new ErrorResponse(UNAUTHORIZED, "token 无效或已过期");
    } else {
      ctx.status = 500;
      ctx.body = new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }
});

// jwt设置路由鉴权
app.use(
  jwt({
    secret: process.env.TOKEN_AUTH, // 此处的secret值应与生成token时所使用的secret值相同（不相同会导致token验证一直无效）
    debug: true,
  }).unless({
    // 不需要鉴权的路由
    path: [/^\/api\/v1\/users\/login/],
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
 * 目录 /src/models/account.model.ts
 * 登陆账户表
 **/
import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import UsersModel from "./user.model";

@Table({
  tableName: "account", // 数据库表名
  timestamps: true, // 是否自动创建时间戳字段
  underscored: true, // 是否启用下划线
  indexes: [
    {
      fields: ["username"], // 索引字段
      unique: true, // 是否唯一
    },
  ],
})
export default class AccountModel extends Model<AccountModel> {
  @Column({
    type: DataType.UUID, // 类型
    defaultValue: DataType.UUIDV4, // 默认值
    primaryKey: true, // 是否主键
  })
  id!: string;

  @Column({
    type: DataType.STRING(36),
    comment: "账户", // 描述
    unique: true, // 是否唯一
  })
  username!: string;

  @Column({
    type: DataType.STRING(36),
    comment: "密码",
  })
  password!: string;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.UUID,
    comment: "用户 ID",
  })
  user_id!: string;

  /**
   * 用户
   */
  @BelongsTo(() => UsersModel, {
    onDelete: "CASCADE",
    as: "user",
  })
  user!: UsersModel;
}
```

用户信息表

```typescript
/**
 * 目录 /src/models/user.model.ts
 */
import {
  Table,
  Column,
  DataType,
  Model,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import AccountModel from "./account.model";
import UserRoleModel from "./user_role.model";

@Table({
  tableName: "users", // 数据库表名称
  underscored: true, // 启用下划线格式
  timestamps: true, // 自动创建时间戳字段
  indexes: [
    {
      fields: ["mobile", "email"],
      unique: true,
    },
  ],
})
export default class UsersModel extends Model<UsersModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING(36),
    comment: "用户名",
  })
  fullname!: string;

  @Column({
    type: DataType.STRING(100),
    comment: "头像",
  })
  avatar!: string;

  @Column({
    type: DataType.STRING(10),
    comment: "性别",
  })
  gender!: string;

  @Column({
    type: DataType.STRING(20),
    comment: "出生日期",
  })
  birth_date!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "家庭地址",
  })
  address!: string;

  @Column({
    type: DataType.STRING(20),
    comment: "手机号码",
    unique: true,
  })
  mobile!: string;

  @Column({
    type: DataType.STRING(20),
    comment: "邮箱",
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "公司",
  })
  company!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "职务",
  })
  post!: string;

  @Column({
    type: DataType.STRING(100),
    comment: "个人网址",
  })
  website!: string;

  /**
   * 用户账户,一对一关联
   */
  @HasOne(() => AccountModel, {
    onDelete: "CASCADE",
    as: "account",
  })
  account!: AccountModel;

  /**
   * 用户权限，一对多关联
   */
  @HasMany(() => UserRoleModel, {
    onDelete: "CASCADE",
    as: "roles",
  })
  roles!: UserRoleModel;
}
```

用户权限表

```typescript
import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UsersModel from "./user.model";

@Table({
  tableName: "user_Role",
  underscored: true,
  timestamps: true,
})
export default class UserRoleModel extends Model<UserRoleModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING(64),
    comment: "权限名称",
  })
  name!: string;

  @Column({
    type: DataType.STRING(32),
    comment: "角色",
  })
  role!: string;

  @Column({
    type: DataType.INTEGER,
    comment: "排序",
  })
  role_order!: number;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.UUID,
    comment: "用户 ID",
  })
  user_id!: string;

  @BelongsTo(() => UsersModel, {
    onDelete: "CASCADE",
    as: "user",
  })
  user!: UsersModel;
}
```

- 第二步：在 services 文件夹下创建相关操作服务文件

```typescript
/**
 * 目录 /src/services/user.ts
 */
import md5 from "md5";
import jwt from "jsonwebtoken";
import {
  ErrorResponse,
  IResponse,
  SuccessResponse,
  TableList,
} from "../constants/response";
import {
  ERROR_INTERNAL_SYSTEM,
  INVALID_REQUEST,
  UNAUTHORIZED,
} from "../constants/response_code";
import { sequelize } from "../models";
import AccountModel from "../models/account.model";
import UsersModel from "../models/user.model";
import UserRoleModel from "../models/user_role.model";

export default class UserService {
  /**
   * 用户列表
   * @param param0
   * @returns
   */
  async getTableList({ current = 1, pageSize = 10 }): Promise<TableList<any>> {
    const filter = {};
    const result = await UsersModel.findAndCountAll({
      where: filter,
      include: [
        {
          model: AccountModel,
          attributes: ["id", "username"],
        },
        {
          model: UserRoleModel,
          attributes: ["id", "role"],
        },
      ],
      limit: pageSize,
      offset: (current - 1) * pageSize,
      order: [["updatedAt", "ASC"]],
    });

    const users = result.rows.map((item) => ({
      id: item.id,
      username: item.account.username,
      role: item.roles[0].role,
      fullname: item.fullname,
      avatar: item.avatar,
      email: item.email,
      mobile: item.mobile,
      company: item.company,
      address: item.address,
      website: item.website,
      birth_date: item.birth_date,
      gender: item.gender,
      post: item.post,
    }));
    const data = new TableList(users, result.count);
    return data;
  }
  /**
   * 创建用户
   * @param ctx
   * @param body
   * @returns
   */
  async create(ctx: any, body: any): Promise<IResponse> {
    try {
      const { username, password, fullname, mobile, email, avatar } = body;
      if (!username) {
        return new ErrorResponse(INVALID_REQUEST, "登陆账号不能为空");
      }
      if (!password) {
        return new ErrorResponse(INVALID_REQUEST, "登陆密码不能为空");
      }
      if (!fullname) {
        return new ErrorResponse(INVALID_REQUEST, "用户姓名不能为空");
      }
      if (!mobile) {
        return new ErrorResponse(INVALID_REQUEST, "用户手机号不能为空");
      }
      if (!email) {
        return new ErrorResponse(INVALID_REQUEST, "用户邮箱不能为空");
      }
      const validateUserName = await this.validateUserName(username);
      if (validateUserName) {
        return new ErrorResponse(INVALID_REQUEST, "登陆账号已存在");
      }
      const validateMobile = await this.validateMobile(mobile);
      if (validateMobile) {
        return new ErrorResponse(INVALID_REQUEST, "用户手机号已存在");
      }
      const validateEmail = await this.validateEmail(email);
      if (validateEmail) {
        return new ErrorResponse(INVALID_REQUEST, "用户邮箱已存在");
      }
      if (!avatar) {
        body.avatar =
          "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";
      }
      body.roles = [
        {
          name: "用户",
          role: "user",
          role_order: 0,
        },
      ];
      body.account = {
        username,
        password: md5(password),
      };
      const data = await sequelize.transaction(async (t) => {
        const result = await UsersModel.create(body, {
          include: [
            {
              model: AccountModel,
              as: "account",
            },
            {
              model: UserRoleModel,
              as: "roles",
            },
          ],
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(
        {
          id: data.id,
          username,
          fullname,
          email,
          mobile,
          avatar: data.avatar,
          company: data.company,
          post: data.post,
          address: data.address,
          website: data.website,
          gender: data.gender,
          birth_date: data.birth_date,
          role: data.roles[0].role,
        },
        "创建成功"
      );
    } catch (error) {
      ctx.log.error(error.message);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 登陆
   * @param ctx
   * @param body
   * @returns
   */
  async login(ctx: any, body: any): Promise<IResponse> {
    try {
      const { username, password } = body;
      if (!username || !password) {
        return new ErrorResponse(INVALID_REQUEST, "登陆账户或登陆密码不能为空");
      }
      const account = await AccountModel.findOne({
        include: [
          {
            model: UsersModel,
            as: "user",
          },
        ],
        where: {
          username,
        },
      });
      if (!account) {
        return new ErrorResponse(INVALID_REQUEST, "登陆账户错误");
      }

      if (account.password !== md5(password)) {
        return new ErrorResponse(INVALID_REQUEST, "登陆密码错误");
      }
      const token = jwt.sign(
        {
          id: account.user.id,
          fullname: account.user.fullname,
        },
        process.env.TOKEN_AUTH,
        {
          expiresIn: 2 * 60 * 60,
        }
      );
      return new SuccessResponse(
        {
          token,
          user: account.user,
        },
        "登陆成功"
      );
    } catch (error) {
      ctx.log.error(error.message);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 根据 token 获取当前用户
   * @param ctx
   */
  async getCurrentUserByToken(ctx: any): Promise<any> {
    try {
      const { authorization } = ctx.headers;
      const token = authorization.split(" ")[1];
      const { id } = await jwt.verify(token, process.env.TOKEN_AUTH);
      const user = await UsersModel.findByPk(id, {
        include: [
          {
            model: UserRoleModel,
            attributes: ["id", "role"],
          },
        ],
      });
      return new SuccessResponse(
        {
          id: user.id,
          fullname: user.fullname,
          name: user.fullname,
          avatar: user.avatar,
          mobile: user.avatar,
          company: user.company,
          post: user.post,
          email: user.email,
          access: user.roles[0].role,
          website: user.website,
          birth_date: user.birth_date,
          gender: user.gender,
          address: user.address,
        },
        "操作成功"
      );
    } catch {
      return new ErrorResponse(UNAUTHORIZED, "token 无效或已过期");
    }
  }

  /**
   * 删除指定用户
   * @param ctx
   * @param id
   * @returns
   */
  async delete(ctx: any, id: string): Promise<IResponse> {
    try {
      if (!id) {
        return new ErrorResponse(INVALID_REQUEST, "缺少指定用户ID");
      }
      const result = await sequelize.transaction(async (t) => {
        const item = await UsersModel.destroy({
          where: {
            id,
          },
          transaction: t,
        });
        return item;
      });
      return new SuccessResponse(result, "操作成功");
    } catch (error) {
      ctx.log.error(error.message);
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
        const result = await UsersModel.destroy({
          where: {
            id: ids,
          },
          transaction: t,
        });
        return result;
      });
      return new SuccessResponse(data, "批量操作成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  // 验证账户是否存在
  private async validateUserName(username: string) {
    const account = await AccountModel.findOne({
      where: {
        username,
      },
    });
    return account;
  }

  //   验证手机号是否存在
  private async validateMobile(mobile: string) {
    const user = await UsersModel.findOne({
      where: {
        mobile,
      },
    });
    return user;
  }

  //   验证邮箱是否存在
  private async validateEmail(email: string) {
    const user = await UsersModel.findOne({
      where: {
        email,
      },
    });
    return user;
  }
}
```

- 第三步：在 controllers 文件夹下创建 user 路由文件

```typescript
/**
 * 目录 /src/controllers/user.ts
 * /api/v1/example 路由路径
 */
import { Controller, Post, Get, Delete } from "koa-router-ts";
import UserService from "../services/user";

const service = new UserService();

@Controller("/users")
export default class {
  /**
   * 获取用户列表
   * @param ctx
   */
  @Get("/")
  async tableList(ctx: any) {
    const result = await service.getTableList(ctx.query || {});
    ctx.body = result;
  }

  /**
   * 用户登陆
   * @param ctx
   */
  @Post("/login")
  async login(ctx: any) {
    const { body } = ctx.request;
    const result = await service.login(ctx, body);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * 获取当前用户信息
   * @param ctx
   */
  @Get("/currentUser")
  async currentUser(ctx: any) {
    const result = await service.getCurrentUserByToken(ctx);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * 创建用户
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
   * 删除指定用户
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
   * DELETE /api/v1/users?ids=xxxxx,yyyyy,zzzzz
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

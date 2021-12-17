#### 开发环境项

```javascript
koa + typescript + sequelize + mysql;
```

实现图片上传 api 接口（此方法是将图片保存到本地）,需要安装的 npm 包有：

```javascript
  yarn add @koa/multer multer
  yarn add koa-static
```

1. 第一步,创建 model 文件

```typescript
/**
 * 在models文件夹下新建imgSrc.model.ts文件
 */
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "imgs", // 数据库表名称
  underscored: true, // 是否启用下划线
  timestamps: true, // 是否启用时间戳
  indexes: [
    // 索引
    {
      unique: false,
      fields: ["author", "type"],
    },
  ],
})
export default class ImgSrc extends Model<ImgSrc> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "名称",
  })
  name!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "地址",
  })
  src!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "画师",
  })
  author!: string;

  @Column({
    type: DataType.STRING(20),
    comment: "类型",
  })
  type!: string;
}
```

2. 第二步,创建服务操作文件

```typescript
/**
 * 在services文件夹下创建imgSrc.ts文件
 */
import path from "path";
import fs from "fs";
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
import ImgSrc from "../models/imgSrc.model";

export default class ImgSrcService {
  /**
   * 分页查询
   * @param type 图片类型
   * @param author 画师
   * @param current
   * @param pageSize
   * @returns
   */
  async getPaging(
    type: string,
    author: string,
    current: number,
    pageSize: number
  ): Promise<TableList<any>> {
    const filter: any = {};
    if (type) {
      filter.type = type;
    }
    if (author) {
      filter.author = author;
    }
    const data = await ImgSrc.findAndCountAll({
      where: filter,
      limit: pageSize,
      offset: (current - 1) * pageSize,
      order: [["updated_at", "DESC"]],
    });
    return new TableList(data.rows, data.count);
  }

  /**
   * 导入图片功能实现
   * @param ctx ctx
   * @param img 图片
   * @returns
   */
  async import(ctx: any, img: any): Promise<IResponse> {
    try {
      const { originalname, buffer, size } = img;
      if (size / (1024 * 1024) > 2) {
        return new ErrorResponse(INVALID_REQUEST, "仅支持上传低于2M的图片");
      }
      const time = new Date().getTime();
      // 图片后缀
      const prefix = originalname.substring(originalname.lastIndexOf("."));
      // 写入图片
      fs.writeFileSync(
        path.join(__dirname, `../public/imgs/${time}${prefix}`),
        buffer
      );
      // 图片相关信息
      const imgMsg: any = {
        name: time,
        type: "",
        author: "",
        src: `/imgs/${time}${prefix}`,
      };
      // 将图片相关信息存入数据库
      ImgSrc.create(imgMsg);
      return new SuccessResponse("img", "图片上传成功");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }
}
```

3. 第三步,创建相关路由路径实现

```typescript
/**
 * 在controllers文件夹下创建imgSrc.ts文件
 */
import { Controller, Get, Post } from "koa-router-ts";
import multer from "@koa/multer";
import ImgSrcService from "../services/imgSrc";

const service = new ImgSrcService();
const upload = multer();

@Controller("/imgs")
export default class {
  /**
   * 分页查询
   * @param ctx
   */
  @Get("/")
  async getPageList(ctx: any) {
    const { type, author, current, pageSize } = ctx.query;
    const result = await service.getPaging(
      type,
      author,
      current || 1,
      pageSize || 20
    );
    ctx.body = result;
  }

  /**
   * 导入图片
   * @param ctx
   * @returns
   */
  @Post("/import", upload.single("img"))
  async import(ctx: any) {
    const { file } = ctx.request;
    if (!file) {
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        status: "error",
        message: "上传失败,请重试",
      };
      return;
    }
    const result = await service.import(ctx, file);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }
}
```

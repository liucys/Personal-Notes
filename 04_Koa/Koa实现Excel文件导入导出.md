[TOC]

开发配置：TypeScript + Koa + Mysql + Sequelize

> Koa 构建服务，Mysql 存储数据，Sequelize 对象关系映射 ORM 操作数据库。

需要安装的 npx 包

```js
yarn add xlsx
yarn add xlsx-style
yarn add content-disposition
yarn add @koa/multer
```

- 首先，在项目中构建数据库模型

```ts
/* excel.model.ts文件**/
import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "excel", // 数据库中的表名
  underscored: true, // 支持下划线
  timestamps: true, // 自动添加created_at与updated_at字段
  indexes: [
    // 索引
    {
      unique: false, // 是否唯一
      fields: ["time"],
    },
  ],
})
export default class Excel extends Model<Excel> {
  @Column({
    type: DataType.UUID, // 类型
    primaryKey: true, // 主键
    defaultValue: DataType.UUIDV4, // 默认值
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "姓名",
  })
  name!: string;

  @Column({
    type: DataType.STRING(10),
    comment: "性别",
  })
  gender!: string;

  @Column({
    type: DataType.INTEGER,
    comment: "年龄",
  })
  age!: number;

  @Column({
    type: DataType.STRING,
    comment: "手机号",
  })
  phone!: string;

  @Column({
    type: DataType.STRING(50),
    comment: "时间",
  })
  time!: string;
}
```

- 其次，构建操作服务功能

```ts
/* excel.ts 文件**/
import moment from "moment";
import path from "path";
import XLSX from "xlsx";
import XlsxStyle from "xlsx";
import {
  ErrorResponse,
  IResponse,
  SuccessResponse,
} from "../constants/response";
import {
  ERROR_INTERNAL_SYSTEM,
  INVALID_REQUEST,
} from "../constants/response_code";
import Excel from "../models/excel.model";
import { getCellVal } from "../utils/utils";

export default class ExcelSerice {
  /**
   * 导入Excel数据
   * @param ctx
   * @param buffer
   * @returns
   */
  async import(ctx: any, buffer: Buffer): Promise<IResponse> {
    try {
      // 读取导入的excel文件
      const excelBook = XLSX.read(buffer, { cellDates: true });
      // 获取正确的excel表数据
      const sheet = excelBook.Sheets[excelBook.SheetNames[0]];
      // 获取表格区域
      const sheetRef = sheet["!ref"];
      if (!sheetRef) {
        return new ErrorResponse(INVALID_REQUEST, "无法正确读取该Excel文件");
      }
      const range = XLSX.utils.decode_range(sheetRef);
      // Excel表格总行数
      const rowCount = range.e.r + 1;
      // 总列数
      // const colCount = range.e.c + 1;
      if (
        getCellVal(sheet, "A1") !== "姓名" ||
        getCellVal(sheet, "B1") !== "性别" ||
        getCellVal(sheet, "C1") !== "年龄" ||
        getCellVal(sheet, "D1") !== "电话"
      ) {
        return new ErrorResponse(
          INVALID_REQUEST,
          "Excel 模板不符合规范，请下载正确的模版。"
        );
      }
      // 向数据库插入数据读取的数据
      for (let rowNum = 2; rowNum < rowCount; rowNum += 1) {
        const data: any = {
          name: getCellVal(sheet, `A${rowNum}`),
          gengder: getCellVal(sheet, `B${rowNum}`),
          age: getCellVal(sheet, `C${rowNum}`),
          phone: getCellVal(sheet, `D${rowNum}`),
          time: moment().format("YYYY-MM-DD"),
        };
        // 如果存在姓名，向数据库中插入数据
        if (data.name) {
          Excel.create(data);
        }
      }
      return new SuccessResponse(1, "成功导入数据");
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  /**
   * 导出Excel
   * @param ctx
   * @param time
   * @returns
   */
  async exports(ctx: any, time: string): Promise<IResponse> {
    try {
      if (!time) {
        return new ErrorResponse(INVALID_REQUEST, "查询时间不存在");
      }
      // 查询所有ids数据
      const data = await Excel.findAll({
        where: {
          time,
        },
      });
      if (!data) {
        return new ErrorResponse(INVALID_REQUEST, "无法根据此时间进行查询");
      }
      // 导出所用的excel表存放路径
      const template = path.join(__dirname, "../public/person.xlsx");
      const viewBook = XLSX.readFile(template); // 读取excel模板
      const sheet = viewBook.Sheets[viewBook.SheetNames[0]]; // 获取正确的excel表
      const sheetRef = sheet["!ref"];
      if (!sheetRef) {
        return new ErrorResponse(ERROR_INTERNAL_SYSTEM, "无法读取Excel");
      }
      // 读取行数
      const range = XLSX.utils.decode_range(sheetRef);
      /** 
     	当我们想要根据当前的excel模板创建新的工作表,并且进行数据导出时,我们可以通过
     	const newSheet=JSON.parse(JSON.stringify(sheet)); // 根据已有的excel模板创建新的sheet表
     	....使用newSheet进行数据填充
     	XLSX.utils.book_append_sheet(viewBook,newSheet,name); // veiwBook是上面读取的excel模板,newSheet是我们新复制的sheet表,name表示新的工作表的名称
     	this.setCellStyles(newSheet,rowCount); // 设置新工作表的样式.
     **/
      const rowCount = range.e.r + 1; // excel表格总行数
      // 数据填充
      data.forEach((item, index) => {
        sheet[`A${2 + index}`] = {
          // 单元格赋值
          v: item.name,
        };
        sheet[`B${2 + index}`] = {
          v: item.gender,
        };
        sheet[`C${2 + index}`] = {
          v: item.age,
        };
        sheet[`D${2 + index}`] = {
          v: item.phone,
        };
      });

      // 设置样式
      this.setCellStyles(sheet, rowCount);

      return new SuccessResponse(
        XlsxStyle.write(viewBook, {
          bookType: "xlsx",
          bookSST: false,
          type: "buffer",
        })
      );
    } catch (error) {
      ctx.log.error(error);
      return new ErrorResponse(ERROR_INTERNAL_SYSTEM, error.message);
    }
  }

  // 样式设置
  private setCellStyles(sheet: any, rowCount: number): void {
    sheet.A1.s = {
      font: { name: "宋体", sz: 16, color: "#FF00FF" },
    };

    for (let r = 2; r < rowCount; r += 1) {
      for (let c = 0; c < 5; c += 1) {
        const cellAddress = XlsxStyle.utils.encode_cell({ c, r });
        if (sheet[cellAddress]) {
          sheet[cellAddress].s = {
            // 设置字体样式大小
            font: {
              name: "宋体",
              sz: 11,
              bold: r === 1,
            },
            // 设置文字对齐方式
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            // 设置表格边框
            border: {
              top: { style: "thin", color: "#FF00FF" },
              bottom: { style: "thin", color: "#FF00FF" },
              left: { style: "thin", color: "#FF00FF" },
              right: { style: "thin", color: "#FF00FF" },
            },
          };
        }
      }
    }

    // 设置导出的excel表的列宽
    sheet["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
  }
}
```

- 接下来，构建路由地址

```ts
/* excel.ts文件 **/
import { Controller, Post } from "koa-router-ts";
import ExcelSerice from "../services/excel";
import multer from "@koa/multer";
import contentDisposition from "content-disposition";
import { ErrorResponse } from "../constants/response";
import { INVALID_REQUEST } from "../constants/response_code";

const service = new ExcelSerice();
const upload = multer();

@Controller("/excel")
export default class {
  /**
   * 导入excel表格数据
   * @param ctx
   * @returns
   */
  @Post("/import", upload.single("excel"))
  async import(ctx: any) {
    const { file } = ctx.request;
    if (!file) {
      ctx.status = 400;
      ctx.body = await new ErrorResponse(INVALID_REQUEST, "请上传Excel表");
      return;
    }
    const result = await service.import(ctx, file.buffer);
    ctx.status = result.getHttpStatusCode();
    ctx.body = result;
  }

  /**
   * 导出excel表格数据
   * @param ctx
   * @returns
   */
  @Post("/exports")
  async export(ctx: any) {
    const { time } = ctx.query;
    const result: any = await service.exports(ctx, time);
    ctx.status = result.getHttpStatusCode();
    if (ctx.status !== 200) {
      ctx.body = result;
      return;
    }
    // 设置头部信息
    ctx.set("Content-disposition", contentDisposition("个人信息表.xlsx"));
    // 前端若想下载一个根据查询参数生成的excel报表文件，需要后端设置请求内容的类型
    ctx.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    ctx.body = result.data;
  }
}
```

用到的函数方法

```ts
import { WorkSheet } from "xlsx";
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

- 最后在前端路由相关请求操作(以 React+AntDesign 开发为例—— Ant Design Pro 后台管理框架)

```jsx
// 导入excel表数据实现  抽离为 导入组件

import React from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/token';

const InportSheet = () => {
  /**
  * url: 导入excel的路由路径
  * actionRef 组件的功能实例
  **/
  const props = {
    name: 'excel',
    accept: '.xls,.lrmx,.xlsx',
    multiple: true,
    showUploadList: false,
    action: `/api/v1/excel/import`,
    headers: { Authorization: getToken() },
    method: 'POST',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name}文件上传成功.`);
      } else if (status === 'error') {
        message.error(`${info.file.name}文件上传失败,${info.file.response.message}`);
      }
    },
  };
  return (
    <Upload {...props}>
      <Button>
        <UploadOutlined />
        上传Excel表
      </Button>
    </Upload>
  );
};

export default InportSheet;



// 导出指定数据到excel表中 抽离为组件实现

import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/token';

const ExportSheet = (time) => {
  const ids = selectedRows.map((item) => item.id);

  const download = (blobUrl, name) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = name;
    a.href = blobUrl;
    const body = document.getElementsByTagName('body');
    body[0].appendChild(a);
    a.click();
    document.body.removeChild(a);
    actionRef.current.clearSelected();
  };

  const handleExport = () => {
    fetch(`/api/v1/excel/exports?time=${time}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken(),
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.blob())
      .then((data) => {
        const blobUrl = window.URL.createObjectURL(data);
        download(blobUrl, `人员信息.xlsx`);
      });
  };

  return (
    <Button onClick={handleExport}>
      <DownloadOutlined />
      导出
    </Button>
  );
};

export default ExportSheet;

```

Excel 文件样例
![excel](https://github.com/liucys/open-static-file/blob/main/Project_img/person.png)

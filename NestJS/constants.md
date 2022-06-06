### 在 `/src/constants` 目录结构下分别创建 `response.ts` 和 `response_code.ts`文件

```ts
// response_code.ts 文件
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

```ts
// response.ts 文件
import * as responseCode from "./response_code";

export interface IResponse {
  status: string;
  code: number;
  message: string;
}

// 响应成功
export class SuccessResponse implements IResponse {
  status: string;
  code: number;
  message: string;
  data: any;
  constructor(data: any, message = "操作成功") {
    this.status = "ok";
    this.code = responseCode.SUCCESS;
    this.message = message;
    this.data = data;
  }
}

// 响应失败
export class ErrorResponse implements IResponse {
  status: string;
  code: number;
  message: string;
  constructor(code: number, message: string) {
    this.status = "error";
    this.code = code;
    this.message = message;
  }
}

// 分页响应
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
```

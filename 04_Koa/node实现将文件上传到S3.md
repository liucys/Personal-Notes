[TOC]

S3 或 Simple Storage Service 是由 Amazon Web Services (AWS)提供的云存储服务 ——图像、发票、音频文件、压缩文件等。使用 S3，您可以托管任意数量的文件，而只需为您使用的内容付费。

S3 还按客户所在地区为客户提供多区域托管，因此能够真正快速地以最小延迟提供请求的文件。

文档地址

> https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
>
> https://www.tabnine.com/code/javascript/modules/aws-sdk

安装 npm 包

> npm install aws-sdk
> 或
> yarn add aws-sdk

&nbsp;

在项目中创建 s3.ts 文件

```ts
import AWS from "aws-sdk"; // 引入AWS SDK

// 配置AWS凭证（在AWS管理控制台可查看），生成s3对象
const s3 = new AWS.S3({
  region: process.env.POLY_BIDDING_S3_REGION,
  accessKeyId: process.env.POLY_BIDDING_S3_ACCESSKEYID,
  secretAccessKey: process.env.POLY_BIDDING_S3_SECRETACCESSKEY,
});

/**
 * 存储文件至s3存储桶
 * @param key 文件唯一标识，相当于文件名称标识
 * @param stream // 需要上传存储的文件 流
 * @param contentType // 类型,默认为"binary/octet-stream".若是上传图片，可以设置为"image/jpeg"类型；上传zip文件则类型为'application/zip'。
 * @param contentEncoding // 编码方式
 * @param isPrivate // 是否私有
 * @returns
 */
export function uploadFile(
  key: string,
  stream: any,
  contentType: string,
  contentEncoding: string,
  isPrivate: boolean = true
) {
  return new Promise((resolve, reject) => {
    const params: any = {
      Bucket: process.env.POLY_BIDDING_S3_BUCKET, // 存储桶名称
      Key: key,
      Body: stream,
      ACL: isPrivate ? "private" : "public-read",
    };
    // 判断是否通过浅拷贝增添属性
    if (contentType) {
      Object.assign(params, {
        ContentType: contentType,
      });
    }
    if (contentEncoding) {
      Object.assign(params, {
        ContentEncoding: contentEncoding,
      });
    }
    // 上传文件到s3存储桶
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      resolve(data); // 返回数据对象，其Location属性表示在s3上的引用链接地址
    });
  });
}

/**
 * 读取s3存储的指定内容
 * @param key 文件唯一标识 相当于文件名
 * @returns
 */
export function readFile(key: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const params: any = {
      Bucket: process.env.POLY_BIDDING_S3_BUCKET, // 存储桶名称
      Key: key,
    };
    s3.getObject(params, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      resolve(Buffer.from(data.Body));
    });
  });
}

/**
 * 创建s3存储桶，在项目中第一次使用s3时，调用一次创建存储桶，记住存储桶名称
 * @param bucket 存储桶名称
 */
export function createBucketIfNotExists(bucket: string) {
  const params = {
    Bucket: bucket, // 存储桶名称
  };
  // 检测该存储桶是否存在，若不存在，则创建存储桶
  s3.waitFor("bucketNotExists", params, (err) => {
    if (err) {
      console.log(err);
    } else {
      s3.createBucket(params, (cbErr) => {
        if (cbErr) {
          console.log(cbErr, cbErr.stack);
        } else {
          s3.createBucket();
        }
      });
    }
  });
}
```

然后再其他地方调用对应的方法即可

```ts
/**以上传图片为例**/
import { uploadFile } from '../xxxx/s3';

.....
// 上传图片到s3上存储。imgBuffer 图片流
const result= await uploadFile('ACG.png',imgBuffer,'image/jpeg',null,false);
// 图片在s3上的存储链接引用地址
const imgSrc=result.Location;
```

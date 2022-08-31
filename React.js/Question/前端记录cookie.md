React 前端记录 cookie

```ts
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

// 设置cookie
export const setCookie = (
  key: string,
  value: string | object,
  option = { expires: 30 }
) => {
  const newValue = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    "gP*R.aiYzsA1#ZWJic4%U?aW]vyQ9k5H"
  ).toString();
  Cookies.set(key, newValue, option);
};

// 获取cookie
export const getCookie = (key: string) => {
  try {
    const ciphertext: any = Cookies.get(key) || "";
    const bytes = CryptoJS.AES.decrypt(
      ciphertext,
      "gP*R.aiYzsA1#ZWJic4%U?aW]vyQ9k5H"
    );
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8) || "");
    return decryptedData;
  } catch (error) {
    return null;
  }
};

// 删除cookie
export const delCookie = (key: string) => {
  Cookies.remove(key);
};
```

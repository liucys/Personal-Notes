#### uuid 通常被用作全局唯一标识符

> UUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”，其中的 x 是 0-9 或 a-f 范围内的一个 32 位十六进制数。在理想情况下，任何计算机和计算机集群都不会生成两个相同的 UUID。UUID 的总数达到了 2^128（3.4×10^38）个，所以随机生成两个相同 UUID 的可能性非常小，但并不为 0。UUID 一词有时也专指微软对 UUID 标准的实现。

- 方法一

```js
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
uuid(); // "a1ca0f7b-51bd-4bf3-a5d5-6a74f6adc1c7"
```

- 方法二

```js
function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
uuid(); // "ffb7cefd-02cb-4853-8238-c0292cf988d5"
```

- 方法三

```js
function uuid2() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
uuid2(); // "748eea29-f842-4af9-a552-e1e1aa3ed979"
```

- 方法四

```js
// 指定长度和基数
function uuid2(len, radix) {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}
uuid2(16, 16); // "277571702EE33E11"
```

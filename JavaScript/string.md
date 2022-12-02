#### length

获取指定字符串的长度

```js
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

console.log(str.length); // 26
```

#### split

将指定字符串按照指定分隔符位置分割为数组类型

```js
let str1 = "Hello";
console.log(str1.split("")); // ['H','e','l','l','o']

let str2 = "abce?dd,cc";
console.log(str2.split("?")); // ["abce", "dd,cc"]
```

#### repeat

将指定字符串重复指定的次数;该方法并不会影响原始字符串,它返回一个新的字符串

```js
let str = "*";
console.log(str.repeat(4)); // ****
```

#### includes

判断指定字符内容是否存在指定字符串中.若存在则返回 true,若不存在则返回 false;

```js
let str = "apple,blue";
console.log(str.includes("apple")); // true

console.log(str.includes("red")); // false
```

#### startsWith

判断指定字符内容是否存在于指定字符串的开始位置;若是则返回 true,若不是则返回 false;

```js
let str = "sfaf";
console.log(str.startsWith("s")); // true;

console.log(str.startsWidth("f")); // false
```

#### endsWidth

判断指定字符内容是否存在于指定字符串的末尾位置.若是则返回 true,若不是则返回 false

```js
let str = "fafafsadc";

console.log(str.endsWidth("a")); // false

console.log(str.endsWidth("c")); // true
```

#### indexOf

在指定字符串中查询指定内容的下标位置，若找到则返回起始下标，若没有找到则返回 `-1`。

```js
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

console.log(str.indexOf("EFG")); // 4

console.log(str.indexOf("III")); // -1
```

#### lastIndexOf

查找指定字符串中指定内容最后一次出现的位置。若找到则返回下标位置；若没有找到则返回 `-1`。

```js
let str = "Hello,Hello,World!";

console.log(str.lastIndexOf("Hello")); // 6

console.log(str.lastIndexOf("Key")); // -1
```

#### search

用于搜索指定字符串中的指定内容；若找到则返回起始下标，若没有找到则返回 `-1`。

```js
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
console.log(str.search("EFG")); // 4
console.log(str.search("ccc")); // -1
```

#### slice

用于截取指定字符串中指定位置区域的内容

> 语法: string.slice(startIndex,endIndex);
>
> > string: 指定字符串
> >
> > startIndex: 数值型参数,支持正负值(当为负值时表示从后往前算起始位置).表示起始下标位置
> >
> > endIndex: 可选数值型参数,支持正负值(当为负值时表示从后往前算起始位置).表示终止下标位置.
>
> 注意:若第二个参数终止下标位置参数没有设置,则将截取从起始下标位置开始后的所有内容

```js
let str = "Apple, Banana, Mango";
let res = str.slice(7, 13); // Banana
var res = str.slice(-13, -7); //Banana
let ress = str.slice(7); // Banana, Mango
```

#### substring

用于截取指定字符串中指定位置区域的内容

> 语法: string.substring(startIndex,endIndex);
>
> > string: 指定字符串
> >
> > startIndex: 数值型参数(只支持正值).表示起始下标位置
> >
> > endIndex: 可选数值型参数(只支持正值),表示终止下标位置.
>
> 注意:若第二个参数终止下标位置参数没有设置,则将截取从起始下标位置开始后的所有内容

```js
let str = "Apple, Banana, Mango";
let res = str.substring(7, 13); // Banana
let ress = str.substring(7); // Banana, Mango
```

#### substr

用于截取指定字符串中指定长度的内容

> 语法: string.substr(startIndex,length);
>
> > string: 指定字符串
> >
> > startIndex: 查找的起始下标位置(可为负值;若为负值,则从后往前算坐标位置)
> >
> > length: 可选数值型参数,表示需要截取的内容长度
>
> 注意:若第二个参数没有设置,则将截取从起始下标位置开始后的所有内容

```js
let str = "Apple, Banana, Mango";
let res = str.substr(7, 13); // Banana
let ress = str.substr(7); // Banana, Mango
```

#### replace

用于替换指定字符串中的指定内容;replace() 方法不会改变调用它的字符串。它返回一个新字符串。

> 语法: string.replace(oldStr,newStr);
>
> > string: 指定字符串
> >
> > oldStr: 需要被替换的内容(支持正则表达式语法)
> >
> > newStr: 新的内容

```js
let str = "Apple, Banana, Mango";
console.log(str.replace("Apple", "Hello")); // Hello, Banana, Mango
```

#### toUpperCase

将指定字母字符串转换为大写格式;toUpperCase() 方法不会改变调用它的字符串。它返回一个新字符串。

> 语法: string.toUpperCase();
>
> > string: 需要转换的字符串。

```js
let str = "abcd";
console.log(str.toUpperCase()); // ABCD
```

#### toLowerCase

将指定字母字符串转换为小写格式;toLowerCase()方法不会改变调用它的字符串。它返回一个新字符串。

> 语法: string.toLowerCase();
>
> > string: 需要转换的字符串

```js
let str = "ABCD";
console.log(str.toLowerCase()); // 'abcd'
```

#### concat

将两个或多个字符串连接

> 语法: str1.concat(str2,str3,...);
>
> > str1: 指定字符串
> >
> > str2,str3,... : 需要连接的字符串内容;

```js
let str1 = "Hello";
let str2 = "World";
let str3 = "Good";

console.log(str1.concat(str2)); // HelloWorld
console.log(str1.concat(" ", str2, " ", str3)); // Hello World Good
```

#### trim

删除指定字符串首尾两端的空白符；IE8 或更低版本不支持该方法；可搭配正则表达式使用 `replace` 方法代替。

> 语法: string.trim();
>
> > string: 指定字符串

```js
var str = "       Hello World!        ";
alert(str.trim()); // Hello World
```

#### chartAt

获取指定字符串中指定下标位置的字符; 它返回一个指定位置的字符。

> 语法: string.chartAt(index);
>
> > string:指定字符串
> >
> > index: 指定位置下标

```js
let str = "World";
console.log(str.chartAt(2)); // r
```

#### chartCodeAt

获取指定字符串中指定下标位置字符的 unicod 编码;它返回一个指定位置的字符的 unicode 编码。

> 语法: string.chartCodeAt(index);
>
> > string:指定字符串
> >
> > index: 指定位置下标

```js
var str = "HELLO WORLD";
str.charCodeAt(0); // 返回 72
```

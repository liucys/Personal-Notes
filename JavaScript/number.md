#### toString

将指定数值转换为字符串类型

> 语法: number.toString()
>
> > number: 需要转换的数值

```js
let count = 123;

console.log(typeof count.toString()); // string
```

#### toExponential

将指定数值转换为字符串值，它包含已被四舍五入并使用指数计数法的数字。该方法并不会影响原始数组,它返回一个新的转换后的字符串值.

> 语法: number.toExponential(length);
>
> > number: 指定数值
> >
> > length: 可选参数,表示小数点后面的字符串长度,若没有设置,则不会对数字进行舍入操作。

```js
let x = 9.656;
x.toExponential(2); // 返回 9.66e+0
x.toExponential(4); // 返回 9.6560e+0
x.toExponential(6); // 返回 9.656000e+0
```

#### toFixed

将指定数值四舍五入截取为指定小数点位数的字符串值

> 语法: number.toFixed(length);
>
> > number: 只指定数值
> >
> > length: 需要截取的小数点位数

```js
let x = 9.656;
x.toFixed(0); // 返回 10
x.toFixed(2); // 返回 9.66
x.toFixed(4); // 返回 9.6560
x.toFixed(6); // 返回 9.656000
```

#### toPrecision

将指定数值四舍五入为指定长度的字符串值。

> 语法: number.toPrecision(length);
>
> > number: 只指定数值
> >
> > length: 需要截取的小数点位数

```js
let x = 9.656;
x.toPrecision(); // 返回 9.656
x.toPrecision(2); // 返回 9.7
x.toPrecision(4); // 返回 9.656
x.toPrecision(6); // 返回 9.65600
```

#### valueOf

将数值以数值的形式返回

> 语法: number.valueOf();
>
> > number: 需要转换的数值

```js
let x = 123;
x.valueOf(); // 从变量 x 返回 123
(123).valueOf(); // 从文本 123 返回 123
(100 + 23).valueOf(); // 从表达式 100 + 23 返回 123
```

#### Number

将指定对象转换为数值类型;如果无法转换数字，则返回 NaN。

> 语法: Number(arg);
>
> > arg: 需要转换的对象

```js
x = true;
Number(x); // 返回 1
x = false;
Number(x); // 返回 0
x = new Date();
Number(x); // 返回 1404568027739
x = "10";
Number(x); // 返回 10
x = "10 20";
Number(x); // 返回 NaN
```

#### parseInt

将指定对象转换为整型数值类型;若指定对象是对象类型,则只将以字母开头的字符类型中的数字转换出来.否则将返回 NaN

> 语法:parseInt(arg);
>
> > arg: 需要转换的对象

```js
parseInt("10"); // 返回 10
parseInt("10.33"); // 返回 10
parseInt("10 20 30"); // 返回 10
parseInt("10 years"); // 返回 10
parseInt("years 10"); // 返回 NaN
```

#### parseFloat

将指定对象转换为值类型;若指定对象是字符串类型,则只将以字母开头的字符类型中的数字转换出来.否则将返回 NaN

> 语法:parseFloat(arg);
>
> > arg: 需要转换的对象

```js
parseFloat("10"); // 返回 10
parseFloat("10.33"); // 返回 10.33
parseFloat("10 20 30"); // 返回 10
parseFloat("10 years"); // 返回 10
parseFloat("years 10"); // 返回 NaN
```

#### Number.EPSILON

返回最小精度的数值.

> 语法：Number.EPSILON

```js
const EPSILON = Number.EPSILON; // 2.220446049250313e-16
```

#### Number.MIN_SAFE_INTEGER

返回最小安全数值

> 语法：Number.MIN_SAFE_INTEGER

```js
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER; // -2^53
```

#### Number.MAX_SAFE_INTEGER

返回最大安全数值

> 语法：Number.MAX_SAFE_INTEGER

```js
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 2^53
```

#### Number.isFinite

检测指定数值是否为有限数值,返回值为布尔值(检测对象为非数值对象时,一律返回 false)

> 语法：Number.isFinite(number)
>
> > number：需要检测的数值

```js
const num = 3;
Number.isFinite(num); // true
```

#### Number.isNaN

用于检测指定目标是否是 NaN,返回值为布尔值

> 语法：Number.isNaN(n)
>
> > n：需要检测的目标

```js
Number.isNaN(3); // false
Number.isNaN(NaN); // true
```

#### Number.isInteger

用于检测目标对象是否是一个整数,返回值是一个布尔值

> 语法：Number.isInteger(n)
>
> > n：需要检测的目标

```js
Number.isInteger(3); // true
Number.isInteger(3.22); // false
```

#### Number.isSafeInteger

用于检测目标对象是否在数值安全范围内(检测非数值对象时,一律返回 fales)

> 语法：Number.isSafeInteger(n)
>
> > n：需要检测的目标对象

```js
Number.isFafeInteger(3); // true
Number.isFafeInteger("22"); // false
```

#### Math.trunc

返回指定对象的整数数值部分(处理对象为非数值类型时,返回 NaN)

> 语法：Math.trunc(n)
>
> > n：需要处理的数值对象

```js
Math.trunc("22ddd"); // NaN
Math.trunc(22); // 22
Math.trunc(3.3333); // 3
```

#### Math.sign

返回数值的类型：整数返回 1,负数返回-1,零返回 0(非数值对象检测时返回 NaN)

> 语法：Math.sign(n)
>
> > n：需要检测的数值对象

```js
Math.sign(12); // 1
Math.sign(-22); // -1
Math.sing(0); // 0
Math.sign("ddd"); // NaN
```

#### Math.abs

用于返回指定数值的绝对值

> 语法：Math.abs(n);
>
> > n：数值类型,目标对象

```js
Math.abs(-22); // 22
Math.abs(12); // 12
```

#### Math.ceil

对数值类型的目标对象进行向上舍入

> 语法：Math.ceil(n)
>
> > n：数值类型,目标对象

```js
Math.ceil(22.2); // 23
Math.ceil(22); //  22
```

#### Math.floor

对数值类型的目标对象进行向下舍入

> 语法：Math.floor(n)
>
> > n：数值类型,目标对象

```js
Math.floor(22.2); // 22
Math.floor(22.8); // 22
```

#### Math.max(x,y)

检测数值类型 x 与 y 之间的最大数

> 语法：Math.max(x,y)
>
> > X,Y 数值类型,目标对象

```js
Math.max(12, 10); // 12
```

#### Math.min(x,y)

检测数值类型 x 与 y 之间的最小数

> 语法：Math.min(x,y)
>
> > X,Y 数值类型,目标对象

```js
Math.min(12, 10); //10
```

#### Math.random()

返回 0 到 1 之间的随机数

> 语法：Math.random()

```js
Math.random(); // 0.4
Math.random(); // 0.2
```

#### Math.round

对指定数值目标对象进行四舍五入

> 语法：Math.round(n)
>
> > n：数值类型,目标对象

```js
Math.round(2.222); // 2
Math.round(2.5); // 3
```

#### Math.sqrt

返回指定数值的平方根

> 语法：Math.sqrt(n)
>
> n：数值类型,目标对象

```js
Math.sqrt(4); // 2
Math.sqrt(36); // 6
```

#### Math.pow(x,y)

返回指定数值 x 的 y 次幂

> 语法：Math.sqrt(x,y)
>
> > x,y：数值类型,目标对象

```js
Math.pow(2, 3); // 8
```

#### 更多方法：https://www.w3school.com.cn/jsref/jsref_obj_math.asp

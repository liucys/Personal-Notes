#### toString

将指定数组转换为以 逗号 分隔的字符串

> 语法:array.toString();
>
> > array: 需要转换的数组

```js
let fruits = ["Banana", "Orange", "Apple", "Mango"];

console.log(fruits.toString()); // 'Banana,Orange,Apple,Mango'
```

#### join

将指定数组转换为以指定分隔符相连的字符串

> 语法: array.join(re);
>
> > array: 指定数组
> >
> > re: 指定分隔符,如: ','或'\'或'?'等

```js
let list = ["2020", "03", "14"];

console.log(list.join("-")); // '2020-03-14';
```

#### reverse

将指定数组的元素值位置颠倒;该方法会改变原数组。

> 语法: array.reverse();
>
> > array: 指定数组

```js
let list = [1, 2, 3, 4, 5];
list.reverse();
console.log(list); // [5,4,3,2,1];
```

#### shift

删除指定数组内容的第一个元素;并将删除的元素返回。

> 语法: array.shift();
>
> > array: 指定数组

```js
let arr = ["A", "B", "C"];

let arr_s = arr.shift();

console.log(arr); //['B','C'];

console.log(arr_s); // A
```

#### unshift

向指定数组的头部位置添加一个或多个元素内容。

> 语法: array.unshift(arg1,arg2,...);
>
> > ar1,ar2,... : 添加的元素内容

```js
let arr = ["A", "B"];
arr.unshift("K");

console.log(arr); // ['K',A','B']

let length = arr.unshift("D", "C", true);

console.log(arr); // ['D','C',true,'A','B','K'];

console.log(length); // 6
```

#### pop

删除指定数组内容的最后一个元素;并将删除的元素返回。

> 语法: array.pop()
>
> > array:指定数组

```js
let arr = ["A", "B", "C", "D"];
let pop_s = arr.pop();

console.log(arr); // ['A','B','C'];

console.log(pop_s); // D
```

#### push

向指定数组的末尾添加一个或多个元素内容,并返回新数组的长度

> 语法:array.push(ar1,ar2,...);
>
> > array: 指定数组
> >
> > ar1,ar2,... : 添加的元素

```js
let arr = ["A", "B"];
arr.push("K");

console.log(arr); // ['A','B','K']

let length = arr.push("D", "C", true);

console.log(arr); // ['A','B','K','D','C',true];

console.log(length); // 6
```

#### splice

对数组进行删除或添加操作;该方法会改变原始数组,它将返回一个包含已删除项的新数组。

> 作用: 用于对指定数组进行删除、添加等操作
>
> 语法: array.splice(startIndex,[deleteNum],[arg1,arg2,...]);
>
> > array: 指定数组
> >
> > startIndex: 指定起始下标位置
> >
> > deleteNum: 可选数值参数,当大于 0 时,表示 startIndex 位置删除 deleteNum 个数的数组元素;当等于 0 时表示添加元素;若没有该参数,则表示删除从 statrInde 位置开始后面的所有元素.
> >
> > arg1,arg2,... : 可选参数,当 deleteNum 为 0 时,表示从 startIndex 位置添加元素 arg1、arg2、...

```js
let list = ["A", "B", "C"];

// 添加操作
let arr = list.splice(1, 0, true, "Hello", 10);

console.log(arr); //[]
console.log(list); // ['A',true,'Hello',10,'B','C'];

// 删除操作
let arr1 = list.splice(1, 1);

console.log(arr1); // [true];
console.log(list); // ['A','Hello',10,'B','C'];

// 删除操作
let arr2 = list.splice(2);

console.log(arr2);
[10, "B", "C"];
console.log(list); // ['A','Hello'];
```

#### concat

用于进行一个或多个数组的合并

> 语法: arr1.concat(arr2,arr3,arr4);
>
> > arr1: 指定数组
> >
> > arr2,arr3,arr4: 合并的一个或多个数组

```js
let arr1 = ["Cecilie", "Lone"];
let arr2 = ["Emil", "Tobias", "Linus"];
let arr3 = ["Robin", "Morgan"];
let myChildren = arr1.concat(arr2, arr3); // 将arr1、arr2 与 arr3 连接在一起
```

#### slice

用于截取指定数组中指定位置区域内的所有元素;该方法并不会改变原数组。

> 语法: array.slice(startIndex,endIndex);
>
> > array: 指定数组
> >
> > startIndex: 数值型参数,表示截取的起始下标位置
> >
> > endIndex: 可选的数值型参数,表示截取的终止下标位置;若没有该参数,则表示从起始下标位置开始往后截取所有元素

```js
let fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
let citrus = fruits.slice(1, 3);
console.log(citrus); // ["Orange", "Lemon"]

let fruits1 = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
let citrus1 = fruits.slice(3);
console.log(citrus1); //["Apple", "Mango"]
```

#### indexOf

查找指定数组中是否存在某个值,若存在则返回其下标位置(存在多个相同查找目标值时,返回第一个匹配值的下标位置),若不存在则返回 `-1`。

> 语法: array.indexOf(value);
>
> > array: 指定数组
> >
> > value: 需要查找的值

```js
let list = ["A", "P", "P", "L", "E"];

console.log(list.indexOf("P")); // 1

console.log(list.indexOf("H")); // -1
```

#### includes

查找指定数组中是否存在某个指定值.若存在则返回 true,若不存在则返回 false;

> 语法: array.includes(value);
>
> > array: 指定数组
> >
> > value: 需要查找的值

```js
let list = [2, 3, "H", "d"];

console.log(list.includes(3)); // true

console.log(list.includes("K")); // false
```

#### find

用于获取指定数组中满足指定函数条件的第一个元素值;若数组中不存在满足条件的值,则返回 `undefined`。

> 语法: array.find(function(value,index,arr));
>
> > array.find(function(curValue,index,arr){
> > ...条件判断内容
> > },thisValue)
> >
> > > array: 指定数组
> > >
> > > curValue:必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 find 方法的数组对象
> > > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let arrs = [3, 2, 1, 5, 7, 4];
let num = arrs.find(function (curValue) {
  return curValue > 4;
});
console.log(num); //5,因为当查询到5大于4时,就满足了条件,不再继续执行后面的判断,所以只输出5
```

#### findIndex

获取指定数组中满足指定函数条件的第一个元素值的下标位置;若数组中不存在满足条件的元素值,则返回 `-1`

> 语法:
>
> > array.findIndex(function(curValue,index,arr){
> > ...//判断条件执行
> > },thisValue)
> >
> > > array: 指定数组
> > >
> > > curValue:必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 find 方法的数组对象
> > > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [1, 2, 3, 4, 5, 6];

let result = list.findIndex(function (value, index, arr) {
  return value > 3;
});

console.log(result); // 3 ;因为当查询到4大于3时,就满足了条件,不再继续执行后面的判断,所以只输出4的下标值3
```

#### every

判断指定数组中的每个元素值是否都满足指定函数条件;如果每个元素值都满足条件则返回 true,如果有一个元素值不满足条件,则返回 false。

> 语法: array.every(function(value,index,arr){},thisValue)
>
> > array: 指定的数组
> >
> > curValue:必须参数,当前数组元素的值
> > index :可选参数,当前数组元素的下标值
> > arr :可选参数,调用 map 方法的数组对象
> > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [1, 2, 3, 4, 5];

let res = list.every(function (value, index, arr) {
  return value > 3;
});
console.log(res); // false;因为数组中只有4和5满足大于3的条件;因此返回false

let res = list.every(function (value, index, arr) {
  return value > 0;
});
console.log(res); // true;因为数组中每个元素都大于0,因此返回true
```

#### some

判断指定数组中是否存在满足指定函数判断的元素值;如果指定数组中有一个元素满足判断条件,则返回值就为 true;如果都不满足,则返回 false;

> 语法: array.some(function(value,index,arr){},thisvValue);
>
> > array: 指定的数组
> >
> > curValue:必须参数,当前数组元素的值
> > index :可选参数,当前数组元素的下标值
> > arr :可选参数,调用 map 方法的数组对象
> > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [2, 4, 6, 3, 1];

let res = list.some(function (value, index, arr) {
  return value > 4;
});
console.log(res); // true,因为6大于4;
```

#### map

用于遍历数组,对数组进行相应操作;该方法返回一个改变了内容的新数组.并不会改变原数组。

> 语法:
>
> > array.map(function(curValue,index,arr){
> > ...执行内容
> > },thisValue)
> >
> > > array: 指定的数组
> > >
> > > curValue:必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 map 方法的数组对象
> > > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [1, 2, 3, 4];

let arr = list.map(function (value, index, arr) {
  return value * 2;
});
console.log(arr); // [2,4,6,8]
```

#### for of

此方法可用于循环迭代数组

> 语法:
>
> > for(let value of obj/array){}
> >
> > > value: 迭代的值,若迭代的是一个对象,则该处指对象的属性值;若迭代的是一个数组,则该处指的是数组元素
> > >
> > > obj/array: 被迭代的对象或数组

```js
let list = [1, 2, 3, 4];
let person = {
  name: "XiaoMing",
  age: 18,
  sex: "男",
};

for (let item of list) {
  console.log(item); // 1,2,3,4 ; 表示数组中每一个元素值
}

for (let item of person) {
  consol.log(item); // XiaoMing 18 男 ; 表示对象中每一个属性值
}
```

#### forEach

用于调用指定数组中的每个元素，并将元素传递给回调函数进行相应处理;该方法并不会改变原数组.不会返回新的数组.主要用于对调用的数组进行数据操作.

> 语法:
>
> > array.forEach(function(curValue,index,arr){
> > ...元素处理内容
> > },thisValue)
> >
> > > array: 指定的数组
> > >
> > > curValue :必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 map 方法的数组对象
> > > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [1, 2, 3, 4, 5];

list.forEach(function (value, index, arr) {
  if (arr[index] > 0) {
    list[index] = value * 2;
  }
});
console.log(list); // [2,4,6,8,10]
```

#### filter

为数组中的每一个元素依次执行回调函数,该方法会返回一个新的数组，新数组中的元素是满足了指定要求后返回的原始数组中的元素,若没有元素满足要球,则这个新数组为空数组。

> 语法:
>
> > array.filter(function(curValue,index,arr){
> > return 指定的需求判断(当为真时,返回出去;当为假时,自动过滤掉,进行下一个元素判断)
> > },thisValue)
> >
> > > array: 指定数组
> > >
> > > curValue:必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 map 方法的数组对象
> > > thisValue:可选参数,执行回调函数时,该值被用作回调函数中的 this 指向,若没有设置,则 this 指向为全局对象。

```js
let list = [1, 2, 3, 4, 5];

let arr = list.filter(function (curValue, index, arr) {
  return curValue > 3;
});

console.log(arr); // [4,5];
```

#### reduce

为数组中的每一个元素依次执行回调函数,reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。reduce() 可以作为一个高阶函数，用于函数的 compose。

> 语法:
>
> > array.reduce(function(preValue,curValue,index,arr){
> >
> > },initValue)
> >
> > > array: 指定数组
> > >
> > > preValue:上一次调用回调返回的值，或者是提供的初始值（initValue）
> > > curValue:必须参数,当前数组元素的值
> > > index :可选参数,当前数组元素的下标值
> > > arr :可选参数,调用 map 方法的数组对象
> > > initValue:可选参数,作为第一次调用回调函数时的第一个参数的值。如果没有提供 initValue，则将使用数组中的第一个元素(即 curValue 的值从下标 1 开始)。在没有初始值的空数组上调用 reduce 将报错。(使用 reduce 时,推荐设置 initValue 这个参数,将其设置为 0)
>
> 注意:如果没有提供初始值 initValue,reduce 会从索引下标为 1 的地方开始执行回调函数方法，跳过第一个索引。如果提供 initValue，从索引 0 开始。
> 因此在使用使用 reduce 时,推荐设置 initValue 这个参数,将其设置为 0

```js
// 使用reduce方法进行数组去重
let list = [2, 2, 4, 3, 1, 5, 4, 6];

let arr = list.reduce(function (pre, cur, index, array) {
  if (!pre.includes(cur)) {
    pre.push(cur);
  }
  return pre;
}, []);

console.log(arr); // [2,4,3,1,5,6];
```

在 ES6 中存在，为 Array 对象新增了一些方法，用于我们对数组进行处理。

#### Array.from

Array.from 方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

> 语法: Array.from(arraylike,fn)
>
> > arraylike：被转换的伪数组对象
> > fn：可选函数，若是声明了此函数，则在进行转换时，数组中的每一个元素都将调用一次此函数。

```js
// 将类数组对象转换为数组
// 类似数组对象即对象中的键名为数字或字符串数字的对象，同时对象中存在length属性，用于表示数组的长度
// 对象中的数字键名即表示该属性在数组中的下标位置.

// 案例一
let list = {
  1: "张三",
  3: 14,
  5: "男",
  6: "江苏南京",
  length: 8,
};
console.log(Array.from(list)); // [undefined,'张三',undefined,14,undefined,'男','江苏南京',undefined]

// 案例二
let fn = function (a, b, c) {
  let arr = Array.from(arguments);
  arr.map((item) => {
    console.log(item);
  });
};

// 案例三
let sets = new Set([1, 2, 3, 1, 4, 5]); // 注意：Set集合中不会有重复值，因此，这里最终为 Set(5){1,2,3,4,5}
let arr = Array.from(sets);
console.log(arr); // [1,2,3,4,5];
```

#### Array.of

Array.of 方法用于将一组值，转换为数组。

> 语法:Array.of(arg1,arg2,arg3);
>
> > arg1,arg2,arg3 : 可选参数,表示需要转换的值
>
> 注意:
>
> > 当没有传递参数时，该方法返回值为一个空数组。
> > 当传入一个 undefined 参数时，该方法返回一个元素为 undefined 的数组 --[undefined]
> > 当传入一个参数时，该方法返回一个元素为传入值的元素 --[传入值]
> > 当传入多个参数时，该方法返回一个元素为传入参数的数组

```js
案例：
Array.of(); // []
Array.of(undefined); //[undefined]
Array.of('Hello'); // ['Hello']
Array.of('Hello',true,12) ; // ['Hello',true,12]
```

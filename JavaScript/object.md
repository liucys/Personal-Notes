#### hasOwnProperty

该方法用于判断指定属性是否是指定对象的自定义属性,而不是原型链上的属性.该方法返回一个布尔值,是对象的自定义属性时,返回 true,若不是对象的自定义属性或不存在时,返回 false.

```js
function Person() {
  this.name = "Liucy";
  this.age = 18;
}
Person.prototype.address = "江苏南京";
const person = new Person();
console.log(person.hasOwnProperty("name")); // true
console.log(person.hasOwnProperty("age")); // true
console.log(person.hasOwnProperty("address")); // false
```

#### in

in 操作符的作用与 hasOwnProperty 的作用相同,用于判断某个指定属性是否存在于指定对象中.
不同点在于,in 操作符的判断深入到原型链中进行寻找判断.

```js
function Person() {
  this.name = "XiaoMing";
  this.age = 18;
}

Person.prototype.address = "江苏南京";
const person = new Person();
console.log("name" in person); // true
console.log("address" in person); // true
```

#### Object.defineProperty()

Object.defineProperty()的作用就是直接在一个对象上定义一个新的属性,或者修改一个已经存在的属性,并返回这个对象.

> Object.defineProperty( obj, prop, descriptObj );
>
> > obj： 需要被定义(或修改)属性的指定对象
> >
> > prop：需要被定义(或修改)的属性名
> >
> > descriptObj：是一个对象,定义(或修改)的属性 prop 的描述
> >
> > > descriptObj：{
> > >
> > > ​ configurable：boolean 值,当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
> > >
> > > ​ enumerable：boolean 值,当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中.默认为 false.
> > >
> > > ​ value：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）.默认值为 undefined.
> > >
> > > ​ writable：boolean 值,当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被赋值运算符改变.默认值为 false.
> > >
> > > ​ get：属性的 getter 函数，如果没有 getter，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值.默认值为 undefined.
> > >
> > > ​ set：属性的 setter 函数，如果没有 setter，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。默认值为 undefined.
> > >
> > > }
>
> 注意: 默认情况下，使用`Object.defineProperty()`增加的属性值是不可改变的.

```js
const person = {
  name: "XiaoMing",
  age: 18,
};

// 添加新属性
Object.defineProperty(person, "address", {
  value: "江苏南京", // 属性值.
  configurable: true, // 是否允许通过person属性调用改变address属性值.
  enumerable: true, // 是否允许该address属性出现在对象的的枚举属性中.
  writeable: true, // 是否允许value属性值被赋值运算符改变.
});
// 修改原有属性
Object.defineProperty(person, "age", {
  value: 20,
});
```

#### Object.is(value1,value2)

Object.is(value1,value2)方法用于比对两个对象是否相等(比对数组和对象时,一律返回 false)

```js
Object.is(12, 12); // true
Object.is("hah", "hah"); // true
```

#### Object.assign(target,source1,source2,...,source?)

Object.assign()方法用于进行对象的浅拷贝(复制),返回原对象.

> 浅拷贝：只会复制第一层的属性内容,若是一个对象中,存在属性对象,则使用 Object.assign 将失去意义.
>
> 例如：const person={
>
> ​ name:'XiaoMing',
>
> ​ age:18,
>
> ​ address:{
>
> ​ city:'江苏'
>
> ​ details:'江苏省苏州',
>
> ​ }
>
> }
>
> const student={};
>
> Object.assign(student,person); // 将 person 对象中的属性拷贝到 student 对象中.
>
> 注意：因为使用的是 Object.assign()方法,该方法只能进行浅拷贝,因此,拷贝后的 student 对象的 address 属性与 person 对象的 address 属性是使用的同一个引用地址,这将使得若是通过 student 对象修改 address 属性值,那么,person 对象的 address 属性值也将被同步修改(这就是浅拷贝的缺点).

```js
Object.assign({ age: 12 }, { name: "Hello" }); // { age:12, name:'Hello' }
```

#### Object.keys(obj)

Object.keys()方法返回一个包含指定对象的所以键的数组

```js
const person = {
  name: "XiaoMing",
  age: 18,
  address: "地球",
};
const pKeys = Object.keys(person);
console.log(pKeys); // ['name','age','address']
```

- Object.values(obj)

Object.values()方法返回一个包含指定对象所有属性值的数组

```js
const person = {
  name: "XiaoMing",
  age: 18,
  address: "地球",
};
const pValues = Object.values(person);
console.log(pValues); // ['XiaoMing',18,'地球']
```

#### Object.entries(obj)

Object.entries()方法返回一个包含指定对象所有键值对[key,value]的数组(二维数组)

```js
const person = {
  name: "XiaoMing",
  age: 20,
  address: "地球",
};

const pKandV = Object.entries(person);
console.log(pKandV); // [ ["name",'XiaoMing'], ["age",20], ["address","地球"]]
```

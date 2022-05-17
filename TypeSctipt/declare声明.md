`declare` 可以向 TypeScript 域中引入一个变量，在编写代码时能够实现智能提示的功能。这种方式通常实现在 `*.d.ts`文件中，然后引入。

```ts
// 例如项目依赖包中，源文件的编写 如 solid-js npm包中的 signal.d.ts文件;

export declare const equalFn: <T>(a: T, b: T) => boolean;
export declare var Owner: Owner | null;
export declare var Listener: Computation<any> | null;
export declare function createRoot<T>(
  fn: (dispose: () => void) => T,
  detachedOwner?: Owner
): T;
export declare function createSignal<T>(): [
  () => T | undefined,
  <U extends T | undefined>(v?: U) => U
];
export declare function createSignal<T>(
  value: T,
  areEqual?: boolean | ((prev: T, next: T) => boolean),
  options?: {
    name?: string;
    internal?: boolean;
  }
): [() => T, (v: T) => T];
export declare function createComputed<T>(fn: (v: T) => T, value: T): void;
export declare function createComputed<T>(fn: (v?: T) => T | undefined): void;
```

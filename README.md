# typed-icu-message

transform icu language message json to typescript type definition

[![NPM version](https://badge.fury.io/js/typed-icu-message.png)](http://badge.fury.io/js/typed-icu-message)
[![NPM downloads](http://img.shields.io/npm/dm/typed-icu-message.svg)](https://npmjs.org/package/typed-icu-message)

## demo
![1](./demo/1.png)
![2](./demo/2.png)
![3](./demo/3.png)
![4](./demo/4.png)

## usage

```shell
npm install typed-icu-message
```

```typescript
import { getTsTypesFromRes } from 'typed-icu-message';

const code = getTsTypesFromRes({
    'a': 'a {b} {c}',
    'c': 'd {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
});
```

generated code:
```typescript
export interface I18nRes {
  a: {
    returnType: "a {b} {c}";

    variableType: {
      'b': any;
      'c': any;
    };
  }
  c: {
    returnType: "d {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";

    variableType: {
      'num': any;
      'num2': any;
    };
  }
}

export type I18nResKeys = keyof I18nRes;

export type I18nTranslate = <T extends I18nResKeys>(
  p: T,
  params: I18nRes[T]['variableType'],
  defaultMessage?: string,
) => I18nRes[T]['returnType'];
```

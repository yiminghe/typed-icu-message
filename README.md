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
    zh: {
        'a': '一 {b} {c}',
        'b': 'b',
        'c': '二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}',
        'd': '<s>d {d}</s>',
    },
    en: {
        'a': 'one {b} {c} {d}',
        'b': 'bb',
        'c': 'two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}',
        'd': '<ss>d {dd}</ss>',
    }
});
```

generated code:
```typescript
import React from 'react';
    

/* eslint-disable */
export interface I18nRes {

"a": { 
    returnType: "一 {b} {c}" | "one {b} {c} {d}";
     
    valuesType: {
      "b": any;
"c": any;
"d": any;

      

    };
    };
"b": { 
    returnType: "b" | "bb";
     
    valuesType: {
      

      

    };
    };
"c": { 
    returnType: "二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}" | "two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";
     
    valuesType: {
      "num": number;
"num2": any;

      

    };
    };
"d": { 
    returnType: "<s>d {d}</s>" | "<ss>d {dd}</ss>";
     
    valuesType: {
      "d": any;
"dd": any;

      "s": (chunks:React.ReactNode) => React.ReactNode;
"ss": (chunks:React.ReactNode) => React.ReactNode;

    };
    };
}

export type I18nResKeys = keyof I18nRes;


export type I18nTranslate = <T extends I18nResKeys>(
      key: T,
      values: I18nRes[T]['valuesType']
) => I18nRes[T]['returnType'];

```

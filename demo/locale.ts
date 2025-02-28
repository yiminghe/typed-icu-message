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
     
    valuesType: undefined;
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
    ...values: T extends I18nResKeys ? ( I18nRes[T]['valuesType'] extends undefined ? [] : [ I18nRes[T]['valuesType'] ] ):[]
) => I18nRes[T]['returnType'];

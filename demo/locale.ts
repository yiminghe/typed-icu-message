import React from 'react';
    

/* eslint-disable */
export interface I18nMessages {

"a": { 
    t: "一 {b} {c}" | "one {b} {c} {d}";
     
    v: {
      "b": any;
"c": any;
"d": any;

      

    };
    };
"b": { 
    t: "b" | "bb";
     
    v: undefined;
    };
"c": { 
    t: "二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}" | "two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";
     
    v: {
      "num": number;
"num2": any;

      

    };
    };
"d": { 
    t: "<s>d {d}</s>" | "<ss>d {dd}</ss>";
     
    v: {
      "d": any;
"dd": any;

      "s": (chunks:React.ReactNode) => React.ReactNode;
"ss": (chunks:React.ReactNode) => React.ReactNode;

    };
    };
}

export type I18nMessageKeys = keyof I18nMessages;


export type I18nTranslate = <T extends I18nMessageKeys>(
    key: T,
    ...values: T extends I18nMessageKeys ? ( I18nMessages[T]['v'] extends undefined ? [] : [ I18nMessages[T]['v'] ] ):[]
) => I18nMessages[T]['t'];

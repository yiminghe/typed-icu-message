import React from 'react';
    import { Trans } from 'react-i18next';
    

/* eslint-disable */
export interface I18nRes {

"a": { 
    returnType: "一 {b} {c}" | "one {b} {c} {d}";
     
    valuesType: {
      "b": any;
"c": any;
"d": any;
    };
     
    componentsType: {
   
    }
     };
"b": { 
    returnType: "b" | "bb";
     
    valuesType: {
      
    };
     
    componentsType: {
   
    }
     };
"c": { 
    returnType: "二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}" | "two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";
     
    valuesType: {
      "num": number;
"num2": any;
    };
     
    componentsType: {
   
    }
     };
"d": { 
    returnType: "<s>d {d}</s>" | "<ss>d {dd}</ss>";
     
    valuesType: {
      "d": any;
"dd": any;
    };
     
    componentsType: {
   "s": React.ReactNode;
"ss": React.ReactNode;
    }
     };
}

export type I18nResKeys = keyof I18nRes;
export type I18nNsType = string;


export type I18nTranslate = <T extends I18nResKeys>(
  ...args:
    | [key: T,
      options: I18nRes[T]['valuesType'] & {
        ns?: I18nNsType|I18nNsType[];
        defaultValue?: string;
      } ]
    | [key: T,
      defaultValue: string,
      options: I18nRes[T]['valuesType'] & {ns?: I18nNsType|I18nNsType[];} ]
) => I18nRes[T]['returnType'];


      export function getI18nComponent(i18n:any){
        return <T extends I18nResKeys>(
          key:T,
          values:I18nRes[T]['valuesType'],
          components:I18nRes[T]['componentsType'],
          defaultValue?:string,
        ):I18nRes[T]['returnType'] => {
        return React.createElement(Trans, {i18nKey:key,values,components,t:i18n.t,i18n} as any) as any;
    };
      }
      
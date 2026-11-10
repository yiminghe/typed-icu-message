
import { getTsTypesFromRes } from "../src";

describe('getTsTypesFromRes', () => {
    it('works', () => {
        const code = getTsTypesFromRes({
          zh:{
            'a': '一 {b} {c}',
            'b':'b',
            'r': '<s>d {d}</s>',
            'c': '二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
          },
          en:{
            'a': 'one {b} {c} {d}',
            'r': '<s>d2 {d} {d2}</s>',
            'b':'z',
            'c': 'two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
          }
        });
        expect(code).toMatchInlineSnapshot(`
"import React from 'react';
    

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
    t: "b" | "z";
     
    v: undefined;
    };
"r": { 
    t: "<s>d {d}</s>" | "<s>d2 {d} {d2}</s>";
     
    v: {
      "d": any;
"d2": any;

      "s": (chunks:React.ReactNode) => React.ReactNode;

    };
    };
"c": { 
    t: "二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}" | "two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";
     
    v: {
      "num": number;
"num2": any;

      

    };
    };
}

export type I18nMessageKeys = keyof I18nMessages;


type isAny<T> = 0 extends (1 & T) ? true : false;
type isUndefined<T> = [T] extends [undefined] ? true : false;

export type I18nTranslate = <T extends I18nMessageKeys>(
    key: T,
    ...values: isAny<I18nMessages[T]['v']> extends true ? any[] : (isUndefined<I18nMessages[T]['v']> extends true ? [] : [I18nMessages[T]['v']])
) => I18nMessages[T]['t'];
"
`);
    });
});
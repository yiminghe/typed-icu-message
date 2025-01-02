
import { getTsTypesFromRes } from "../src";

describe('getTsTypesFromRes', () => {
    it('works', () => {
        const code = getTsTypesFromRes({
          zh:{
            'a': '一 {b} {c}',
            'c': '二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
          },
          en:{
            'a': 'one {b} {c}',
            'c': 'two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
          }
        });
        expect(code).toMatchInlineSnapshot(`
"
/* eslint-disable */
export interface I18nRes {

  "a": { 
    returnType:"一 {b} {c}"|"one {b} {c}";
     
    variableType:{
      "b":any;
"c":any;
    };
     }
  "c": { 
    returnType:"二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}"|"two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}";
     
    variableType:{
      "num":number;
"num2":any;
    };
     }
}

export type I18nResKeys = keyof I18nRes;
export type I18nNsType = string;


export type I18nTranslate = <T extends I18nResKeys>(
  ...args:
    | [p: T,
      options?: I18nRes[T]['variableType'] & {
        ns?: I18nNsType|I18nNsType[];
        defaultValue?: string;
      } ]
    | [p: T,
      defaultValue: string,
      options?: I18nRes[T]['variableType'] & {ns?: I18nNsType|I18nNsType[];} ]
) => I18nRes[T]['returnType'];
"
`);
    });
});
import { getTsTypesFromRes } from "../src";
import React from 'react';
import fs from 'fs';
import path from 'path';
import { getI18nComponent, type I18nTranslate } from "./locale";

const code = getTsTypesFromRes({
    zh: {
        'a': '一 {b} {c}',
        'b':'b',
        'c': '二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}',
        'd':'<s>d {d}</s>',
    },
    en: {
        'a': 'one {b} {c} {d}',
        'b':'bb',
        'c': 'two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}',
        'd':'<ss>d {dd}</ss>',
    }
});

fs.writeFileSync(path.join(__dirname, 'locale.ts'), code);



const t: I18nTranslate = () => ({}) as any;

const T=getI18nComponent({});

const tt=<T i18nKey="d" components={{s:null,ss:null}} values={{d:1,dd:2}}/>;

t('b',{});

t('c', { num: 1, num2: 2 });

t('a', '', { b: 1, c: 2, d: 3 });

t('c', { num: 1, num2: 2, ns: '1', defaultValue: '2' });
import { getTsTypesFromRes } from "../src";
import fs from 'fs';
import path from 'path';
import { type I18nTranslate } from "./locale";
import { createIntl } from '@formatjs/intl';
import React from 'react';

const messages = {
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
};

const code = getTsTypesFromRes(messages);

fs.writeFileSync(path.join(__dirname, 'locale.ts'), code);

const intl = createIntl({
    locale: 'en',
    messages: messages.en
});

const t: I18nTranslate = ((id:any, values:any) => intl.formatMessage({ id }, values)) as any;

const rich=t("d", { d: 1, dd: 2, s: (chunks) => React.createElement('div',{},chunks,'1'), ss: (chunks) => React.createElement('span',{},chunks,'3') })

console.log(JSON.stringify(rich,null,2));

console.log(t('b', {}));

console.log(t('c', { num: 1, num2: 2 }));

console.log(t('a', { b: 1, c: 2, d: 3 }));

console.log(t('c', { num: 1, num2: 2 }));
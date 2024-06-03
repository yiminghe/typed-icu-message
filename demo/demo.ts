import { getTsTypesFromRes } from "../src";

import fs from 'fs';
import path from 'path';
import type { I18nTranslate } from "./locale";

const code = getTsTypesFromRes({
    zh: {
        'a': '一 {b} {c}',
        'c': '二 {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
    },
    en: {
        'a': 'one {b} {c}',
        'c': 'two {num, plural, =0 {{num2}} =1 {{num2}} other {{num2}}}'
    }
});

fs.writeFileSync(path.join(__dirname, 'locale.ts'), code);



const t: I18nTranslate = () => ({}) as any;

t('c', { num: 1, num2: 2 });

t('a', '', { b: 1, c: 2, });

t('c', { num: 1, num2: 2, ns: '1', defaultValue: '2' });
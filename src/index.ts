import {
    parse,
    MessageFormatElement,
    isDateElement,
    isTimeElement,
    isNumberElement,
    isSelectElement,
    isPluralElement,
    isTagElement,
    isArgumentElement
} from '@formatjs/icu-messageformat-parser';

function collectVariables2(ast: MessageFormatElement[], ret: Set<string>) {
    for (const a of ast) {
        if (isArgumentElement(a) || isDateElement(a) || isNumberElement(a)
            || isPluralElement(a) || isSelectElement(a) || isTimeElement(a)
        ) {
            ret.add(a.value);
        }

        if (isTagElement(a)) {
            collectVariables2(a.children, ret);
        }

        if (isPluralElement(a) || isSelectElement(a)) {
            Object.values(a.options).forEach(o => {
                collectVariables2(o.value, ret);
            })
        }
    }
}
function collectVariables(str: string, ret: Set<string> = new Set()) {
    const ast = parse(str);
    collectVariables2(ast, ret);
    return ret;
}


export function getTsTypesFromRes(res: Record<string, string>) {
    const code = [
        `
/* eslint-disable */
export interface I18nRes {
`,
    ];
    Object.entries(res).forEach(([key, value]) => {
        const vs = Array.from(collectVariables(value));

        const variableType = `
    variableType:{
      ${vs.map(v => {
            return `${JSON.stringify(v)}:any;`
        }).join('\n')}
    };
    `;

        const returnType = `
    returnType:${JSON.stringify(value)};
    `;

        code.push(`  ${JSON.stringify(key)}: { ${returnType} ${variableType} }`
        );
    });
    code.push("}");

    code.push(`
export type I18nResKeys = keyof I18nRes;

export type I18nTranslate = <T extends I18nResKeys>(
  p: T,
  params: I18nRes[T]['variableType'],
  defaultMessage?: string,
) => I18nRes[T]['returnType'];
`);

return code.join('\n');
}
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

function collectVariables2(ast: MessageFormatElement[], ret: Map<string, string>) {
  for (const a of ast) {
    if (isPluralElement(a) || isNumberElement(a)) {
      ret.set(a.value, 'number');
    }
    else if (isArgumentElement(a) || isDateElement(a)
      || isSelectElement(a) || isTimeElement(a)
    ) {

      ret.set(a.value, 'any');
    }
    else if (isTagElement(a)) {
      collectVariables2(a.children, ret);
    }

    if (isPluralElement(a) || isSelectElement(a)) {
      Object.values(a.options).forEach(o => {
        collectVariables2(o.value, ret);
      })
    }
  }
}
function collectVariables(str: string, ret: Map<string, string> = new Map()) {
  const ast = parse(str);
  collectVariables2(ast, ret);
  return ret;
}

export type lang = string;
export function getTsTypesFromRes(res2: Record<lang, Record<string, string>>, { keyAsMethod }: { keyAsMethod?: boolean } = {}) {

  const res: Record<string, string[]> = {};

  Object.entries(res2).forEach(([lan, res3]) => {
    Object.entries(res3).forEach(([key, v]) => {
      res[key] = res[key] || [];
      res[key].push(v);
    });
  });

  const code = [
    `
/* eslint-disable */
export interface I18nRes {
`,
  ];
  Object.entries(res).forEach(([key, value]) => {
    const vs = Array.from(collectVariables(value[0]).entries());

    const variableType = `
    variableType:{
      ${vs.map(([key, v]) => {
      return `${JSON.stringify(key)}:${v};`
    }).join('\n')}
    };
    `;

    const returnType = `
    returnType:${value.map(v => JSON.stringify(v)).join('|')};
    `;

    code.push(`  ${JSON.stringify(key)}: { ${returnType} ${variableType} }`
    );
  });
  code.push("}");

  code.push(`
export type I18nResKeys = keyof I18nRes;
`);

  if (keyAsMethod) {
    code.push(`
    export type I18nTranslate = {
      [T in I18nResKeys]: (
          params: I18nRes[T]['variableType'],
          defaultMessage?: string
      ) => I18nRes[T]['returnType'];
    };
    `)
  } else {
    code.push(`
export type I18nTranslate = <T extends I18nResKeys>(
  p: T,
  params: I18nRes[T]['variableType'],
  defaultMessage?: string,
) => I18nRes[T]['returnType'];
`)
  }
  return code.join('\n');
}
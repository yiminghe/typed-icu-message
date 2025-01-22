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

function setType(key: string, value: string, store: Map<string, string>) {
  const exist = store.get(key);
  if (exist && exist !== value) {
    value = 'any';
  }
  store.set(key, value);
}

function collectVariables2(ast: MessageFormatElement[], ret: Map<string, string>) {
  for (const a of ast) {
    if (isPluralElement(a) || isNumberElement(a)) {
      setType(a.value, 'number', ret);
    }
    else if (isArgumentElement(a) || isDateElement(a)
      || isSelectElement(a) || isTimeElement(a)
    ) {
      setType(a.value, 'any', ret);
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
  try {
    const ast = parse(str);
    collectVariables2(ast, ret);
  } catch (e: any) {
    e.message = 'parse icu error: ' + str + '\n' + e.message;
    throw e;
  }
  return ret;
}

export type lang = string;
export function getTsTypesFromRes(res2: Record<lang, Record<string, string>>, { ns }: {
  ns?: string | string[];
} = {}) {

  let nsType;

  if (!ns) {
    ns = 'string';
  }

  if (!Array.isArray(ns)) {
    ns = [ns];
  }

  nsType = ns.join(' | ');

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
    const vMap = new Map<string, string>();

    for (const v of value) {
      const vs = Array.from(collectVariables(v).entries());
      for (let [k, v] of vs) {
        setType(k, v, vMap);
      }
    }

    const vs = Array.from(collectVariables(value[0]).entries());

    const variableType = `
    variableType: {
      ${Array.from(vMap.entries()).map(([key, v]) => {
      return `${JSON.stringify(key)}: ${v};`
    }).join('\n')}
    };
    `;

    const returnType = `
    returnType: ${value.map(v => JSON.stringify(v)).join(' | ')};
    `;

    code.push(`${JSON.stringify(key)}: { ${returnType} ${variableType} };`
    );
  });
  code.push("}");

  code.push(`
export type I18nResKeys = keyof I18nRes;
export type I18nNsType = ${nsType};
`);


  code.push(`
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
`);

  return code.join('\n');
}
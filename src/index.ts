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

function collectTypesInternal(ast: MessageFormatElement[],
  valuesTypes: Map<string, string>,
  components: Set<string>) {
  for (const a of ast) {
    if (isPluralElement(a) || isNumberElement(a)) {
      setType(a.value, 'number', valuesTypes);
    }
    else if (isArgumentElement(a) || isDateElement(a)
      || isSelectElement(a) || isTimeElement(a)
    ) {
      setType(a.value, 'any', valuesTypes);
    }
    else if (isTagElement(a)) {
      components.add(a.value);
      collectTypesInternal(a.children, valuesTypes, components);
    }

    if (isPluralElement(a) || isSelectElement(a)) {
      Object.values(a.options).forEach(o => {
        collectTypesInternal(o.value, valuesTypes, components);
      })
    }
  }
}
function collectTypes(str: string,
  valuesTypes: Map<string, string> = new Map(),
  components: Set<string> = new Set()
) {
  try {
    const ast = parse(str);
    collectTypesInternal(ast, valuesTypes, components);
  } catch (e: any) {
    e.message = 'parse icu error: ' + str + '\n' + e.message;
    throw e;
  }
  return { valuesTypes, components };
}

export type lang = string;
export function getTsTypesFromRes(
  res2: Record<lang, Record<string, string>>, {
    ns,
    reactI18next = 'react-i18next',
  }: {
    ns?: string | string[];
    reactI18next?: string
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

  let react = false;

  const code = [
    `
/* eslint-disable */
export interface I18nRes {
`,
  ];
  Object.entries(res).forEach(([key, value]) => {
    const vMap = new Map<string, string>();
    let allComponents = new Set<string>();

    for (const v of value) {
      const { valuesTypes, components } = collectTypes(v);
      allComponents = new Set([...allComponents, ...components]);
      const vs = Array.from(valuesTypes.entries());
      for (let [k, v] of vs) {
        setType(k, v, vMap);
      }
    }

    react = react || allComponents.size > 0;

    const componentsType = `
    componentsType: {
   ${Array.from(allComponents.values()).map((key) => {
      return `${JSON.stringify(key)}: React.ReactNode;`
    }).join('\n')}
    }
    `;

    const valuesType = `
    valuesType: {
      ${Array.from(vMap.entries()).map(([key, v]) => {
      return `${JSON.stringify(key)}: ${v};`
    }).join('\n')}
    };
    `;

    const returnType = `
    returnType: ${value.map(v => JSON.stringify(v)).join(' | ')};
    `;

    code.push(`${JSON.stringify(key)}: { ${returnType} ${valuesType} ${componentsType} };`
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
      options: I18nRes[T]['valuesType'] & {
        ns?: I18nNsType|I18nNsType[];
        defaultValue?: string;
      } ]
    | [p: T,
      defaultValue: string,
      options: I18nRes[T]['valuesType'] & {ns?: I18nNsType|I18nNsType[];} ]
) => I18nRes[T]['returnType'];
`);

  if (react) {
    code.unshift(`import React from 'react';
    import { Trans } from '${reactI18next}';
    `);
    code.push(`
      export function getI18nComponent(i18n:any){
        return <T extends I18nResKeys>({i18nKey,values,components}:{
          i18nKey:T;
          defaultValue?:string;
          values:I18nRes[T]['valuesType'];
          components:I18nRes[T]['componentsType'];
        }):I18nRes[T]['returnType'] => {
        return React.createElement(Trans, {i18nKey,values,components,t:i18n.t,i18n} as any) as any;
    };
      }
      `);
  }

  return code.join('\n');
}
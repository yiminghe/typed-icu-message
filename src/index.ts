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
  res2: Record<lang, Record<string, string>>
) {
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

    const vEntries = Array.from(vMap.entries());
    const componentsValues = Array.from(allComponents.values());
    let valuesType = '';


    if (vEntries.length > 0 || componentsValues.length > 0) {
      valuesType = `
    valuesType: {
      ${Array.from(vMap.entries()).map(([key, v]) => {
        return `${JSON.stringify(key)}: ${v};`
      }).join('\n')}

      ${Array.from(allComponents.values()).map((key) => {
        return `${JSON.stringify(key)}: (chunks:React.ReactNode) => React.ReactNode;`
      }).join('\n')}

    };
    `;
    } else {
      valuesType = `
    valuesType: undefined;
    `;
    }

    const returnType = `
    returnType: ${value.map(v => JSON.stringify(v)).join(' | ')};
    `;

    code.push(`${JSON.stringify(key)}: { ${returnType} ${valuesType}};`
    );
  });
  code.push("}");

  code.push(`
export type I18nResKeys = keyof I18nRes;
`);


  code.push(`
export type I18nTranslate = <T extends I18nResKeys>(
    key: T,
    ...values: T extends I18nResKeys ? ( I18nRes[T]['valuesType'] extends undefined ? [] : [ I18nRes[T]['valuesType'] ] ):[]
) => I18nRes[T]['returnType'];
`);

  if (react) {
    code.unshift(`import React from 'react';
    `);
  }

  return code.join('\n');
}
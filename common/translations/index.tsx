import React from 'react';
import { ConfigState } from 'features/config/types';
import { loadStatePropertyOrEmptyObject } from 'utils/localStorage';
import TranslateMarkdown from 'components/Translate';
import en from './lang/en.json';
import de from './lang/de.json';
import el from './lang/el.json';
import es from './lang/es.json';
import fi from './lang/fi.json';
import fr from './lang/fr.json';
import ht from './lang/ht.json';
import hu from './lang/hu.json';
import id from './lang/id.json';
import it from './lang/it.json';
import ja from './lang/ja.json';
import nl from './lang/nl.json';
import no from './lang/no.json';
import pl from './lang/pl.json';
import pt from './lang/pt.json';
import ru from './lang/ru.json';
import ko from './lang/ko.json';
import tr from './lang/tr.json';
import vi from './lang/vi.json';
import zhcn from './lang/zhcn.json';
import zhtw from './lang/zhtw.json';

const fallbackLanguage = 'en';
const repository: {
  [language: string]: {
    [translationName: string]: string;
  };
} = {};

interface ILanguage {
  code: string;
  data: {
    [translationName: string]: string;
  };
}

const languages: ILanguage[] = [
  en,
  de,
  el,
  es,
  fi,
  fr,
  ht,
  hu,
  id,
  it,
  ja,
  nl,
  no,
  pl,
  pt,
  ru /*sk, sl, sv */,
  ko,
  tr,
  vi,
  zhcn,
  zhtw
];

languages.forEach(l => {
  repository[l.code] = l.data;
});

export function getTranslators() {
  return [
    'TranslatorName_1',
    'TranslatorName_2',
    'TranslatorName_3',
    'TranslatorName_4',
    'TranslatorName_5'
  ].filter(x => {
    const translated = translateRaw(x);
    return !!translated;
  });
}

export type TranslatedText = React.ReactElement<any> | string;

export function translateRaw(key: string, variables?: { [name: string]: string }): string {
  // redux store isn't initialized in time which throws errors, instead we get the language selection from localstorage
  const lsConfig = loadStatePropertyOrEmptyObject('config');
  const language = !!lsConfig ? (lsConfig as ConfigState).meta.languageSelection : fallbackLanguage;
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  /** @desc In RegExp, $foo is two "words", but __foo is only one "word."
   *  Replace all occurences of '$' with '__' in the entire string and each variable,
   *  then iterate over each variable, replacing the '__variable' in the
   *  translation key with the variable's value.
   */
  if (variables) {
    let str = translatedString.replace(/\$/g, '__');

    Object.keys(variables).forEach(variable => {
      const singleWordVariable = variable.replace(/\$/g, '__');
      const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

      str = str.replace(re, variables[variable]);
    });

    return str;
  }

  return translatedString;
}

export function translate(
  key: string,
  variables?: { [name: string]: string }
): React.ReactElement<any> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;

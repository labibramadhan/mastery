import path from 'path';
import fs from 'fs';
import Polyglot from 'node-polyglot';

// define where the locales directory is
const localesPath = path.resolve(path.join(__dirname, '..', 'locales'));

export default async (locale = 'en') => {
  const i18n = new Polyglot({ locale });
  const JSONPath = path.resolve(path.join(localesPath, 'en.json'));

  if (!fs.existsSync(JSONPath)) {
    // throw an error if requested locale not found
    throw new Error(`Translation ${locale} not available!`);
  }

  // embed current json translation to a Polyglot instance
  i18n.extend(require(JSONPath)); // eslint-disable-line
  return i18n;
};

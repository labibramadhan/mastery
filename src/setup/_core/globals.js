import path from 'path';

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const { requireF } = require(path.resolve(path.join(rootPath, 'services/_core/CommonServices')));
global.requireF = requireF;

const ConfigBoot = requireF('services/_core/boot/ConfigBoot');
const configBoot = new ConfigBoot();
global.conf = configBoot.boot();

const I18nBoot = requireF('services/_core/boot/I18nBoot');
const i18nBoot = new I18nBoot();
global.i18n = i18nBoot.boot();

global.isTest = /test/g.test(process.env.NODE_ENV);

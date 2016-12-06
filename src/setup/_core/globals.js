import path from 'path';

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const { requireF } = require(path.resolve(path.join(rootPath, 'services/_core/CommonServices')));
global.requireF = requireF;

const ConfigBoot = requireF('services/_core/boot/ConfigBoot');
const configBoot = new ConfigBoot();
global.conf = configBoot.boot();

const I18nWrapper = requireF('services/_core/I18nWrapper');
global.i18n = new I18nWrapper();

global.pkg = require(path.resolve(path.join(rootPath, '..', 'package.json')));

global.isTest = /test/g.test(process.env.NODE_ENV);

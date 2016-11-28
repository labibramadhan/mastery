import nconf from 'nconf';
import path from 'path';

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const { requireF } = require(path.resolve(path.join(rootPath, 'services/_core/commonServices')));
global.requireF = requireF;

const BootConfigs = requireF('services/_core/boot/BootConfigs');
const bootConfigs = new BootConfigs(nconf);
bootConfigs.boot();
global.conf = nconf;

const BootI18n = requireF('services/_core/boot/BootI18n');
const bootI18n = new BootI18n();
bootI18n.boot();
global.i18n = bootI18n.boot();

global.isTest = /test/g.test(process.env.NODE_ENV);

import path from 'path';
import nconf from 'nconf';

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const { requireF } = require(path.resolve(path.join(rootPath, 'services/_core/commonServices')));
global.requireF = requireF;

const { bootConfigs } = requireF('services/_core/commonServices');
bootConfigs(nconf);
global.conf = nconf;

global.isTest = /testing/g.test(process.env.NODE_ENV);

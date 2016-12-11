import EventEmitter from 'promise-events';
import nconf from 'nconf';
import path from 'path';

global.isTest = /test/g.test(process.env.NODE_ENV);

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const {
  requireF,
} = require(path.join(rootPath, 'core/services/CommonServices'));
global.requireF = requireF;

const I18nWrapper = requireF('core/services/I18nWrapper');
global.i18n = new I18nWrapper();

global.conf = nconf;

global.eventEmitter = new EventEmitter();

global.pkg = require(path.resolve(path.join(rootPath, '..', 'package.json')));

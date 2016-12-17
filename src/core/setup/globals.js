import EventEmitter from 'promise-events';
import Nconf from 'nconf';
import Path from 'path';
import _ from 'lodash';

global.isMaster = !_.toNumber(process.env.pm_id);

global.isTest = /test/g.test(process.env.NODE_ENV);

// define rootPath first, needed for requireF
global.rootPath = Path.resolve(Path.join(__dirname, '..', '..'));

const {
  requireF,
} = require(Path.join(rootPath, 'core/services/CommonServices'));
global.requireF = requireF;

const I18nWrapper = requireF('core/services/I18nWrapper');
global.i18n = new I18nWrapper();

global.conf = Nconf;

global.eventEmitter = new EventEmitter();

global.pkg = require(Path.resolve(Path.join(rootPath, '..', 'package.json')));

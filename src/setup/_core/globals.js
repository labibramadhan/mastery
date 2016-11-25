import path from 'path';
import nconf from 'nconf';

// define rootPath first, needed for requireF
global.rootPath = path.resolve(path.join(__dirname, '..', '..'));

const { requireF } = require('../../services/_core/commonServices');

global.requireF = requireF;

nconf.file(path.resolve(path.join(rootPath, 'config/development.json')));
global.conf = nconf;

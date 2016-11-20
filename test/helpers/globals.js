import path from 'path';

global.rootTest = path.resolve(path.join('..'));

global.testRequire = file => require(path.join(rootPath, file));

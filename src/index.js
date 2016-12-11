import path from 'path';

process.setMaxListeners(0);

require('./core/setup/globals');

const {
  requireAll,
} = requireF('core/services/CommonServices');

requireAll(path.join(rootPath, 'core/services/definitions/**/*.js'));

eventEmitter.emit('Startup');

const BootServer = requireF('core/services/BootServer');
const bootServer = new BootServer();
bootServer.boot();

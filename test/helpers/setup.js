import path from 'path';

process.setMaxListeners(0);

require('../../src/core/setup/globals');

const {
  requireAll,
} = requireF('core/services/CommonServices');

requireAll(path.join(rootPath, 'core/services/definitions/**/*.js'));

eventEmitter.emit('Startup');

export default async () => {
  const BootServer = requireF('core/services/BootServer');
  const bootServer = new BootServer();
  await bootServer.boot();
};

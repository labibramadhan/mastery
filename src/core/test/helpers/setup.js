import Path from 'path';

process.setMaxListeners(0);

require('../../setup/globals');

const {
  requireAll,
} = requireF('core/services/CommonServices');

requireAll(Path.join(rootPath, 'core/services/definitions/**/*.js'));

eventEmitter.emit('Startup');

export default async () => {
  const BootServer = requireF('core/services/BootServer');
  const bootServer = new BootServer();
  await bootServer.boot();
};

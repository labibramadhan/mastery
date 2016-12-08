process.setMaxListeners(0);

require('./core/setup/globals');

const run = async () => {
  // boot the server
  const ServerBoot = requireF('core/services/boot/ServerBoot');
  const serverBoot = new ServerBoot();
  await serverBoot.boot();
};

run();

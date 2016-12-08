process.setMaxListeners(0);

require('../../src/core/setup/globals');

export default async () => {
  const ServerBoot = requireF('core/services/boot/ServerBoot');
  const serverBoot = new ServerBoot();
  await serverBoot.boot();
};

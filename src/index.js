process.setMaxListeners(0);

require('./core/setup/globals');

const ServerBoot = requireF('core/services/boot/ServerBoot');
const serverBoot = new ServerBoot();
serverBoot.boot();

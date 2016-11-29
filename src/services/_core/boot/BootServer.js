export default class BootServer {
  boot = async () => {
    // boot databases and models defined in config/env/*.json
    const BootDatabases = requireF('services/_core/boot/BootDatabases');
    const bootDatabases = new BootDatabases();
    await bootDatabases.boot();

    // boot local plugins from /plugins/**/*.js
    const BootPlugins = requireF('services/_core/boot/BootPlugins');
    const bootPlugins = new BootPlugins();
    await bootPlugins.boot();

    // boot all boot script from /setup/boot/**/*Before.js
    const BootScripts = requireF('services/_core/boot/BootScripts');
    const bootScripts = new BootScripts();
    await bootScripts.boot('Before');

    const BootAutoRoutes = requireF('services/_core/boot/BootAutoRoutes');
    const bootAutoRoutes = new BootAutoRoutes();
    await bootAutoRoutes.boot();

    // boot all routes from /component/**/*Routes.js
    const BootRoutes = requireF('services/_core/boot/BootRoutes');
    const bootRoutes = new BootRoutes();
    await bootRoutes.boot();

    // boot all boot scripts from /setup/boot/**/*After.js
    await bootScripts.boot('After');
  }
}

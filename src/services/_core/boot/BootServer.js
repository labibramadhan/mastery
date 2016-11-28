const BootDatabases = requireF('services/_core/boot/BootDatabases');
const BootPlugins = requireF('services/_core/boot/BootPlugins');
const BootRoutes = requireF('services/_core/boot/BootRoutes');
const BootScripts = requireF('services/_core/boot/BootScripts');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default class BootServer {
  constructor() {
    this.bootDatabases = new BootDatabases();
    this.bootPlugins = new BootPlugins();
    this.bootRoutes = new BootRoutes();
    this.bootScripts = new BootScripts();
  }

  boot = async () => {
    // boot databases and models defined in config/env/*.json
    await this.bootDatabases.boot();

    // boot local plugins from /plugins/**/*.js
    await this.bootPlugins.boot();

    // boot all boot script from /setup/boot/**/*Before.js
    await this.bootScripts.boot('Before');

    // boot all routes from /component/**/*Routes.js
    const resolverModels = new ResolverModels();
    this.bootRoutes.models = resolverModels.getAllModels();
    await this.bootRoutes.boot();

    // boot all boot scripts from /setup/boot/**/*After.js
    await this.bootScripts.boot('After');
  }
}

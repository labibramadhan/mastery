export default class ServerBoot {
  boot = async () => {
    // boot databases and models defined in config/env/*.json
    const DatabaseBoot = requireF('services/_core/boot/DatabaseBoot');
    const databaseBoot = new DatabaseBoot();
    await databaseBoot.boot();

    // boot all model relationships/associations
    const ModelAssociationBoot = requireF('services/_core/boot/ModelAssociationBoot');
    const bootModels = new ModelAssociationBoot();
    await bootModels.boot();

    // boot local plugins from /plugins/**/*.js
    const PluginBoot = requireF('services/_core/boot/PluginBoot');
    const pluginBoot = new PluginBoot();
    await pluginBoot.boot();

    // boot all boot script from /setup/boot/**/*Before.js
    const ScriptBoot = requireF('services/_core/boot/ScriptBoot');
    const scriptBoot = new ScriptBoot();
    await scriptBoot.boot('Before');

    const RouteGeneratorBoot = requireF('services/_core/boot/RouteGeneratorBoot');
    const routeGeneratorBoot = new RouteGeneratorBoot();
    await routeGeneratorBoot.boot();

    // boot all routes from /component/**/*Routes.js
    const RouteBoot = requireF('services/_core/boot/RouteBoot');
    const routeBoot = new RouteBoot();
    await routeBoot.boot();

    // boot all boot scripts from /setup/boot/**/*After.js
    await scriptBoot.boot('After');
  }
}

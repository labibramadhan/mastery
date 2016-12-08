export default class ServerBoot {
  boot = async () => {
    const PreBoot = requireF('core/services/boot/PreBoot');
    const preBoot = new PreBoot();
    await preBoot.boot();

    // boot databases and models defined in config/env/*.json
    const DatabaseBoot = requireF('core/services/boot/DatabaseBoot');
    const databaseBoot = new DatabaseBoot();
    await databaseBoot.boot();

    // boot all model relationships/associations
    const ModelAssociationBoot = requireF('core/services/boot/ModelAssociationBoot');
    const bootModels = new ModelAssociationBoot();
    await bootModels.boot();

    // boot local plugins from /plugins/**/*.js
    const PluginBoot = requireF('core/services/boot/PluginBoot');
    const pluginBoot = new PluginBoot();
    await pluginBoot.boot();

    // boot all boot script from /setup/boot/**/*Before.js
    const ScriptBoot = requireF('core/services/boot/ScriptBoot');
    const scriptBoot = new ScriptBoot();
    await scriptBoot.boot('Before');

    const RouteGeneratorBoot = requireF('core/services/boot/RouteGeneratorBoot');
    const routeGeneratorBoot = new RouteGeneratorBoot();
    await routeGeneratorBoot.boot();

    // boot all routes from /core|main/components/**/*Routes.js
    const RouteBoot = requireF('core/services/boot/RouteBoot');
    const routeBoot = new RouteBoot();
    await routeBoot.boot();

    // boot all boot scripts from /setup/boot/**/*After.js
    await scriptBoot.boot('After');

    const PostBoot = requireF('core/services/boot/PostBoot');
    const postBoot = new PostBoot();
    await postBoot.boot();
  }
}

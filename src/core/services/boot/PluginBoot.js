import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class PluginBoot {
  boot = async () => {
    // retrieve all available package plugins
    const pluginGlob = path.join(rootPath, 'core/plugins/*.js');
    const plugins = globSyncMultiple(pluginGlob);
    for (const plugin of plugins) { // eslint-disable-line no-restricted-syntax
      await server.register(require(plugin));
    }
  }
}

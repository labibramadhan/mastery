import glob from 'glob';
import path from 'path';

export default class PluginBoot {
  boot = async () => {
    // retrieve all available package plugins
    const pluginGlob = path.resolve(path.join(rootPath, 'plugins', '**', '*.js'));
    const plugins = glob.sync(pluginGlob);
    for (const plugin of plugins) { // eslint-disable-line no-restricted-syntax
      await server.register(require(plugin));
    }
  }
}

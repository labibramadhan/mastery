import Path from 'path';

const {
  Boot,
} = requireF('core/services/EventsDecorator');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

@Boot('pre')
class PluginRegistration { // eslint-disable-line no-unused-vars
  boot = async () => {
    // retrieve all available package plugins
    const pluginGlob = Path.join(rootPath, 'core/plugins/*.js');
    const plugins = globSyncMultiple(pluginGlob);
    for (const plugin of plugins) { // eslint-disable-line no-restricted-syntax
      await server.register(require(plugin));
    }
  }
}

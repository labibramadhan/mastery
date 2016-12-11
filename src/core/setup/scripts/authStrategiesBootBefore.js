import _ from 'lodash';

export default () => {
  const strategies = requireF('core/setup/config/authStrategiesConfig');

  const enabledStrategies = _.pick(strategies, conf.get('authStrategies'));

  _.each(enabledStrategies, (strategy, name) => {
    server.auth.strategy(name, strategy.type, strategy.config);
  });
};

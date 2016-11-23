import _ from 'lodash';

export default (server) => {
  const strategies = requireF('setup/config/authStrategiesConfig');

  _.each(strategies, (strategy, name) => {
    server.auth.strategy(name, strategy.type, strategy.config);
  });
};

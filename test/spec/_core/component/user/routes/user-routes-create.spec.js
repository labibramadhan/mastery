import test from 'ava';
import path from 'path';

import setup from '../../../../../helpers/setup';

const { prefix } = requireF('setup/config/commonConfigs');

setup(test);

test(`existence PUT create ${prefix}user`, (t) => {
  const { server } = t.context;

  const thisPath = path.join(prefix, 'user');
  const thisMethod = 'PUT';

  const routes = server.table()[0].table;

  t.truthy(routes.find(route =>
    route.path === thisPath && route.method === thisMethod.toLowerCase(),
  ));
});

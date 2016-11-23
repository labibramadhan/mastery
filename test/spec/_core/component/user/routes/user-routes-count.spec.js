import test from 'ava';
import path from 'path';

import setup from '../../../../../helpers/setup';

const { prefix } = requireF('setup/config/commonConfigs');

setup(test);

test(`existence GET count ${prefix}users`, (t) => {
  const { server } = t.context;

  const thisPath = path.join(prefix, 'users', 'count');
  const thisMethod = 'GET';

  const routes = server.table()[0].table;

  t.truthy(routes.find(route =>
    route.path === thisPath && route.method === thisMethod.toLowerCase(),
  ));
});

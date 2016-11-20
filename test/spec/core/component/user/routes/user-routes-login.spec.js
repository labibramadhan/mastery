import test from 'ava';
import path from 'path';

import setup from '../../../../../helpers/setup';

const { prefix } = requireF('setup/config');

setup(test);

test(`existence POST login ${prefix}user/login`, (t) => {
  const { server } = t.context;

  const thisPath = path.join(prefix, 'user', 'login');
  const thisMethod = 'POST';

  const routes = server.table()[0].table;

  t.truthy(routes.find(route =>
    route.path === thisPath && route.method === thisMethod.toLowerCase(),
  ));
});

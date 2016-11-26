import path from 'path';
import {
  assert,
} from 'chai';
import setup from '../../../../../helpers/setup';

const prefix = conf.get('prefix');

describe(`existence GET findOne ${prefix}user`, () => {
  before(async () => {
    await setup();
  });

  it('exists', () => {
    const thisPath = path.join(prefix, 'user');
    const thisMethod = 'GET';

    const routes = server.table()[0].table;

    assert.isObject(routes.find(route =>
      route.path === thisPath && route.method === thisMethod.toLowerCase(),
    ));
  });
});

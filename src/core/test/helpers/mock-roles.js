import _ from 'lodash';

export default async function mockSessions() {
  const ModelResolver = requireF('core/services/resolvers/ModelResolver');
  const modelResolver = new ModelResolver();
  const roleModel = modelResolver.getModel('role');

  const role1 = await roleModel.create({
    name: 'role1',
  });

  const role2 = await roleModel.create({
    name: 'role2',
  });

  const role3 = await roleModel.create({
    name: 'role3',
  });

  const role4 = await roleModel.create({
    name: 'role4',
  });

  // eslint-disable-next-line no-param-reassign
  this.roles = _.merge(this.roles || {}, {
    role1,
    role2,
    role3,
    role4,
  });
}

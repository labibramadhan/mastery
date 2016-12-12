export default async function mockSessions() {
  const ModelResolver = requireF('core/services/resolvers/ModelResolver');
  const modelResolver = new ModelResolver();
  const sessionModel = modelResolver.getModel('session');

  const {
    authenticated1,
    authenticated2,
    admin1,
    admin2,
  } = this.users;

  const session1 = await sessionModel.create({
    userId: authenticated1.id,
    token: 'session1',
    platform: 'session1',
    expiry: 12345,
  });

  const session2 = await sessionModel.create({
    userId: authenticated2.id,
    token: 'session2',
    platform: 'session2',
    expiry: 12345,
  });

  const session3 = await sessionModel.create({
    userId: admin1.id,
    token: 'session3',
    platform: 'session3',
    expiry: 12345,
  });

  const session4 = await sessionModel.create({
    userId: admin2.id,
    token: 'session4',
    platform: 'session4',
    expiry: 12345,
  });

  const session5 = await sessionModel.create({
    token: 'session5',
    platform: 'session5',
    expiry: 12345,
  });

  const sessionObj1 = {
    userId: authenticated1.id,
    token: 'sessionObj1',
    platform: 'sessionObj1',
    expiry: 12345,
  };

  const sessionObj2 = {
    userId: authenticated2.id,
    token: 'sessionObj2',
    platform: 'sessionObj2',
    expiry: 12345,
  };

  const sessionObj3 = {
    userId: admin1.id,
    token: 'sessionObj3',
    platform: 'sessionObj3',
    expiry: 12345,
  };

  const sessionObj4 = {
    userId: admin2.id,
    token: 'sessionObj4',
    platform: 'sessionObj4',
    expiry: 12345,
  };

  this.sessions = {
    session1,
    session2,
    session3,
    session4,
    session5,
    sessionObj1,
    sessionObj2,
    sessionObj3,
    sessionObj4,
  };
}

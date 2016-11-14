import Boom from 'boom';
import jwt from 'jsonwebtoken';

import locale from '../../setup/locales';
import { secret } from '../../setup/config';

export default async (request, reply) => {
  const i18n = await locale();
  const { username, email, password } = request.payload;

  let credentials = {};

  const { models } = request.getDb();
  const { user } = models;
  if (!username) {
    credentials = { username };
  } else if (email) {
    credentials = { email };
  }

  const instance = await user.findOne({ where: credentials });
  if (instance && instance.validPassword(password)) {
    const token = jwt.sign({ id: instance.id, ...credentials }, secret);
    reply({ token });
  } else {
    reply(Boom.unauthorized(i18n.t('User.login.failed')));
  }
};

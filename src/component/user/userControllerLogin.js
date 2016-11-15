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

  if (username) {
    // login with username
    credentials = { username };
  } else if (email) {
    // login with email
    credentials = { email };
  }

  // check if current credentials is valid in database
  const instance = await user.findOne({ where: credentials });
  if (instance && instance.validPassword(password)) {
    // if valid, generate a new JWT token
    const token = jwt.sign({ id: instance.id, ...credentials }, secret);
    reply({ token });
  } else {
    // if not valid, return the user.login.failed translated message
    reply(Boom.unauthorized(i18n.t('user.login.failed')));
  }
};

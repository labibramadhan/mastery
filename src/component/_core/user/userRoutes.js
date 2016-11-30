import path from 'path';
import Joi from 'joi';

const prefix = conf.get('prefix');

const UserHandlerLogin = requireF('component/_core/user/UserHandlerLogin');

// define user component endpoint
export default () => {
  const handlerLogin = new UserHandlerLogin();

  return [
    {
      // define /user/login route
      method: 'POST',
      path: path.join(prefix, 'user', 'login'),
      handler: handlerLogin.handler,
      config: {
        tags: ['api'],
        validate: {
          payload: {
            username: Joi.string(),
            email: Joi.string(),
            password: Joi.string().required(),
          },
        },
      },
    },
  ];
};

export default {
  // define the role name as object key
  admin: [
    // user model permissions
    'user:findAll',
    'user:count',
    'user:create',
    'user:update',
    'user:findOne',
    'user:findById',
    'user:roles:findAll',
    'user:roles:count',

    // sesion model permissions
    'session:findAll',
    'session:count',
    'session:create',
    'session:findOne',
    'session:findById',
    'session:user:findOne',
  ],
};

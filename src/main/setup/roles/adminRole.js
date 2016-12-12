export default {
  // define the role name as object key
  admin: [
    // user model permissions
    'user:findAll',
    'user:count',
    'user:create',
    'user:update',
    'user:delete',
    'user:findOne',
    'user:findById',
    'user:roles:find',
    'user:roles:count',
    'user:roles:set',
    'user:roles:add',
    'user:roles:addMultiple',

    // sesion model permissions
    'session:findAll',
    'session:count',
    'session:create',
    'session:delete',
    'session:findOne',
    'session:findById',
    'session:user:find',
  ],
};

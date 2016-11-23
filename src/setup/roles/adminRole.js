export default {
  // define the role name as object key
  admin: [
    // user model permissions
    'user:findAll',
    'user:count',
    'user:findOne',
    'user:findById',
    'user:roles:findAll',
    'user:roles:count',
  ],
};

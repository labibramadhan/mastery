export const validateAuth = (decoded, request, callback) =>
  callback(null, true, {
    scope: ['user:findAll', 'user:findOne', 'user:findById', 'user:count'],
    ...decoded,
  });
export default (sequelize, dataTypes) =>
sequelize.define('role', {
  name: {
    type: dataTypes.STRING,
    unique: true,
  },
}, {
  schema: 'core',
  freezeTableName: true,
});

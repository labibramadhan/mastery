export default sequelize =>
  sequelize.define('userRole', {}, {
    schema: 'core',
    freezeTableName: true,
  });

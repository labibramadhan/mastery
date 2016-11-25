export default sequelize =>
  sequelize.define('userRole', {}, {
    schema: 'core',
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        models.userRole.belongsTo(models.role);
        models.userRole.belongsTo(models.user);
      },
    },
  });

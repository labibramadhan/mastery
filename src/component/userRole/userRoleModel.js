export default sequelize =>
  sequelize.define('userRole', {}, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        models.userRole.belongsTo(models.role);
        models.userRole.belongsTo(models.user);
      },
    },
  });

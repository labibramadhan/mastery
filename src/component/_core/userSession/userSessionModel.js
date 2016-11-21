export default sequelize =>
  sequelize.define('userSession', {}, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        models.userRole.belongsTo(models.session);
        models.userRole.belongsTo(models.user);
      },
    },
  });

export default (sequelize, dataTypes) =>
  sequelize.define('role', {
    name: { type: dataTypes.STRING, unique: true },
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        models.role.belongsToMany(models.user, { through: 'userRoleModel' });
      }
    }
  });
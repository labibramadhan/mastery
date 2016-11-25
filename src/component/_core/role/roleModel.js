export default (sequelize, dataTypes) =>
sequelize.define('role', {
  name: {
    type: dataTypes.STRING,
    unique: true,
  },
}, {
  schema: 'core',
  freezeTableName: true,
  classMethods: {
    associate: (models) => {
      models.role.belongsToMany(models.user, {
        through: 'userRole',
        foreignKey: 'roleId',
      });
    },
  },
});

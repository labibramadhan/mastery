export default (sequelize, dataTypes) =>
sequelize.define('session', {
  name: {
    type: dataTypes.STRING,
    unique: true,
  },
}, {
  freezeTableName: true,
  classMethods: {
    associate: (models) => {
      models.session.belongsToMany(models.user, {
        through: 'userSession',
        foreignKey: 'sessionId',
      });
    },
  },
});

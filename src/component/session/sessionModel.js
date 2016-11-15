export default (sequelize, dataTypes) =>
  sequelize.define('session', {
    token: dataTypes.STRING,
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        models.session.belongsTo(models.user);
      },
    },
  });

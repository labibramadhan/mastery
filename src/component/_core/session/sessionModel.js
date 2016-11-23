export default (sequelize, dataTypes) =>
sequelize.define('session', {
  token: {
    type: dataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  profile: dataTypes.TEXT,
  expire: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  classMethods: {
    associate: (models) => {
      models.session.belongsTo(models.user);
    },
  },
});

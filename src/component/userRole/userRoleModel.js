export default (sequelize, dataTypes) =>
  sequelize.define('userRole', {
    name: dataTypes.STRING,
  }, { freezeTableName: true });

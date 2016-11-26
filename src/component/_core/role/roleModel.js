const {
  associateModel,
} = requireF('services/_core/commonServices');

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
      associateModel(models, 'role');
    },
  },
});

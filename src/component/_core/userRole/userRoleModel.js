const {
  associateModel,
} = requireF('services/_core/commonServices');

export default sequelize =>
  sequelize.define('userRole', {}, {
    schema: 'core',
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        associateModel(models, 'userRole');
      },
    },
  });

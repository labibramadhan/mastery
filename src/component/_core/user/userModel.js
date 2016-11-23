import bcrypt from 'bcrypt';

const locale = requireF('setup/_core/locales');

export default (sequelize, dataTypes) =>
sequelize.define('user', {
  username: {
    type: dataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [4, 15],
      usernamePattern: async (val, next) => {
        const i18n = await locale();

        /**
         * username should have at least a lowercase char,
         * an uppercase char, a single number, cannot have space and symbols
         */
        const valid = (val) ? /^[a-zA-Z0-9.\-_$@*!]+$/.test(val) : true;

        // if username is not valid, return the user.username.invalid translated message
        return valid ? next() : next(i18n.t('user.username.invalid'));
      },
    },
  },
  email: {
    type: dataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
      len: [6, 255],
    },
    set(val) {
      // lowercase the email value
      this.setDataValue('email', val.toString().toLowerCase());
    },
  },
  password: {
    type: dataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      passwordPattern: async (val, next) => {
        const i18n = await locale();

        // password should have at least an uppercase char, a lowercase char, and a single number
        const valid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$/.test(val);
        return valid ? next() : next(i18n.t('user.password.invalid'));
      },
    },
    set(val) {
      // save the encrypted password
      const password = bcrypt.hashSync(val, bcrypt.genSaltSync(8), null);
      this.setDataValue('password', password);
    },
  },
}, {
  freezeTableName: true,
  indexes: [{
    unique: true,
    fields: ['email'],
  }],
  classMethods: {
    associate: (models) => {
      models.user.belongsToMany(models.role, {
        through: 'userRole',
        foreignKey: 'userId',
      });
      models.user.hasMany(models.session);
    },
  },
  instanceMethods: {
    validPassword(password) {
      // check if password match with current user encrypted password
      return bcrypt.compareSync(password, this.get('password'));
    },
  },
  hooks: {
    async afterCreate(user) {
      const {
        role,
      } = this.modelManager.sequelize.models;
      const authenticatedRole = await role.findOne({
        where: {
          name: 'authenticated',
        },
      });

      // give the default 'authenticated' role
      await user.addRoles(authenticatedRole);
    },
  },
});

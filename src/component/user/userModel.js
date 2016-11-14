import bcrypt from 'bcrypt';
import locale from '../../setup/locales';

export default (sequelize, dataTypes) =>
  sequelize.define('user', {
    username: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 15],
        usernamePattern: async (val, next) => {
          const i18n = await locale();
          const valid = (val) ? /^[a-zA-Z0-9.\-_$@*!]+$/.test(val) : true;
          return valid ? next() : next(i18n.t('User.username.invalid'));
        },
      },
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [6, 255],
      },
      set(val) {
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
          const valid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$/.test(val);
          return valid ? next() : next(i18n.t('User.password.invalid'));
        },
      },
      set(val) {
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
    instanceMethods: {
      validPassword(password) {
        return bcrypt.compareSync(password, this.get('password'));
      },
    },
  });

import bcrypt from 'bcrypt';

export default {
  schema: {
    username: {
      validate: {
        usernamePattern: async (val, next) => {
          /**
           * username should have at least a lowercase char,
           * an uppercase char, a single number, cannot have space and symbols
           */
          const valid = (val) ? /^[a-zA-Z0-9.\-_$@*!]+$/.test(val) : true;

          // if username is not valid, return the user.username.invalid translated message
          return valid ? next() : next('error.user.username.invalid');
        },
      },
    },
    email: {
      set(val) {
        // lowercase the email value
        this.setDataValue('email', val.toString().toLowerCase());
      },
    },
    password: {
      validate: {
        passwordPattern: async (val, next) => {
          // password should have at least an uppercase char, a lowercase char, and a single number
          const valid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$/.test(val);
          return valid ? next() : next('error.user.password.invalid');
        },
      },
      set(val) {
        // save the encrypted password
        const password = bcrypt.hashSync(val, bcrypt.genSaltSync(8), null);
        this.setDataValue('password', password);
      },
    },
  },

  options: {
    instanceMethods: {
      validPassword(password) {
        // check if password match with current user encrypted password
        return bcrypt.compareSync(password, this.get('password'));
      },
    },
    hooks: {
      async afterCreate(user) {
        if (user.skipDefaultRole) return;
        const {
          role,
        } = this.modelManager.sequelize.models;
        const authenticatedRole = await role.findOne({
          where: {
            name: 'authenticated',
          },
        });
        if (authenticatedRole) {
          // give the default 'authenticated' role
          await user.addRole(authenticatedRole);
        }
      },
    },
  },
};

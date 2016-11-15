import path from 'path';

// define prefix of API paths
export const prefix = '/api/v1/';

// JWT secret key
export const secret = 'asdqwe123';

// Sequelize database configuration
export const db = {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.resolve(path.join(__dirname, '..', '..', 'db.sqlite')),
};

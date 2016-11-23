import path from 'path';

// define prefix of API paths
export const prefix = '/api/v1/';

// JWT secret key
export const secret = 'asdqwe123';

// root path of this application, must be the /src directory
export const rootPath = path.resolve(path.join(__dirname, '..', '..'));

// Sequelize database configuration
export const db = {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.resolve(path.join(rootPath, '..', 'db.sqlite')),
};

// maximum a user can have sessions
export const maxSessions = 10;

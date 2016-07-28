var orm = require('orm');

const {base, user, pass} = require('./config').database;

const scope = {
  instance     : orm,
  db           : orm.connect(`postgres://${user}:${pass}@localhost/${base}`),
  init         : () => new Promise((resolve, reject) => {

    require('../utils/require.util')(require('path').resolve(__dirname, 'models'));

    scope.db.on('connect', err => {
      if ( err ) {
        console.error('Failed to connect db');
        reject(err);
        throw err;
      }

      scope.db.sync(err => {
        if ( err ) {
          throw err;
        }
        console.log('Database synchronized');
        resolve(scope.db, scope.model);
      });
    });

  }),
  prepare      : {},
  model        : {},
  declareModel : function (model, schema, params) {
    return scope.prepare[model] = new Promise((resolve, reject) => {
      scope.db.on('connect', err => {
        if ( err ) {
          reject(err);
        } else {
          resolve(scope.model[model] = scope.db.define(model, schema, params));
        }
      });
    });

  }
};

module.exports = scope;


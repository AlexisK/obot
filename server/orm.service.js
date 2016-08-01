var orm = require('orm');
var MigrateTask = require('migrate-orm2');
var fs = require('fs');

const {base, user, pass} = require('./config').database;

const scope = {

  instance : orm,
  db       : orm.connect(`postgres://${user}:${pass}@localhost/${base}`),


  migrate : (direction = 'up') => new Promise((resolve, reject) => {
    var migration = new MigrateTask(scope.db.driver);

    migration[direction]((err, ok) => {
      if ( err ) {
        reject(err);
        throw err;
      }
      resolve(ok);
    })
  }),


  init : () => new Promise((resolve, reject) => {
    console.log(scope);
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

        require('../utils/merge-migrations.util')(require('path').resolve(__dirname, 'basic_migrations'));
        resolve(scope.db, scope.model);
      });
    });

  }),


  reset : () => new Promise((resolve, reject) => {
    scope.db.on('connect', err => {
      if ( err ) {
        console.error('Failed to connect db');
        reject(err);
        throw err;
      }

      scope.migrate('down');
    });
  })

};

module.exports = scope;


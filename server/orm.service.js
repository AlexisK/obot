var orm = require('orm');
var fs  = require('fs');

const {base, user, pass} = require('./config').database;

const scope = {

  //Private
  _pendingModels       : [],
  _pendingAssociations : [],

  //Public
  models   : {},
  instance : orm,
  db       : orm.connect(`postgres://${user}:${pass}@localhost/${base}`),


  init : () => new Promise((resolve, reject) => {
    scope.db.on('connect', err => {

      //Connect
      if ( err ) {
        console.error('Failed to connect db');
        reject(err);
        throw err;
      }

      //Declare models
      scope.modelsDeclare = Promise.all(scope._pendingModels.map(worker => new Promise(worker)));
      scope.modelsDeclare.then(() => new Promise(modelsDeclared=> {

        //Define associations
        scope.associationsDeclare = Promise.all(scope._pendingAssociations.map(worker => new Promise(worker)));
        scope.associationsDeclare.then(modelsDeclared);
      }).then(() => {

        //Init
        scope.db.sync(info => {
          if ( info ) {
            console.log(info);
          }
          //Ready
          resolve(scope.db, scope.models);
        });
      }));

    });

  }),


  defineModel(name, schema, params, onModelDeclared) {
    scope._pendingModels.push((resolve, reject) => {
      console.log(`Declare ${name}`);
      scope.models[name] = scope.db.define(name, schema, params);
      resolve(scope.db, scope.models);
    });
    if ( onModelDeclared ) {
      scope._pendingAssociations.push(onModelDeclared);
    }
  }

};

module.exports = scope;
require('../utils/require.util')(require('path').resolve(__dirname, 'basic_models'));

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
      scope.models[name] = scope.db.define(name, schema, params);
      resolve(scope.db, scope.models);
    });
    if ( onModelDeclared ) {
      scope._pendingAssociations.push(onModelDeclared);
    }
  },

  logErrors(err) {
    if ( err && err.severity ) {
      console.error(`\tORM ${err.severity}: [ table: ${err.table}\tconstraint: ${err.constraint}\t${err.detail}]`);
      return true;
    }
    return false;
  },

  fetchItem(model, data, findData) {
    return new Promise((resolve, reject) => {
      scope.models[model].create(data, (err, success) => {
        if ( success ) {
          resolve(success);
        } else {
          data = findData || data;
          if ( data.constructor == Number ) {
            scope.models[model].get(data, (err, result) => {
              scope.logErrors(err);
              result && resolve(result) || reject(null);
            });
          } else if ( data.id ) {
            scope.models[model].get(data.id, (err, result) => {
              scope.logErrors(err);
              result && resolve(result) || reject(null);
            });
          } else {
            scope.models[model].find(data, (err, result) => {
              scope.logErrors(err);
              result && result[0] && resolve(result[0]) || reject(null);
            });
          }
        }
      });
    });
  }

};

module.exports = scope;
require('../utils/require.util')(require('path').resolve(__dirname, 'basic_models'));

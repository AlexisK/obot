const ormPackage = require('orm');
const fs         = require('fs');

import {auth} from './auth';
import {database as config} from './settings';

class ORM {

  private _pendingModels : any[]       = [];
  private _pendingAssociations : any[] = [];
  private _initPromise : Promise;

  public models : any   = {};
  public instance : any = ormPackage;
  public db : any       = ormPackage.connect(`postgres://${config.user}:${config.pass}@localhost/${config.base}`);
  public modelsDeclare : Promise;
  public associationsDeclare : Promise;

  static ormModels : any;
  static roleModifiers = ['retrieve', 'insert', 'update', 'delete'];

  public init() {
    return this._initPromise || (this._initPromise = new Promise((resolve, reject) => {
        this.db.on('connect', err => {

          //Connect
          if (err) {
            console.error('Failed to connect db');
            reject(err);
            throw err;
          }

          //Declare models
          this.modelsDeclare = Promise.all(this._pendingModels.map(worker => new Promise(worker)));
          this.modelsDeclare.then(() => new Promise(modelsDeclared=> {

            //Define associations
            this.associationsDeclare = Promise.all(this._pendingAssociations.map(worker => new Promise(worker)));
            this.associationsDeclare.then(modelsDeclared);
          }).then(() => {

            //Init
            this.db.sync(info => {
              if (info) {
                console.log(info);
              }
              //Ready
              console.log('ready');
              resolve(this.db, this.models);
            });
          }));

        });

      }));
  }


  public defineModel(name : string, schema : any, params? : any, onModelDeclared? : Function) {
    auth.addRoles(ORM.roleModifiers.reduce((roles, modifier) => {
      roles.push(`${name}_${modifier}`);
      return roles;
    }, []));

    this._pendingModels.push((resolve, reject) => {
      this.models[name] = this.db.define(name, schema, params);
      resolve(this.db, this.models);
    });
    if (onModelDeclared) {
      this._pendingAssociations.push(onModelDeclared);
    }
  }

  static logErrors(err : any) {
    if (err && err.severity) {
      console.error(`\tORM ${err.severity}: [ table: ${err.table}\tconstraint: ${err.constraint}\t${err.detail}]`);
      return true;
    }
    return false;
  }


  public fetchItem(model : string, data : any, findData? : any) {
    return new Promise((resolve, reject) => {
      this.models[model].create(data, (err, success) => {
        if (success) {
          resolve(success);
        } else {
          data = findData || data;

          if (data.constructor == Number) {
            data = {id : data};
          }
          if (data.id) {
            this.models[model].get(data.id, (err, result) => {
              ORM.logErrors(err);
              result && resolve(result) || reject(null);
            });
          } else {
            this.models[model].find(data, (err, result) => {
              ORM.logErrors(err);
              result && result[0] && resolve(result[0]) || reject(null);
            });
          }
        }
      });
    });
  }


  public retrieve(request : any) {
    return new Promise((resolve, reject) => {
      this.models[request.model].find(request.filter, (err, list) => {
        if (err) {
          throw err;
        }
        resolve(list);
      });
    });
  }

}

export const orm = new ORM();

//Import models
import * as ormModels from './orm-models';
ORM.ormModels = ormModels;

import {orm} from './orm';

export class Request {
  public token : string;
  public scope : string;
  public author : any;
  public response : any;

  constructor(data : any) {
    Object.assign(this, data);
  }

  public parse() {
    // console.log('Request parse');
    return new Promise((resolve, reject) => {
      ConnectionService.validateRequestUser(this).then(author => {
        // console.log('Author OK');
        this.author = author;
        this._parse().then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  protected _parse() : Promise {
    console.log('Basic _parse');
    return new Promise(done => {
      done();
    });
  };
}

export class RequestCRUD extends Request {
  public command : string;
  public model : string;
  public data : any;
  public filter : any;
  public range : number;
  public offset : number;
  public order : string[][];

  _parse(): Promise {
    // console.log('RequestCRUD _parse');
    return new Promise((resolve, reject) => {
      // console.log('RequestCRUD ok', this.author);
      this.response = [];
      resolve(this);
    });
  }
}


const mapping = {
  'crud' : RequestCRUD
};

export class ConnectionService {

  static parseRequest(data : Request) {
    // console.log('ConnectionService.parseRequest');
    return new Promise((resolve, reject) => {
      if (!data.scope) {
        return false;
      }
      var request = new (mapping[data.scope] || Request)(data);
      request.parse().then(resolve).catch(reject);
    });
  }

  static parseRequestData(request : any) {
    if (request.payload.constructor == Object) {
      return request.payload;
    }
    return JSON.parse(request.payload);
  }

  static validateRequestUser(data : any) {
    return new Promise((resolve, reject) => {
      try {
        if (!data.token) {
          reject();
        }

        orm.models.session.find({token : data.token}).run((err, sessions) => {
          if (err) {
            reject(err);
            throw(err);
          }
          if (!sessions.length) {
            let err = new Error('unauth');
            reject(err);
            return 0;
          }

          sessions[0].getOwner((err, author) => {
            if (err) {
              throw err;
            }
            console.log(author.email);
            resolve(author);
          })
        });
      } catch (err) {
        reject(err);
      }
    });
  }

}

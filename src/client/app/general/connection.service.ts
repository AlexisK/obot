import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'
import {AuthService} from './auth.service';

@Injectable()
export class ConnectionService {

  static scopeDefaults = {
    crud : {
      scope   : 'crud',
      command : 'retrieve',
      model   : '',
      filter  : {},
      range   : 1,
      offset  : 0,
      order   : [],
      data    : null
    }
  };

  constructor(private http : Http, private auth: AuthService) {
  }

  static _parseStringData(str : string) {
    let parsed       = str.split(':');
    let result : any = {
      method : parsed[0] || 'retrieve',
      model  : parsed[1]
    };
    if (parsed[2]) {
      result.filter = {id : result[2]};
    }
    return result;
  }

  request(req : string|any, data? : any, override? : any) : Observable {
    if (req.constructor == String) {
      req = ConnectionService._parseStringData(req);
    }
    req.scope = req.scope || 'crud';
    if (data) {
      req.data = data;
    }
    let token = localStorage.getItem('token');
    if (token) {
      req.token = token;
    }
    req = Object.assign({}, ConnectionService.scopeDefaults[req.scope], req, override);

    return this.http.post('/api/', req).map(res => res.json()).map(res => {
      if (res.exception && res.exception == 'unauth') {
        if( confirm('Session expired. Renew?') ) {
          this.auth.redirectToAuth();
        }
      }
      return res;
    });
  }

}

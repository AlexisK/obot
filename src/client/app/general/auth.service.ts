import {Injectable} from '@angular/core';

const {settings} = require('../../settings.js');
const {SLACK_CLIENT_ID, SLACK_DOMAIN, SLACK_TEAM} = settings;

@Injectable()
export class AuthService {
  private CONST : any = {
    slack_client_id : SLACK_CLIENT_ID,
    domain          : SLACK_DOMAIN,
    team            : SLACK_TEAM,
    token           : localStorage.getItem('token')
  };

  redirectToAuth() {
    location.replace(`https://slack.com/oauth/reflow?client_id=${this.CONST.slack_client_id}&scope=identity.basic&redirect_uri=${encodeURIComponent(this.CONST.domain + 'slack_auth/')}&team=${this.CONST.team}`);
  }

  fetchAuth() {
    return new Promise((resolve, reject) => {
      if (this.CONST.token) {
        resolve(this.CONST.token);
      } else {
        this.redirectToAuth();
      }
    });
  }
}

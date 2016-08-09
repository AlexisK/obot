var https = require("https");
import {Handler} from '../../core/models/handler';
import {settings} from './settings';
import {getRequest} from '../../core/utils/http-request';
import {formatter} from './formatter';

export const handler = new Handler({
  pattern: /(^|\W)(погода|прогноз|(the )?weather|forecast)($|\W)/gi,
  'mention,direct'(message) {

    getRequest(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${settings.city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`, null, {
      port: 443,
      parseJson: true
    }).then(obj => {
      if (obj.query && obj.query.count) {
        let results = obj.query.results.channel;
        message.reply(formatter.format(results));
      } else {
        message.reply(`Could not find forecast for ${settings.city}`);
      }
    });

  }
});

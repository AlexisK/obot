var https = require("https");
import {Handler} from '../../core/models/handler';
import {settings} from './settings';
import {formatter} from './formatter';

export const handler = new Handler({
  pattern: /(^|\W)(погода|прогноз|(the )?weather|forecast)($|\W)/gi,
  'mention,direct'(message) {

    //@todo refactor to use http as util/service, when somewhere else needed
    var req = https.request({
      host  : 'query.yahooapis.com',
      port  : 443,
      path  : `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${settings.city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
      method: 'GET'
    }, resp => {
      let output = [];
      resp.setEncoding('utf8');

      resp.on('data', function (chunk) {
        output.push(chunk);
      });

      resp.on('end', function () {
        let obj = JSON.parse(output.join(''));

        if (obj.query && obj.query.count) {
          let results = obj.query.results.channel;
          message.reply(formatter.format(results));
        } else {
          message.reply(`Could not find forecast for ${settings.city}`);
        }
      });


    }).end();


  }
});

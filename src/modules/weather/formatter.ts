import {Formatter} from '../../core/models/formatter';
import {formatSlackFields} from '../../core/utils/format-slack-fields';

const farenheitToCelsius = function (val) {
  return parseInt((val - 32) / 0.18) / 10;
};

const mphToKmh = function (val) {
  return parseInt(val * 160.9344)/100;
};

class Request {
  color : string = '#eee';
  title : string;
  title_link : string;
  fields : any;
}

export const formatter = new Formatter((message:any) => {
  let req = new Request();

  req.title = `Forecast for ${message.location.city}`;
  req.title_link = message.item.link;

  req.fields = formatSlackFields({
    'Temp'     : `${farenheitToCelsius(message.item.condition.temp)}℃ ${message.item.condition.text}`,
    'Wind'     : `${mphToKmh(message.wind.speed)}kmh ${farenheitToCelsius(message.wind.chill)}℃`,
    'Humidity' : message.atmosphere.humidity,
    'Pressure' : `${message.atmosphere.pressure} ${message.units.pressure}`,
    'Sunrise'  : message.astronomy.sunrise,
    'Sunset'   : message.astronomy.sunset
  });

  return req;
});

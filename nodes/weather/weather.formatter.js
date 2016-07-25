const Formatter          = require('../../models/formatter.model');
const farenheitToCelsius = require('./farenheit-to-celsius.util');
const mphToKmh           = require('./mph-to-kmh.util');

module.exports = new Formatter(message => {
  let req = {
    color : '#eee'
  };

  req.title = `Forecast for ${message.location.city}`;
  req.title_link = message.item.link;

  req.fields = require('../../utils/format-slack-fields.util')({
    'Temp'     : `${farenheitToCelsius(message.item.condition.temp)}℃ ${message.item.condition.text}`,
    'Wind'     : `${mphToKmh(message.wind.speed)}kmh ${farenheitToCelsius(message.wind.chill)}℃`,
    'Humidity' : message.atmosphere.humidity,
    'Pressure' : `${message.atmosphere.pressure} ${message.units.pressure}`,
    'Sunrise'  : message.astronomy.sunrise,
    'Sunset'   : message.astronomy.sunset
  });

  return req;
});

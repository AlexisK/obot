const Formatter = require('../../../models/formatter.model');

module.exports = new Formatter(place => {
  var req = {
    title: place.title
  };

  if ( place.link ) {
    req.title_link = place.link;
  }

  if ( place.description ) {
    req.text = place.description;
  }

  return req;
});

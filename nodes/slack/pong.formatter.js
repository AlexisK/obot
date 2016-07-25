const Formatter = require('../../models/formatter.model');
module.exports = new Formatter(data => {
  return {
    title : data
  };
});

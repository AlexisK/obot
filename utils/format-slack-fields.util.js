const forOwn = require('lodash/forOwn');

module.exports = function(rules) {
  var fieldList = [];
  forOwn(rules, (value, key) => {
    fieldList.push({
      title: key,
      value: value,
      short: true
    });
  });
  return fieldList;
};

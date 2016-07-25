const forOwn = require('lodash/forOwn');

/**
 * Parses dict with comma-separated keys
 *
 * input
 *  parseMappedDict({x: 1,'y, z': 2});
 * output
 *  {x: 1, y: 2,z :2}
 *
 * @param dict
 * @returns {*}
 */
function parseMappedDict(dict) {
  if (dict.constructor == Object) {
    var result = {};
    forOwn(dict, (value, keys) => {
      if (value.constructor == Object) {
        value = parseMappedDict(value);
      }
      keys = keys.split(/,\s*/g);
      keys.forEach(key => {
        result[key] = value;
      });
    });
    return result;
  }
  return dict;
}

module.exports = parseMappedDict;

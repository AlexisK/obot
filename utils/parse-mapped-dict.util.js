const forOwn = require('lodash/forOwn');

/**
 * Parses dict with comma-separated keys
 *
 * input
 *  parseMappedDict({'x':1,'y,z':2});
 * output
 *  {'x':1,'y':2,'z':2}
 *
 * @param dict
 * @returns {*}
 */
function parseMappedDict(dict) {
  if ( dict.constructor == Object ) {
    var result = {};
    forOwn(dict, (v,keys) => {
      if ( v.constructor == Object ) {
        v = parseMappedDict(v);
      }
      keys = keys.split(',');
      keys.forEach(key => {
        result[key] = v;
      });

    });
    return result;
  }
  return dict;
}

module.exports = parseMappedDict;

import forOwn = require('lodash/forOwn');

const _isObject = (obj : any) : boolean =>
obj.constructor === Object;

export function parseMappedDict(dict : any) {
  if (_isObject(dict)) {
    const result = {};
    forOwn(dict, (value, keys) => {
      if (_isObject(value)) {
        value = parseMappedDict(value);
      }
      let keyList = keys.split(/,\s*/g);
      keyList.forEach(key => {
        result[key] = value;
      });
    });
    return result;
  }
  return dict;
}

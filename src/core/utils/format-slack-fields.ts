import forOwn = require('lodash/forOwn');
export function formatSlackFields(rules: any) {
  const fieldList = [];

  forOwn(rules, (value, key) =>
    fieldList.push({
      title : key,
      value,
      short : true
    }));

  return fieldList;
}

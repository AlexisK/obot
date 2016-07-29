module.exports = function(val, len) {
  val = val.toString();
  return new Array(len-val.length+1).join('0')+val;
};

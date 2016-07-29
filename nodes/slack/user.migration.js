exports.up = function(next) {
  this.addColumn('users', { slack_id: {
    type: 'text',
    size: 16,
    unique: true
  } }, next);
};

exports.down = function(next) {
  this.dropColumn('users','slack_id');
};

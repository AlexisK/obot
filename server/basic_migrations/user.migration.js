exports.up = function (next) {
  this.createTable('users', {
    id       : {type : "serial", key : true},
    email    : {type : 'text', size : 2048, required : true, unique : true},
    fullName : {type : 'text', size : 2048}
  }, () => {
    this.addIndex('user_email_idx', {
      table: 'users',
      columns: ['email'],
      unique: true
    }, next);
  });
};

exports.down = function (next) {
  this.dropIndex('user_email_idx', 'users', () => {
    this.dropTable('users', next);
  });
};

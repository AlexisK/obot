const orm = require('../../server/orm.service');

const model = orm.models.user.extendsTo('slack', {
  id : {type : 'text', size : 16}
});

model.sync();

module.exports = model;

import {orm} from '../../server/orm';

orm.init().then(()=> {
  const model = orm.models.user.extendsTo('slack', {
    id          : {type : 'text', size : 16, unique : true, required : true, index : true},
    name        : {type : 'text', size : 512},
    avatarSmall : {type : 'text', size : 2048},
    avatarLarge : {type : 'text', size : 2048},
    is_bot      : {type : 'boolean'},
    is_admin    : {type : 'boolean'}
  });

  model.sync();

});

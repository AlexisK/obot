import {orm} from '../orm';

export const Session = orm.defineModel('session', {
  token : {type : 'text', size : 2048, unique : true, required : true, index : true}
}, {
  cascadeRemove : true
}, next => {
  orm.models.session.hasOne('owner', orm.models.user, {
    reverse : 'sessions'
  });
  next();
});

import {Handler} from '../../core/models';

export const lolHandler = new Handler({
  pattern : /^[олol\s]+$/i,
  ambient(message : any) {
    if ( message.authorSlack ) {
      message.reply('я люблю спамить!', {
        name  : message.authorSlack.profile.real_name_normalized,
        image : message.authorSlack.profile.image_48
      }).then(msg => {
        setTimeout(() => {
          msg.text = 'я супермен!';
          msg.save();
        }, 2000);
      });
    }
  }
});

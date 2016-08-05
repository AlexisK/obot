import {Handler, Message} from '../../core/models';

export const lolHandler = new Handler({
  pattern: /^[ол\s]+$/gi,
  ambient(message : Message) {
    message.reply('я люблю спамить!', {
      name: message.author.real_name,
      image: message.author.profile.image_48
    }).then(msg => {
      setTimeout(() => {
        msg.text = 'я супермен!';
        msg.save();
      }, 2000);
    });
  }
});

import {Formatter} from '../../core/models/formatter';

const arr = [
  'http://cs627431.vk.me/v627431114/361f4/qybmHgt4Qk0.jpg',
  'http://www.kinonews.ru/insimgs/trailer/trailer36986.jpg',
  'http://jumabendery.narod.ru/images/ded.jpg',
  'https://i.ytimg.com/vi/sj8rzjzzBOo/maxresdefault.jpg'
];

export const grandpaFormatter = new Formatter(message => {
  return {
    text      : message,
    image_url : arr[Math.floor(Math.random() * arr.length)]
  }
});

import {Handler} from '../../core/models';

export const problemHandler = new Handler({
  pattern : /(^|\W)(problem+(s)?|проблем+(а|ы)?)($|\W)/gi,
  ambient(message : any) {
    message.addReaction('troll');
  }
});

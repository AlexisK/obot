import { Handler } from '../../../core/models/handler';

const pattern = /(^|\W)([A-Z0-9]+-\d+)($|\W)/g;

export const taskMention = new Handler({
  pattern,
  handler(message: any) {
    message.text.replace(new RegExp(<string>pattern), (match, char, issueNumber) => {

    });
  }
});

import {Formatter} from '../../../core/models/formatter';

class Req {
  public title: string;
  public title_link:string;
  public text:string;

  constructor(title:string) {
    this.title = title;
  }
}

export const dinnerFormatter = new Formatter(place => {
  var req = new Req(place.title);

  if ( place.link ) {
    req.title_link = place.link;
  }

  if ( place.description ) {
    req.text = place.description;
  }

  return req;
});

import {Injectable} from '@angular/core';

@Injectable()
export class MainMenuService {
  public schema = [];
  public groups = {};

  constructor() {

  }

  registerButton(path : string, name : string, group? : string) {
    let newItem = {
      type : 'link',
      path, name
    };

    if (group) {
      if (!this.groups[group]) {
        this.registerGroup(group);
      }
      this.groups[group].items.push(newItem);
    } else {
      this.schema.push(newItem);
    }
  }

  private registerGroup(name : string) {
    let group         = {
      type  : 'group',
      name,
      items : []
    };
    this.groups[name] = group;
    this.schema.push(group);
  }
}

export const mainMenuService = new MainMenuService();

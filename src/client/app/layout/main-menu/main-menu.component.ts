import { Component } from '@angular/core';
import {mainMenuService} from './main-menu.service';
import {MainMenuItemComponent} from './main-menu-item/main-menu-item.component';

@Component({
  selector: 'main-menu',
  directives: [MainMenuItemComponent],
  templateUrl: 'app/layout/main-menu/main-menu.component.html',
  styleUrls: ['app/layout/main-menu/main-menu.component.css']
})

export class MainMenuComponent {
  private schema: any[];

  constructor() {
    this.schema = mainMenuService.schema;
  }
}

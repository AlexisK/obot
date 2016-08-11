import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector      : 'main-menu-item',
  templateUrl   : 'app/layout/main-menu/main-menu-item/main-menu-item.component.html',
  styleUrls     : ['app/layout/main-menu/main-menu-item/main-menu-item.component.css'],
  encapsulation : ViewEncapsulation.None
})

export class MainMenuItemComponent {
  @Input() data : any;

  constructor() {
  }
}

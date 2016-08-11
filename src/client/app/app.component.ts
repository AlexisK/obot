import {Component,ViewEncapsulation} from '@angular/core';

import {MainMenuComponent} from './layout/main-menu/main-menu.component';
import {AuthService} from './general/auth.service';
import {ConnectionService} from './general/connection.service';
import * as modules from './modules/index';

console.log(modules);
/*
 APP
 */

@Component({
  selector      : 'my-app',
  templateUrl   : 'app/app.component.html',
  directives    : [MainMenuComponent],
  providers     : [AuthService, ConnectionService],
  styleUrls     : ['app/general/general.css', 'app/app.component.css'],
  encapsulation : ViewEncapsulation.None
})

export class AppComponent {

  constructor(private auth : AuthService,
              private conn : ConnectionService) {
    auth.fetchAuth().then(() => {
      console.log('Logged in!!');
      conn.request(':user').subscribe(data => console.log(data));
    });
  }

}

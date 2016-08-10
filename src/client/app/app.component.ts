import {Component} from '@angular/core';
import {MainMenuComponent} from './layout/main-menu/main-menu.component';
import {AuthService} from './general/auth.service';
/*
 APP
 */

@Component({
  selector    : 'my-app',
  templateUrl : 'app/app.component.html',
  directives  : [MainMenuComponent],
  providers   : [AuthService],
  styleUrls   : ['app/app.component.css']
})

export class AppComponent {

  constructor(private auth: AuthService) {
    auth.fetchAuth().then(() => {
      console.log('Logged in!!');
    });
  }

}

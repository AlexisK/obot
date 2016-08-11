import {Component} from '@angular/core';
import {mainMenuService} from "../../layout/main-menu/main-menu.service";


@Component({
  selector    : 'page-orm-users',
  templateUrl : 'app/modules/orm-users/orm-users.component.html',
  styleUrls   : ['app/modules/orm-users/orm-users.component.css']
})

export class ORMUsersComponent {
  constructor() {

  }
}

mainMenuService.registerButton('/orm/users', 'Users', 'ORM');
export const route = {path : 'orm/users', component : ORMUsersComponent};




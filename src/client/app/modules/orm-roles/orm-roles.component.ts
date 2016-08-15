import {Component} from '@angular/core';
import {mainMenuService} from "../../layout/main-menu/main-menu.service";


@Component({
  selector    : 'page-orm-roles',
  templateUrl : 'app/modules/orm-roles/orm-roles.component.html',
  styleUrls   : ['app/modules/orm-roles/orm-roles.component.css']
})

export class ORMRolesComponent {
  constructor() {

  }
}

mainMenuService.registerButton('orm/roles', 'Roles', 'ORM');
export const route = {path : 'orm/roles', component : ORMRolesComponent};




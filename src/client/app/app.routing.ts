import {Routes, RouterModule} from '@angular/router';
import {route as dashboard} from './modules/dashboard/dashboard.component';
import {route as ormUsers} from './modules/orm-users/orm-users.component';
import {route as ormRoles} from './modules/orm-roles/orm-roles.component';
import {route as settingsModules} from './modules/settings/settings-modules.component';

const appRoutes : Routes = [
  dashboard,
  ormUsers,
  ormRoles,
  settingsModules
];

export const appRoutingProviders : any[] = [];

export const routing = RouterModule.forRoot(appRoutes);

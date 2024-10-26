import { Routes } from '@angular/router';

import { SecurityComponent } from './security/security.component';
import { PermissionComponent } from './security/permission/permission.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'screenmanagement',
        component: SecurityComponent
      }, {
        path: 'permissions',
        component: PermissionComponent
      }
    ]
  }
];

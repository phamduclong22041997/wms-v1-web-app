import { Routes } from '@angular/router';
import { POListComponent } from './pages/po-list/component';
export const MasanPORoutes: Routes = [
  {
    path: 'list',
    data: { title: 'PO List' },
    component: POListComponent
  },
];

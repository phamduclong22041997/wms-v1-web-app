import { Routes } from '@angular/router';
import { ListSOComponent } from './pages/so-list/component';
export const MasanSTORoutes: Routes = [
  {
    path: 'list',
    data: { title: 'SO List' },
    component: ListSOComponent
  }
];

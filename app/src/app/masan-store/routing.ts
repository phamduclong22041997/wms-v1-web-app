/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Routes } from '@angular/router';
import { MasanStoreListComponent } from './pages/list/component';
// import { MasanStoreViewComponent } from './pages/view/component';

export const MasanStoreRoutes: Routes = [
  {
    path: '',
    data: { title: 'Danh sách cửa hàng Masan' },

    component: MasanStoreListComponent
  },
  {
    path: 'list',
    data: { title: 'Danh sách cửa hàng Masan' },
    component: MasanStoreListComponent
  }
];

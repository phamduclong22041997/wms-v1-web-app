/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Routes } from '@angular/router';
import { MasanProductListComponent } from './pages/list/component';
import { MasanProductInStoreComponent } from './pages/productinstore/component';

export const MasanProductRoutes: Routes = [
  {
    path: '',
    data: { title: 'Danh sách sản phẩm' },
    component: MasanProductListComponent
  },
  {
    path: 'productinstore/:code',
    data: { title: 'Danh sách sản phẩm trong cửa hàng' },
    component: MasanProductInStoreComponent
  }
];

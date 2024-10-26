/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Routes } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/component';
import { SOHandoverComponent } from './pages/sohandover/component';
import { ProductClaimComponent } from './pages/product-claim/component';
import { ProductClaimDetailComponent } from './pages/product-claim-detail/component';

export const MasanRoutes: Routes = [
  {
    path: 'manager/sohandover',
    data: { title: 'In phiếu xuất kho / Mã kiện thùng', parentTitle: "Quản lý In ấn" },
    component: SOHandoverComponent
  },
  {
    path: 'manager/product-claim',
    data: { title: 'Quản lý hàng hư hỏng, hết date', parentTitle: "Quản lý hàng hoá" },
    component: ProductClaimComponent
  },
  {
    path: 'manager/product-claim/:productclaim',
    data: { title: 'Quản lý hàng hư hỏng, hết date', parentTitle: "Quản lý hàng hoá" },
    component: ProductClaimDetailComponent
  },
  {
    path: 'user/change-password',
    data: { title: 'Thay đổi mật khẩu', parentTitle: "Quản lý tài khoản" },
    component: ChangePasswordComponent
  }
];

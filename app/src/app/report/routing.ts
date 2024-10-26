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
import { BinInventoryComponent } from './pages/bin-inventory/component';
import { SODetailComponent } from './pages/sodetail/component';
import { TransportUndockComponent } from './pages/transport-undock/component';
import { PODetailComponent } from './pages/podetail/component';
import { PickingwaveListComponent } from './pages/pickingwave/component';
import { PickingwaveDetailComponent } from './pages/pickingwave-detail/component';
import { IssueListComponent } from './pages/issue/component';
import { AutoProcessComponent } from './pages/auto-process/component';
import { BalanceTransComponent } from './pages/balance-trans/component';
import { POReceiveComponent } from './pages/poreceive/component';
import { OpsJobComponent } from './pages/ops-job/component';
export const ReportRoutes: Routes = [
  {
    path: 'bin-inventory',
    data: { title: 'Danh sách sản phẩm' },
    component: BinInventoryComponent
  },
  {
    path: 'saleorder-detail',
    data: { title: 'Chi tiết đơn hàng xuất' },
    component: SODetailComponent
  },
  {
    path: 'transport-undock',
    data: { title: 'Chi tiết Transport chưa Dock vào BIN/POINT' },
    component: TransportUndockComponent
  },
  {
    path: 'purchaseorder-detail',
    data: { title: 'Chi tiết đơn hàng nhập' },
    component: PODetailComponent
  },
  {
    path: 'saleorder/pw-list',
    data: { title: 'Danh sách phiên lấy hàng đóng gói tự động' },
    component: PickingwaveListComponent
  },
  {
    path: 'saleorder/pw-detail/:code',
    data: { title: 'Chi tiết phiên lấy hàng đóng gói tự động' },
    component: PickingwaveDetailComponent
  },
  {
    path: 'report/issue',
    data: { title: 'Danh sách Issue' },
    component: IssueListComponent
  },
  {
    path: 'report/auto-process',
    data: { title: 'Danh sách xử lý tự động' },
    component: AutoProcessComponent
  },
  {
    path: 'report/balance-trans',
    data: { title: 'Chi tiết giao dịch theo SKU' },
    component: BalanceTransComponent
  },
  {
    path: 'purchaseorder-receive',
    data: { title: 'Chi tiết đơn hàng nhập' },
    component: POReceiveComponent
  },
  {
    path: 'report/ops-job',
    data: { title: 'Báo cáo công việc' },
    component: OpsJobComponent
  },
];

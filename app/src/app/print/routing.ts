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

import { PrintMultiDeviceComponent } from './pages/multi-pallet/component';
import { PrintSOHandoverComponent } from './pages/sohandover/component';
import { ExportDelivery } from './pages/export-delivery/component';

export const MasanRoutes: Routes = [
  {
    path: 'transport',
    data: { title: 'Tạo / In Số lượng lớn Thiết bị vận chuyển', parentTitle: "In ấn" },
    component: PrintMultiDeviceComponent
  },
  {
    path: 'so-handover',
    data: { title: 'In phiếu xuất kho / Mã kiện thùng', parentTitle: "In ấn" },
    component: PrintSOHandoverComponent
  },
  {
    path: 'export-delivery',
    data: { title: 'Xuất Biên bản giao hàng', parentTitle: "In ấn" },
    component: ExportDelivery
  }
];

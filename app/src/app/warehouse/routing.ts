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

import { WarehouseQRCodeComponent } from './pages/qrcode/component';

export const WarehouseRoutes: Routes = [
  // {
  //   path: 'warehouses',
  //   data: { title: 'Point List' },
  //   component: PointListComponent
  // },
  {
    path: 'qrcode',
    data: { title: 'Show QRCode of WarehouseSiteId', parentTitle: "Warehouse Manager" },
    component: WarehouseQRCodeComponent
  }
];

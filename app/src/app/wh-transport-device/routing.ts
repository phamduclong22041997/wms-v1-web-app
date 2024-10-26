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

import { TransportDeviceListComponent } from './pages/transport-device-list/component';
import { TransportDeviceDetailComponent } from './pages/transport-device-details/component';

export const MasanPORoutes: Routes = [
  {
    path: 'transport-devices',
    data: { title: 'Transport Device List' },
    component: TransportDeviceListComponent
  },
  {
    path: 'transport-device/:code',
    data: { title: 'Details', parentTitle: "PHƯƠNG TIỆN VẬN CHUYỂN" },
    component: TransportDeviceDetailComponent
  }
];

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

import { PointListComponent } from './pages/point-list/component';
import { PointDetailComponent } from './pages/point-details/component';

export const MasanPORoutes: Routes = [
  {
    path: 'points',
    data: { title: 'Point List' },
    component: PointListComponent
  },
  {
    path: 'point/:code',
    data: { title: 'Details', parentTitle: "VỊ TRÍ LƯU TRỮ" },
    component: PointDetailComponent
  }
];

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

import { ZoneListComponent } from './pages/zone-list/component';
import { ZoneDetailComponent } from './pages/zone-details/component';

export const ZoneRoutes: Routes = [
  {
    path: 'zones',
    data: { title: 'Zone List' },
    component: ZoneListComponent
  },
  {
    path: 'zone/:code',
    data: { title: 'Details', parentTitle: "VỊ TRÍ LƯU TRỮ" },
    component: ZoneDetailComponent
  }
];

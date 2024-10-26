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

import { BinListComponent } from './pages/bin-list/component';
import { BinDetailComponent } from './pages/bin-details/component';

export const MasanPORoutes: Routes = [
  {
    path: 'bins',
    data: { title: 'Bin List' },
    component: BinListComponent
  },
  {
    path: 'bin/:code',
    data: { title: 'Details', parentTitle: "BIN LƯU TRỮ" },
    component: BinDetailComponent
  }
];

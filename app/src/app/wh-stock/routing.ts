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

import { StockListComponent } from './pages/stock-list/component';

export const MasanPORoutes: Routes = [
  {
    path: 'stocks',
    data: { title: 'Stocks List' },
    component: StockListComponent
  }
];

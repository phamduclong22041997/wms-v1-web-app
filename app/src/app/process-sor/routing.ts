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
import { ListSORComponent } from './pages/sor-list/component';
import { SORDetailsComponent } from './pages/sor-details/component';

export const SORRoutes: Routes = [
  {
    path: 'list',
    data: { title: 'SOR List' },
    component: ListSORComponent
  },
  {
    path: 'details/:SORCode',
    component: SORDetailsComponent,
    data: { title: 'Chi Tiết SOR' },
  },
];

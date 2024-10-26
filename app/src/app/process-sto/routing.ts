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
import { ListSOComponent } from './pages/so-list/component';
import { SoDetailsComponent } from './pages/so-details/component';

export const STORoutes: Routes = [
  {
    path: 'listso',
    data: { title: 'SO List' },
    component: ListSOComponent
  },
  {
    path: 'details/:SOCode',
    component: SoDetailsComponent,
    data: { title: 'Chi Tiết SO' },
  },
];

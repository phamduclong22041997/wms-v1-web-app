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
import { ListBookingComponent } from './pages/list/component';
import { UploadBookingComponent } from './pages/upload/component';

export const SORRoutes: Routes = [
  {
    path: 'list',
    data: { title: 'Booking List' },
    component: ListBookingComponent
  },
  {
    path: 'upload',
    component: UploadBookingComponent,
    data: { title: 'Upload Booking' },
  },
];

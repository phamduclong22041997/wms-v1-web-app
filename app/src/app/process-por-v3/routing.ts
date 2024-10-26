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
import { PORDetailsComponent } from './pages/so-details/component';

//Pick pack
import { SOAutoPickPackComponent } from './pages/auto-pick-pack/component';
import { SOAutoPickPackListComponent } from './pages/auto-pick-pack-list/component';
import { PickingwaveListComponent } from './pages/pickingwave/component';
import { PickingwaveDetailComponent } from './pages/pickingwave-detail/component';
import { SOAutoPickPackDetailsComponent } from './pages/auto-pick-pack-details/component';
import { AssignPointComponent } from './pages/assign-points/component';
import { AssignPickListComponent } from './pages/assign-picklist/component';
import { TaskProcessListComponent } from './pages/task-process/component';
import { SOPackingComponent } from './pages/packing/component';
import { SOAutoPickPackConfirmListComponent } from './pages/auto-pick-pack-confirm-list/component';
import { CancelPickListComponent } from './pages/auto-pick-pack-cancel-list/component';

export const PORRoutes: Routes = [
  {
    path: 'list',
    data: { title: 'SO List', url: "por/listso" },
    component: ListSOComponent
  },
  {
    path: 'details/:SOCode',
    component: PORDetailsComponent,
    data: { title: '', showReloadIcon: true },
  },
  
  //Pick pack
  {
    path: 'create-auto-pickpack',
    data: { title: 'Auto Pick Pack' },
    component: SOAutoPickPackComponent
  },
  {
    path: 'auto-pickpack',
    data: { title: 'Auto Pick Pack List' },
    component: SOAutoPickPackListComponent
  },
  {
    path: 'auto-pickpack/:code',
    data: { title: 'CHI TIẾT LẤY HÀNG' },
    component: SOAutoPickPackDetailsComponent
  },

  {
    path: 'pw-list',
    data: { title: 'Danh sách phiên lấy hàng đóng gói tự động' },
    component: PickingwaveListComponent
  },
  {
    path: 'pw-detail/:code',
    data: { title: 'Chi tiết phiên lấy hàng đóng gói tự động' },
    component: PickingwaveDetailComponent
  },
  {
    path: 'assign-points',
    data: { title: 'Assign Points' },
    component: AssignPointComponent
  },
  {
    path: 'assign-picklist',
    data: { title: 'Assign PickList' },
    component: AssignPickListComponent
  },
  {
    path: 'task-process',
    data: { title: 'Task Process' },
    component: TaskProcessListComponent
  },

  {
    path: 'packing',
    data: { title: 'Packing' },
    component: SOPackingComponent
  },
  {
    path: 'packing/:code',
    data: { title: 'Packing' },
    component: SOPackingComponent
  },
  {
    path: 'auto-pickpack-confirm',
    data: { title: 'Auto Pick Pack Confirm List' },
    component: SOAutoPickPackConfirmListComponent
  },
  {
    path: 'cancel-picklist',
    data: { title: 'Cancel List' },
    component: CancelPickListComponent
  },
];

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
import { ListLostComponent } from './pages/lost-list/component';
import { ListFoundComponent } from './pages/found-list/component';
import { CreateLostComponent } from './pages/lost-create/component';
import { LostDetailComponent } from './pages/lost-detail/component';
import { CreateFoundComponent } from './pages/found-create/component';
import { FoundDetailComponent } from './pages/found-detail/component';
import { MappingLostFoundComponent } from './pages/lost-found-mapping/component';
import { MappingLostFoundCreateComponent } from './pages/lost-found-mapping-create/component';
import { MappingLostFoundSessionComponent } from './pages/lost-found-mapping-session/component';
import { MappingLostFoundSessionDetailsComponent } from './pages/lost-found-mapping-session-details/component';
import { TransferLostFoundComponent } from './pages/lost-found-transfer/component';
import { TransferLostFoundSessionDetailsComponent } from './pages/lost-found-transfer-details/component';
import { ImportProcessLostFoundComponent } from './pages/lost-found-import/component';
import { CreateTransferLostComponent } from './pages/transfer-lost-create/component';
import { CreateTransferLostDetailComponent } from './pages/transfer-lost-create-detail/component';
import { ListTransferLostComponent } from './pages/transfer-lost-list/component';
import { DetailTransferLostComponent } from './pages/transfer-lost-detail/component';

export const LostFoundRoutes: Routes = [
  {
    path: 'lost-found-import',
    data: { title: 'Found List' },
    component: ImportProcessLostFoundComponent
  },
  {
    path: 'found-list',
    data: { title: 'Found List' },
    component: ListFoundComponent
  },
  {
    path: 'found-detail/:code',
    data: { title: 'Found Details' },
    component: FoundDetailComponent
  },
  {
    path: 'found-create',
    data: { title: 'Found Create' },
    component: CreateFoundComponent
  },
  {
    path: 'lost-list',
    data: { title: 'List Lost Issue' },
    component: ListLostComponent
  },
  {
    path: 'lost-create',
    data: { title: 'Create Lost Issue' },
    component: CreateLostComponent
  },
  {
    path: 'lost-detail/:code',
    data: { title: 'Lost Issue Detail' },
    component: LostDetailComponent
  },
  {
    path: 'mapping-lost-found',
    data: {title: 'Mapping Lost-found'},
    component: MappingLostFoundComponent
  },
  {
    path: 'mapping-lost-found/:code',
    data: {title: 'Mapping Lost-found Create'},
    component: MappingLostFoundCreateComponent
  },
  {
    path: 'mapping-lost-found-session',
    data: {title: 'Mapping Lost-found Sessions'},
    component: MappingLostFoundSessionComponent
  },
  {
    path: 'mapping-lost-found-session/:code',
    data: {title: 'Mapping Lost-found Session details'},
    component: MappingLostFoundSessionDetailsComponent
  },
  {
    path: 'transfer-lost-found',
    data: {title: 'Transfer lost-found'},
    component: TransferLostFoundComponent
  },
  {
    path: 'transfer-lost-found/:code',
    data: {title: 'Transfer lost-found details'},
    component: TransferLostFoundSessionDetailsComponent
  },
  {
    path: 'create-transfer-lost',
    data: {title: 'Transfer lost'},
    component: CreateTransferLostComponent
  },
  {
    path: 'create-transfer-lost/:code',
    data: {title: 'Transfer lost details'},
    component: CreateTransferLostDetailComponent
  },
  {
    path: 'transfer-lost',
    data: {title: 'Transfer lost list'},
    component: ListTransferLostComponent
  },
  {
    path: 'transfer-lost/:code',
    data: {title: 'Transfer lost details'},
    component: DetailTransferLostComponent
  }
];

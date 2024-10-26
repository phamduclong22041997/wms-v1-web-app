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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterModule } from '@angular/router';
import { ReportRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { BinInventoryComponent } from './pages/bin-inventory/component';
import { SODetailComponent } from './pages/sodetail/component';
import { PODetailComponent } from './pages/podetail/component';
import { TransportUndockComponent } from './pages/transport-undock/component';
import { PickingwaveListComponent } from './pages/pickingwave/component';
import { PickingwaveDetailComponent } from './pages/pickingwave-detail/component';
import { IssueListComponent } from './pages/issue/component';
import { AutoProcessComponent } from './pages/auto-process/component';
import { BalanceTransComponent } from './pages/balance-trans/component';
import { POReceiveComponent } from './pages/poreceive/component';
import { OpsJobComponent } from './pages/ops-job/component';

@NgModule({
  declarations: [
    BinInventoryComponent,
    SODetailComponent,
    PODetailComponent,
    TransportUndockComponent,
    PickingwaveListComponent,
    PickingwaveDetailComponent,
    IssueListComponent,
    AutoProcessComponent,
    BalanceTransComponent,
    POReceiveComponent,
    OpsJobComponent
  ],
  entryComponents: [
    BinInventoryComponent,
    SODetailComponent,
    PODetailComponent,
    TransportUndockComponent,
    PickingwaveListComponent,
    PickingwaveDetailComponent,
    IssueListComponent,
    BalanceTransComponent,
    POReceiveComponent,
    OpsJobComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(ReportRoutes)
  ]
})
export class ReportModule { }

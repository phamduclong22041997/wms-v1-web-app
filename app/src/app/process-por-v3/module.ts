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
import { PORRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';

import { ConfirmExportComponent } from './confirm/component';
import { ListSOComponent } from './pages/so-list/component';
import { PORDetailsComponent } from './pages/so-details/component';
import { ConfirmPrintLabelComponent } from './pages/so-details/confirm-print/component';

//Pick pack
import { ConfirmCreatePicklistComponent } from './pages/auto-pick-pack/confirm/component';
import { SOAutoPickPackComponent } from './pages/auto-pick-pack/component';
import { PointsComponent } from './points/component';
import { SOAutoPickPackListComponent } from './pages/auto-pick-pack-list/component';

import { PickingwaveListComponent } from './pages/pickingwave/component';
import { PickingwaveDetailComponent } from './pages/pickingwave-detail/component';

import { SOAutoPickPackDetailsComponent } from './pages/auto-pick-pack-details/component';
import { AssignPointComponent } from './pages/assign-points/component';
import { AssignPickListComponent } from './pages/assign-picklist/component';
import { ConfirmEmployeeComponent } from './pages/assign-picklist/confirm/component';
import { TaskProcessListComponent } from './pages/task-process/component';
import { ConfirmTaskProcessListComponent } from './pages/task-process/confirm/component';

import { SOPackingComponent } from './pages/packing/component';
import { ConfirmPackingPrintLabelComponent } from './pages/packing/confirm-print/component';
import { ConfirmQtyComponent } from './pages/packing/confirmQty/component';
import { PackageEvenComponent } from './pages/packing/packageEven/component';
import { StationComponent } from './pages/packing/station/station.component';
import { SOAutoPickPackConfirmListComponent } from './pages/auto-pick-pack-confirm-list/component';
import { CancelPickListComponent } from './pages/auto-pick-pack-cancel-list/component';
import { ConfirmSkipComponent } from './pages/auto-pick-pack-confirm-list/confirm/component';

@NgModule({
  declarations: [
    ConfirmExportComponent,
    ListSOComponent,
    PORDetailsComponent,
    ConfirmPrintLabelComponent,

    //Pick pack
    ConfirmCreatePicklistComponent,
    SOAutoPickPackComponent,
    PointsComponent,
    SOAutoPickPackListComponent,
    PickingwaveListComponent,
    PickingwaveDetailComponent,
    SOAutoPickPackDetailsComponent,
    AssignPointComponent,
    AssignPickListComponent,
    ConfirmEmployeeComponent,
    ConfirmTaskProcessListComponent,
    TaskProcessListComponent,
    SOPackingComponent,
    ConfirmPackingPrintLabelComponent,
    ConfirmQtyComponent,
    PackageEvenComponent,
    StationComponent,
    SOAutoPickPackConfirmListComponent,
    CancelPickListComponent,
    ConfirmSkipComponent
  ],
  entryComponents: [
    ConfirmExportComponent,
    ConfirmPrintLabelComponent,
    //Pick pack
    ConfirmCreatePicklistComponent,
    PointsComponent,
    ConfirmEmployeeComponent,
    ConfirmTaskProcessListComponent,
    ConfirmPackingPrintLabelComponent,
    ConfirmQtyComponent,
    PackageEvenComponent,
    StationComponent,
    CancelPickListComponent,
    ConfirmSkipComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(PORRoutes),
    NgImageSliderModule
  ]
})
export class ProcessPORModule { }

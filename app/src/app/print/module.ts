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
import { MasanRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { PrintMultiDeviceComponent } from './pages/multi-pallet/component';
import { PrintSOHandoverComponent } from './pages/sohandover/component';
import { ConfirmUpdateComponent } from './pages/sohandover/confirm/component';
import { ConfirmPrintLabelComponent } from './pages/sohandover/confirm-print/component';
import { ConfirmExportComponent } from './confirm/component';
import { ExportDelivery } from './pages/export-delivery/component';

@NgModule({
  declarations: [
    PrintMultiDeviceComponent,
    ConfirmExportComponent,
    PrintSOHandoverComponent,
    ConfirmUpdateComponent,
    ConfirmPrintLabelComponent,
    ExportDelivery
  ],
  entryComponents: [
    ConfirmExportComponent,
    ConfirmUpdateComponent,
    ConfirmPrintLabelComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanRoutes),
    NgImageSliderModule
  ]
})
export class PrintModule { }

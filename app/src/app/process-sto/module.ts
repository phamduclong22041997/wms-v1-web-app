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
import { STORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';

import { ConfirmExportComponent } from './confirm/component';
import { ListSOComponent } from './pages/so-list/component';
import { SoDetailsComponent } from './pages/so-details/component';
import { ConfirmPrintLabelComponent } from './pages/so-details/confirm-print/component';

@NgModule({
  declarations: [
    ConfirmExportComponent,
    ListSOComponent,
    SoDetailsComponent,
    ConfirmPrintLabelComponent
  ],
  entryComponents: [
    ConfirmExportComponent,
    ListSOComponent,
    SoDetailsComponent,
    ConfirmPrintLabelComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(STORoutes),
    NgImageSliderModule
  ]
})
export class ProcessSTOModule { }

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
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { DockPalletComponent } from './dock-pallet/component';
import { TransportDeviceListComponent } from './pages/transport-device-list/component';
import { TransportDeviceDetailComponent } from './pages/transport-device-details/component';


@NgModule({
  declarations: [
    TransportDeviceListComponent,
    TransportDeviceDetailComponent,
    DockPalletComponent
  ],
  entryComponents: [DockPalletComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanPORoutes)
  ],
  exports: [DockPalletComponent]
})
export class TransportDeviceModule { }

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
import { ZoneRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';

import { ZoneListComponent } from './pages/zone-list/component';
import { ZoneDetailComponent } from './pages/zone-details/component';


@NgModule({
  declarations: [
    ZoneListComponent,
    ZoneDetailComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(ZoneRoutes),
    NgImageSliderModule
  ]
})
export class ZoneModule { }

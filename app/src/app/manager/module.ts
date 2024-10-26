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
import { SOHandoverComponent } from './pages/sohandover/component';
import { ConfirmUpdateComponent } from './pages/sohandover/confirm/component';
import { ConfirmExportComponent } from './confirm/component';
import { ChangePasswordComponent } from './pages/change-password/component';
import { ProductClaimComponent } from './pages/product-claim/component';
import { ProductClaimDetailComponent } from './pages/product-claim-detail/component';
import { UploadProductClaimComponent } from './pages/product-claim/confirm/component';

@NgModule({
  declarations: [
    ConfirmExportComponent,
    SOHandoverComponent,
    ConfirmUpdateComponent,
    ChangePasswordComponent,
    ProductClaimComponent,
    ProductClaimDetailComponent,
    UploadProductClaimComponent
  ],
  entryComponents: [
    ConfirmExportComponent,
    ConfirmUpdateComponent,
    ChangePasswordComponent,
    ProductClaimComponent,
    ProductClaimDetailComponent,
    UploadProductClaimComponent
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

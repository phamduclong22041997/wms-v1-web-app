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
import { LostFoundRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { ListLostComponent } from './pages/lost-list/component';
import { ListFoundComponent } from './pages/found-list/component';
import { CreateLostComponent } from './pages/lost-create/component';
import { LostDetailComponent } from './pages/lost-detail/component';
import { ConfirmCancelLostIssueComponent } from './pages/lost-detail/confirm/component';
import { CreateFoundComponent } from './pages/found-create/component';
import { FoundDetailComponent } from './pages/found-detail/component';
import { ConfirmItemFoundComponent } from './pages/found-create/confirm/component';

import { MappingLostFoundComponent } from './pages/lost-found-mapping/component';
import { MappingLostFoundCreateComponent } from './pages/lost-found-mapping-create/component';

import { MappingLostFoundSessionComponent } from './pages/lost-found-mapping-session/component';
import { MappingLostFoundSessionDetailsComponent } from './pages/lost-found-mapping-session-details/component';

import { TransferLostFoundComponent } from './pages/lost-found-transfer/component';
import { TransferLostFoundSessionDetailsComponent } from './pages/lost-found-transfer-details/component';

import { NgImageSliderModule } from 'ng-image-slider';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShowListErrorFoundComponent } from './pages/found-create/showErrors/component';
import { ConfirmCancelFoundIssueComponent } from './pages/found-detail/confirm/component';
import { ImportProcessLostFoundComponent } from './pages/lost-found-import/component';
import { CreateTransferLostComponent } from './pages/transfer-lost-create/component';
import { CreateTransferLostDetailComponent } from './pages/transfer-lost-create-detail/component';
import { ListTransferLostComponent } from './pages/transfer-lost-list/component';
import { DetailTransferLostComponent } from './pages/transfer-lost-detail/component';
@NgModule({
  declarations: [
    ListLostComponent,
    ListFoundComponent,
    CreateLostComponent,
    LostDetailComponent,
    ConfirmCancelLostIssueComponent,
    ConfirmCancelFoundIssueComponent,
    CreateFoundComponent,
    FoundDetailComponent,
    ConfirmItemFoundComponent,
    MappingLostFoundComponent,
    ShowListErrorFoundComponent,
    MappingLostFoundCreateComponent,
    MappingLostFoundSessionComponent,
    MappingLostFoundSessionDetailsComponent,
    TransferLostFoundComponent,
    TransferLostFoundSessionDetailsComponent,
    ImportProcessLostFoundComponent,
    CreateTransferLostComponent,
    CreateTransferLostDetailComponent,
    ListTransferLostComponent,
    DetailTransferLostComponent
  ],
  entryComponents: [
    ConfirmCancelLostIssueComponent,
    ConfirmItemFoundComponent,
    ShowListErrorFoundComponent,
    ConfirmCancelFoundIssueComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(LostFoundRoutes),
    NgImageSliderModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class ProcessLostFoundModule { }

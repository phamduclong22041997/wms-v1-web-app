/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterModule } from '@angular/router';
import { MasanStoreRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { MasanStoreListComponent } from './pages/list/component';
import { MasanStoreViewComponent } from './pages/view/component';
import { ViewDetailsComponent } from './popup-viewDetails/item.component';
import { CreateStoreComponent } from './popup-create/item.component';
import { CreateAddressComponent } from './create-address/item.component';
import { EditStoreComponent } from './popup-edit/item.component';
// import { ImportStoreComponent } from './popup-import/item.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImportStoreComponent } from './popup-import/item.component';


@NgModule({
  declarations: [
    MasanStoreListComponent,
    MasanStoreViewComponent,
    CreateStoreComponent,
    CreateAddressComponent,
    EditStoreComponent,
    ImportStoreComponent,
    ViewDetailsComponent
  ],
  entryComponents: [
    MasanStoreListComponent, 
    MasanStoreViewComponent,
    CreateStoreComponent,
    EditStoreComponent, 
    CreateAddressComponent,
     ImportStoreComponent,
     ViewDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanStoreRoutes),
    NgImageSliderModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class MasanStoreModule { }

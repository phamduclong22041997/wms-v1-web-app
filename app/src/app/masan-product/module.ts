/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterModule } from '@angular/router';
import { MasanProductRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { MasanProductListComponent } from './pages/list/component';
import { MasanProductInStoreComponent } from './pages/productinstore/component';

import { NgImageSliderModule } from 'ng-image-slider';
import { EditProductComponent } from './popup-edit/item.component';

@NgModule({
  declarations: [
    MasanProductListComponent, MasanProductInStoreComponent, EditProductComponent
  ],
  entryComponents: [
    MasanProductListComponent, MasanProductInStoreComponent, EditProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanProductRoutes),
    NgImageSliderModule
  ]
})
export class MasanProductModule { }

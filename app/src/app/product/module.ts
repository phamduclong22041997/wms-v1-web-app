/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterModule } from '@angular/router';
import { ProductRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { ProductListComponent } from './pages/list/component';
import { ProductInStoreComponent } from './pages/productinstore/component';

import { NgImageSliderModule } from 'ng-image-slider';
import { ProductDetailComponent } from './pages/details/component';
import { EditProductComponent } from './popup-edit/item.component';
import { ConfirmTotalPrintComponent } from './pages/confirm-print/component';
import { AdjustProductListComponent } from './pages/adjust-product-list/component';
import { CreateProductListComponent } from './pages/adjust-product-create/component';
import { ConfirmAdjustProductExpiredDateComponent } from './pages/adjust-product-create/confirm/component';
import { AdjustProductDetailComponent } from './pages/adjust-product-detail/component';


@NgModule({
  declarations: [
    ProductListComponent, 
    ProductInStoreComponent, 
    EditProductComponent, 
    ProductDetailComponent, 
    ConfirmTotalPrintComponent,
    AdjustProductListComponent,
    CreateProductListComponent,
    ConfirmAdjustProductExpiredDateComponent,
    AdjustProductDetailComponent
  ],
  entryComponents: [
    ProductListComponent, 
    ProductInStoreComponent, 
    EditProductComponent, 
    ProductDetailComponent, 
    ConfirmTotalPrintComponent,
    AdjustProductListComponent,
    CreateProductListComponent,
    ConfirmAdjustProductExpiredDateComponent,
    AdjustProductDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(ProductRoutes),
    NgImageSliderModule
  ]
})
export class ProductModule { }

/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2020/08
 */

import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/list/component';
import { ProductInStoreComponent } from './pages/productinstore/component';
import { ProductDetailComponent } from './pages/details/component';
import { AdjustProductListComponent } from './pages/adjust-product-list/component';
import { CreateProductListComponent } from './pages/adjust-product-create/component';
import { AdjustProductDetailComponent } from './pages/adjust-product-detail/component';

export const ProductRoutes: Routes = [
  {
    path: '',
    data: { title: 'Danh sách sản phẩm' },
    component: ProductListComponent
  },
  {
    path: 'productinstore/:sku',
    data: { title: 'Danh sách sản phẩm trong cửa hàng' },
    component: ProductInStoreComponent  
  },
  {
    path: 'adjust-product',
    data: { title: 'Danh sách phiên điều chỉnh HSD' },
    component: AdjustProductListComponent  
  },
  {
    path: 'adjust-product/:code',
    data: { title: 'Phiên điều chỉnh HSD' },
    component: AdjustProductDetailComponent  
  },
  {
    path: 'adjust-product-create',
    data: { title: 'Tạo phiên điều chỉnh HSD' },
    component: CreateProductListComponent  
  },
  {
    path: ':client/:dc/:sku',
    data: { title: 'Thông tin chi tiết sản phẩm' },
    component: ProductDetailComponent
  }
];

import { Routes } from '@angular/router';
import { ViewPOListComponent } from './pages/plainning-view-list/view-po-list/component';
import { ViewSTOListComponent } from './pages/plainning-view-list/view-sto-list/component';
// import { POPromotionListComponent } from './list/component';
import { POListComponent } from './pages/planning-po-list/component';
import { STOListComponent } from './pages/planning-sto-list/component';
import { UploadPOPromotionComponent } from './pages/planning-upload-po/component';
import { UploadSTOComponent } from './pages/planning-upload-sto/component';
// import { POReportComponent } from './po-report/component';
import { RocketUploadComponent } from './pages/rocket-upload/component';
import { RocketComponent } from './pages/rocket/component';

export const MasanPORoutes: Routes = [
  {
    path: 'rocket-list',
    data: { title: 'Rocket' },
    component: RocketComponent
  },
  {
    path: 'rocket-upload',
    data: { title: 'Rocket' },
    component: RocketUploadComponent
  },
  {
    path: 'planning-po-upload',
    data: { title: 'Import PO Promotion' },
    component: UploadPOPromotionComponent
  },
  {
    path: 'planning-po-list',
    data: { title: 'Listing SKU' },
    component: POListComponent
  },
  {
    path: 'planning-sto-upload',
    data: { title: 'Import STO Promotion' },
    component: UploadSTOComponent
  },
  {
    path: 'planning-sto-list',
    data: { title: 'Import STO Promotion' },
    component: STOListComponent
  },

  {
    path: 'view-sto-list',
    data: { title: 'Import STO Promotion' },
    component: ViewSTOListComponent
  },

  {
    path: 'view-po-list',
    data: { title: 'Import STO Promotion' },
    component: ViewPOListComponent
  },
];

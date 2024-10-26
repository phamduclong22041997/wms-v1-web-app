import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { POPromotionListComponent } from './list/component';
import { UploadPOPromotionComponent } from './pages/planning-upload-po/component';
import { ConfirmExportComponent } from './confirm/component';
import { UploadSTOComponent } from './pages/planning-upload-sto/component';
import { POListComponent } from './pages/planning-po-list/component';
import { STOListComponent } from './pages/planning-sto-list/component';
import { POReportComponent } from './po-report/component';
import { CreatePOComponent } from './pages/planning-po-list/create-po/component';
import { CreateSTOComponent } from './pages/planning-sto-list/create-sto/component';
import { RocketUploadComponent } from './pages/rocket-upload/component';
import { RocketComponent } from './pages/rocket/component';
import { AnalyzeSTOComponent } from './pages/rocket/analyze-sto/component';
import { ConfirmRocketUploadSTOComponent } from './pages/rocket-upload/confirm/component';
import { ViewSTOListComponent } from './pages/plainning-view-list/view-sto-list/component';
import { ViewPOListComponent } from './pages/plainning-view-list/view-po-list/component';

@NgModule({
  declarations: [
    POPromotionListComponent,
    UploadPOPromotionComponent,
    ConfirmExportComponent,
    UploadSTOComponent,
    POListComponent,
    STOListComponent,
    POReportComponent,
    CreatePOComponent,
    CreateSTOComponent,
    RocketUploadComponent,
    RocketComponent,
    ConfirmRocketUploadSTOComponent,
    AnalyzeSTOComponent,
    ViewSTOListComponent,
    ViewPOListComponent
  ],
  entryComponents: [
    ConfirmExportComponent,
    CreatePOComponent,
    CreateSTOComponent,
    ConfirmRocketUploadSTOComponent,
    AnalyzeSTOComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanPORoutes),
    NgImageSliderModule
  ]
})
export class RocketModule { }

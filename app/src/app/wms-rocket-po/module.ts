import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
// import { MasanPOComponent } from './../pages/po-upload/component';
import { POListComponent } from './pages/po-list/component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ConfirmComponent } from './confirm/component';

// import { POReceiptPalletComponent } from './pages/po-receive-pallet/component';
// import { ConfirmPOReceiveComponent } from './pages/po-receive-pallet/confirm/component';


@NgModule({
  declarations: [
    // MasanPOComponent,
    ConfirmComponent,
    POListComponent,
    // PoDetailsComponent,

    // POReceiptPalletComponent,
    // ConfirmPOReceiveComponent
  ],
  entryComponents: [
    // MasanPOComponent,
    ConfirmComponent,
    POListComponent,
    // PoDetailsComponent,
    // ConfirmPOReceiveComponent
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
export class RocketPOModule { }

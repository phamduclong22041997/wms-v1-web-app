import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { MasanPOComponent } from './pages/po-upload/component';
import { PoDetailsComponent } from './pages/po-details/component';
import { ListPOComponent } from './pages/po-list/component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ConfirmComponent } from './confirm/component';

import { POReceiptPalletComponent } from './pages/po-receive-pallet/component';
import { ConfirmPOReceiveComponent } from './pages/po-receive-pallet/confirm/component';
import { POAdjustComponent } from './pages/po-adjust/component';
import { confirmFinishPOSession } from './pages/po-details/confirm/component';
import { confirmPrint } from './pages/po-details/confirmprint/component';
import { ScheduleComponent } from './pages/po-receive-pallet/schedule/component';
import { POPalletComponent } from './pages/po-receive-pallet/pallet/component';
import { SelectProductComponent } from './pages/po-receive-pallet/select-product/component';
import { PopupAddSKUComponent } from './pages/popups/popup-add-sku/component';
import { PopupUploadProductImageComponent } from './pages/popups/popup-upload-file/component';
import { PopupPreviewProductImageComponent } from './pages/popups/popup-preview-img/component';



@NgModule({
  declarations: [
    MasanPOComponent,
    ConfirmComponent,
    ListPOComponent,
    PoDetailsComponent,
    POReceiptPalletComponent,
    ConfirmPOReceiveComponent,
    POAdjustComponent,
    confirmFinishPOSession,
    confirmPrint,
    ScheduleComponent,
    POPalletComponent,
    SelectProductComponent,
    PopupAddSKUComponent,
    PopupPreviewProductImageComponent,
    PopupUploadProductImageComponent
  ],
  entryComponents: [
    MasanPOComponent,
    ConfirmComponent,
    ListPOComponent,
    PoDetailsComponent,
    ConfirmPOReceiveComponent,
    confirmFinishPOSession,
    confirmPrint,
    ScheduleComponent,
    POPalletComponent,
    SelectProductComponent,
    PopupAddSKUComponent,
    PopupPreviewProductImageComponent,
    PopupUploadProductImageComponent
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
export class ProcessPOModule { }

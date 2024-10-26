import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import { MaterialModule } from '../material-module';
import { PageComponent } from './page/page.component';
import { PageSessionComponent } from './session/component';
import { PageHeaderComponent } from './page/header/header.component';
import { PageSessionHeaderComponent } from './session/header/header.component';
import { TableComponent } from './table/table.component';
import { EditTableComponent } from './table/edit-table.component';
import { TableHeaderComponent } from './table/header/header.component';
import { ModalComponent } from './modal/modal.component';
import { NotificationComponent } from './notification/notification.component';
import { ImageLightboxComponent } from './image-lightbox/image-lightbox.component';

import { ComboComponent } from './combo/combo.component';
import { ComboMultipleComponent } from './combomultiple/combomultiple.component';
import { AddressComponent } from './address/address.component';
import { ActionComponent } from './action/action.component';
import { FilterComponent } from './filter/filter.component';
import { UploadComponent } from './upload/upload.component';
import { DatePickerComponent } from './datepicker/datepicker.component';

import { ImportComponent } from './import/import.component';
import { PrinterComponent } from './printer/printer.component';
import { ConfirmCancelComponent } from './confirm-cancel/component';
import { ResetPasswordComponent } from "./reset-password/component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    PageComponent,
    PageHeaderComponent,
    PageSessionComponent,
    PageSessionHeaderComponent,
    TableComponent,
    TableHeaderComponent,
    ModalComponent,
    NotificationComponent,
    ImageLightboxComponent,
    ComboComponent,
    ComboMultipleComponent,
    DatePickerComponent,
    AddressComponent,
    ActionComponent,
    FilterComponent,
    EditTableComponent,
    UploadComponent,
    ImportComponent,
    PrinterComponent,
    ConfirmCancelComponent,
    ResetPasswordComponent
  ],
  entryComponents: [
    ModalComponent,
    NotificationComponent,
    ImageLightboxComponent,
    PrinterComponent,
    ConfirmCancelComponent,
    ResetPasswordComponent
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PageComponent,
    PageSessionComponent,
    PageSessionHeaderComponent,
    TableComponent,
    PageHeaderComponent,
    TableHeaderComponent,
    ModalComponent,
    NotificationComponent,
    ImageLightboxComponent,
    ComboComponent,
    ComboMultipleComponent,
    DatePickerComponent,
    AddressComponent,
    ActionComponent,
    FilterComponent,
    EditTableComponent,
    UploadComponent,
    ImportComponent
  ],
  // providers: [ToastService]
})
export class ComponentsModule {}

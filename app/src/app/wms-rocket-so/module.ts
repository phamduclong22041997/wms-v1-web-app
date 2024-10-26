import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanSTORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';

import { ConfirmExportComponent } from './confirm/component';
import { ListSOComponent } from './pages/so-list/component';


@NgModule({
  declarations: [
    ConfirmExportComponent,
    ListSOComponent,
  ],
  entryComponents: [
    ConfirmExportComponent,
    ListSOComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(MasanSTORoutes),
    NgImageSliderModule
  ]
})
export class RocketSOModule { }

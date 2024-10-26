import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { CreateBinComponent } from './popup-bin/item.component'

@NgModule({
  declarations: [
    CreateBinComponent,
  ],
  entryComponents: [CreateBinComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
  ]
})
export class CommonModalComponentModule {}

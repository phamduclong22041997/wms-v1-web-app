import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { ConfirmExportComponent } from './confirm/component';
import { CreateHandoverSessionComponent } from './pages/handover-session-create/component';
import { CreateHandoverSessionXDockComponent } from './pages/handover-session-xdock-create/component';
import { ConfirmHandoverXDockComponent } from './pages/handover-session-xdock-create/confirm/component';
import { HandoverListComponent } from './pages/handover-session-list/component';
import { HandoverDetailsComponent } from './pages/handover-detail/component';
// import { ConfirmTransportComponent } from './pages/handover-detail/confirm/component';



@NgModule({
  declarations: [
    CreateHandoverSessionComponent,
    HandoverListComponent,
    HandoverDetailsComponent,
    ConfirmExportComponent,
    CreateHandoverSessionXDockComponent,
    ConfirmHandoverXDockComponent
  ],
  entryComponents: [
    ConfirmExportComponent,
    ConfirmHandoverXDockComponent
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
export class ProcessHandoverModule { }

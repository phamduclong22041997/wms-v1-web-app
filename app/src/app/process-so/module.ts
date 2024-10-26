import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MasanPORoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';

import { ConfirmCreatePicklistComponent } from './pages/auto-pick-pack/confirm/component';
import { SOAutoPickPackComponent } from './pages/auto-pick-pack/component';
import { SOAutoPickPackListComponent } from './pages/auto-pick-pack-list/component';
import { SOAutoPickPackDetailsComponent } from './pages/auto-pick-pack-details/component';
import { SOAutoPickPackConfirmListComponent } from './pages/auto-pick-pack-confirm-list/component';
import { PointsComponent } from './points/component';
import { AssignPointComponent } from './pages/assign-points/component';
import { SOPackingComponent } from './pages/packing/component';
import { StationComponent } from './pages/packing/station/station.component';
import { PackageEvenComponent } from './pages/packing/packageEven/component';
import { ConfirmQtyComponent } from './pages/packing/confirmQty/component';
import { ConfirmPrintLabelComponent } from './pages/packing/confirm-print/component';
import { AssignPickListComponent } from './pages/assign-picklist/component';
import { ConfirmEmployeeComponent } from './pages/assign-picklist/confirm/component';
import { TaskProcessListComponent } from './pages/task-process/component';
import { ConfirmTaskProcessListComponent } from './pages/task-process/confirm/component';
import { TaskProcessDetailComponent } from './pages/task-process-details/component';
import { ConfirmSkipComponent } from './pages/auto-pick-pack-confirm-list/confirm/component';
import { CancelPickListComponent } from './pages/auto-pick-pack-cancel-list/component';
import { AssignPickListAutoComponent } from './pages/assign-picklist-auto/component';
import { AssignPickListAutoListComponent } from './pages/assign-picklist-auto-list/component';

@NgModule({
  declarations: [
    ConfirmCreatePicklistComponent,
    PointsComponent,
    SOAutoPickPackComponent,
    SOAutoPickPackListComponent,
    SOAutoPickPackDetailsComponent,
    SOAutoPickPackConfirmListComponent,
    AssignPointComponent,
    SOPackingComponent,
    StationComponent,
    PackageEvenComponent,
    ConfirmQtyComponent,
    ConfirmPrintLabelComponent,
    AssignPickListComponent,
    ConfirmEmployeeComponent,
    TaskProcessListComponent,
    ConfirmTaskProcessListComponent,
    TaskProcessDetailComponent,
    ConfirmSkipComponent,
    CancelPickListComponent,
    AssignPickListAutoComponent,
    AssignPickListAutoListComponent
  ],
  entryComponents: [
    ConfirmCreatePicklistComponent,
    PointsComponent,
    StationComponent,
    PackageEvenComponent,
    ConfirmQtyComponent,
    ConfirmPrintLabelComponent,
    ConfirmEmployeeComponent,
    ConfirmTaskProcessListComponent,
    ConfirmSkipComponent,
    CancelPickListComponent
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
export class ProcessSOModule { }

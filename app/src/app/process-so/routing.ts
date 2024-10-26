import { Routes } from '@angular/router';

import { SOAutoPickPackComponent } from './pages/auto-pick-pack/component';
import { SOAutoPickPackListComponent } from './pages/auto-pick-pack-list/component';
import { SOAutoPickPackDetailsComponent } from './pages/auto-pick-pack-details/component';
import { SOAutoPickPackConfirmListComponent } from './pages/auto-pick-pack-confirm-list/component';
import { AssignPointComponent } from './pages/assign-points/component';
import { SOPackingComponent } from './pages/packing/component';
import { AssignPickListComponent } from './pages/assign-picklist/component';
import { TaskProcessListComponent } from './pages/task-process/component';
import { TaskProcessDetailComponent } from './pages/task-process-details/component';
import { CancelPickListComponent } from './pages/auto-pick-pack-cancel-list/component';
import { AssignPickListAutoComponent } from './pages/assign-picklist-auto/component';
import { AssignPickListAutoListComponent } from './pages/assign-picklist-auto-list/component';

export const MasanPORoutes: Routes = [
  {
    path: 'create-auto-pickpack',
    data: { title: 'Auto Pick Pack' },
    component: SOAutoPickPackComponent
  },
  {
    path: 'auto-pickpack',
    data: { title: 'Auto Pick Pack List' },
    component: SOAutoPickPackListComponent
  },
  {
    path: 'auto-pickpack/:code',
    data: { title: 'Auto Pick Pack Details' },
    component: SOAutoPickPackDetailsComponent
  },
  {
    path: 'auto-pickpack-confirm',
    data: { title: 'Auto Pick Pack Confirm List' },
    component: SOAutoPickPackConfirmListComponent
  },
  {
    path: 'assign-points',
    data: { title: 'Assign Points' },
    component: AssignPointComponent
  }
  ,
  {
    path: 'packing',
    data: { title: 'Packing' },
    component: SOPackingComponent
  },
  {
    path: 'packing/:code',
    data: { title: 'Packing' },
    component: SOPackingComponent
  },  
  {
    path: 'assign-picklist',
    data: { title: 'Assign PickList' },
    component: AssignPickListComponent
  },
  {
    path: 'task-process',
    data: { title: 'Task Process' },
    component: TaskProcessListComponent
  },
  {
    path: 'task-process/:code/:type',
    data: { title: 'Task Process Detail' },
    component: TaskProcessDetailComponent
  },
  {
    path: 'cancel-picklist',
    data: { title: 'Cancel List' },
    component: CancelPickListComponent
  },
  {
    path: 'assign-picklist-auto',
    data: {title: 'Auto Assign Picklist'},
    component: AssignPickListAutoComponent
  },
  {
    path: 'assign-picklist-auto-list',
    data: {title: 'Auto Assign Picklist'},
    component: AssignPickListAutoListComponent
  },
];

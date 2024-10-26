import { Routes } from '@angular/router';

import { CreateHandoverSessionComponent } from './pages/handover-session-create/component';
import { CreateHandoverSessionXDockComponent } from './pages/handover-session-xdock-create/component';
import { HandoverListComponent } from './pages/handover-session-list/component';
import { HandoverDetailsComponent } from './pages/handover-detail/component';
export const MasanPORoutes: Routes = [
  {
    path: 'create-handover-session',
    data: { title: 'Create Handover Session' },
    component: CreateHandoverSessionComponent
  },
  {
    path: 'create-handover-session-xdock',
    data: { title: 'Create Handover XDock Session' },
    component: CreateHandoverSessionXDockComponent
  },
  {
    path: 'handover-sessions',
    data: { title: 'Create Handover Session' },
    component: HandoverListComponent
  },
  {
    path: 'handover-details/:Code/:Action',
    data: { title: 'Create Handover Session' },
    component: HandoverDetailsComponent
  }
];

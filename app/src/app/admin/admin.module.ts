import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AdminRoutes } from './admin.routing';

import { ComponentsModule } from './../components/components.module';
import { MaterialModule } from '../material-module';
import { SecurityComponent } from './security/security.component';
import { AccessControlNodeComponent } from './security/access-control-node/access-control-node.component';
import { RequestService } from './../shared/request.service';
import { PermissionComponent } from './security/permission/permission.component';
import { PermissionListComponent } from './security/permission-list/permission-list.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule
  ],
  declarations: [
    SecurityComponent,
    AccessControlNodeComponent,
    PermissionComponent,
    PermissionListComponent
  ],
  providers: [RequestService],
  entryComponents: [AccessControlNodeComponent]
})
export class AdminModule {}

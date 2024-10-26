import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './../material-module';
import { RouterModule } from '@angular/router';
import { DashboardsRoutes } from './dashboards.routing';
import { ComponentsModule } from './../components/components.module';

import { DefaultComponent } from './default/default.component';
@NgModule({
  imports: [
    ComponentsModule,
    RouterModule.forChild(DashboardsRoutes),
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [DefaultComponent]
})
export class DashboardsModule {}

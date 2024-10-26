import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TerminalRoutes } from './routing';
import { MaterialModule } from '../material-module';
import { ComponentsModule } from '../components/components.module';

import { TerminalBoardListComponent } from './board-list/component';

@NgModule({
  declarations: [
    TerminalBoardListComponent,
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(TerminalRoutes),
  ]
})
export class TerminalModule { }

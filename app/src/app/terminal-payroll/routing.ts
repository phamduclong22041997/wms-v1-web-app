import { Routes } from '@angular/router';
import { TerminalBoardListComponent } from './board-list/component';

export const TerminalRoutes: Routes = [
  {
    path: 'board-view',
    data: { title: 'Board Terminal' },
    component: TerminalBoardListComponent
  },


];

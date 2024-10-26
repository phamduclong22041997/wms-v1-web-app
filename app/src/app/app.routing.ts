/*
 * @copyright
 * Copyright (c) 2022 OVTeam
 *
 * All Rights Reserved
 *
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://choosealicense.com/licenses/mit/
 *
 */

import { Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './auth.guard';
import { TerminalLayoutComponent } from './terminal-payroll/layout/component';

const _appRoutes = [
    {
      path: '',
      component: DefaultComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: '',
          redirectTo: '/dashboard',
          pathMatch: 'full'
        },
        {
          path: '',
          loadChildren: './dashboards/dashboards.module#DashboardsModule'
        },
        {
          path: 'masan-store',
          loadChildren: './masan-store/module#MasanStoreModule'
        },
        {
          path: 'masan-product',
          loadChildren: './masan-product/module#MasanProductModule'
        },
        {
          path: 'product',
          loadChildren: './product/module#ProductModule'
        },
        {
          path: 'purchaseorder',
          loadChildren: './process-po/module#ProcessPOModule'
        },
        {
          path: 'saleorder',
          loadChildren: './process-so/module#ProcessSOModule'
        },
        {
          path: 'saleorder',
          loadChildren: './process-sto/module#ProcessSTOModule'
        },
        {
          path: 'handover',
          loadChildren: './process-handover/module#ProcessHandoverModule'
        },
        {
          path: 'rocket',
          loadChildren: './rocket/module#RocketModule'
        },
        {
          path: 'rocket-po',
          loadChildren: './wms-rocket-po/module#RocketPOModule'
        },
        {
          path: 'rocket-so',
          loadChildren: './wms-rocket-so/module#RocketSOModule'
        },
        
        {
          path: '',
          loadChildren: './wh-transport-device/module#TransportDeviceModule'
        },
        {
          path: '',
          loadChildren: './wh-point/module#PointModule'
        },
        {
          path: 'report',
          loadChildren: './wh-stock/module#StockModule'
        },
        {
          path: '',
          loadChildren: './wh-bin/module#BinModule'
        },
        {
          path: '',
          loadChildren: './wh-zone/module#ZoneModule'
        },
        {
          path: 'print',
          loadChildren: './print/module#PrintModule'
        },
        {
          path: 'report',
          loadChildren: './report/module#ReportModule'
        },
        {
          path: '',
          loadChildren: './manager/module#PrintModule'
        },
        {
          path: 'lost-found',
          loadChildren: './process-lost-found/module#ProcessLostFoundModule'
        },
        {
          path: '',
          loadChildren: './report/module#ReportModule'
        },
        {
          path: 'warehouse',
          loadChildren: './warehouse/module#WarehouseModule'
        }, 
        {
          path: 'booking',
          loadChildren: './booking/module#BookingModule'
        },
        {
          path: 'por',
          loadChildren: './process-por-v3/module#ProcessPORModule'
        },
        {
          path: 'sor',
          loadChildren: './process-sor-v3/module#ProcessSORModule'
        },
      ]
    },
    {
      path: 'admin',
      component: AppBlankComponent,
      children: [
        {
          component: DefaultComponent,
          path: '',
          loadChildren: './admin/admin.module#AdminModule'
        }
      ]
    },
    {
      path: 'authentication',
      component: AppBlankComponent,
      children: [
        {
          component: DefaultComponent,
          path: '',
          loadChildren:
            './authentication/authentication.module#AuthenticationModule'
        }
      ]
    },
    {
      path: "",
      component: TerminalLayoutComponent,
      children: [
        {
          path: 'payroll',
          loadChildren: "./terminal-payroll/module#TerminalModule"
        }
      ],
    },
    {
      path: '**',
      redirectTo: 'authentication/404'
    }
  ];



let _root = window.getRootPath();
_appRoutes[0].path = _root;
_appRoutes[0].children[0]['redirectTo'] = `/${_root}/dashboard`;
_appRoutes[2].path = `${_root}/authentication`;
_appRoutes[3].path =_root;
_appRoutes[4].redirectTo = `/${_root}/authentication/404`;

// for(let idx in _appRoutes[0].children) {
//   let item = _appRoutes[0].children[idx];
//   if(item.path == 'warehouse') _appRoutes[0].children[idx].path = _root;
// }

export const AppRoutes: Routes = _appRoutes;

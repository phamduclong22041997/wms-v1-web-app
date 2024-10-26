import { Routes } from '@angular/router';

import { RoomComponent } from './room/room.component';
import { FloorComponent } from './floor/floor.component';
import { PointComponent } from './point/point.component';
import { SmartcartComponent } from './smartcart/smartcart.component';
// import { SmartcartConfigurationComponent } from './smartcart-configuration/smartcart-configuration.component';
import { TransportDeviceComponent } from './transportdevice/transportdevice.component';
import { TransportDeviceOnSmartcartComponent } from './transportdeviceonsmartcart/transportdeviceonsmartcart.component';

// import { TransportTypeComponent } from './../../administrator/transport/transport_type/transport_type.component';
export const OperationNetworkingRoutes: Routes = [
  /**
   * START - Warehouse Routing
   */
  {
    path: 'warehouse/room',
    component: RoomComponent
  },
  {
    path: 'warehouse/floor',
    component: FloorComponent
  },
  {
    path: 'warehouse/point',
    component: PointComponent
  },
  /**
  * START - Cart Routing
  */
  {
    path: 'cart',
    children: [
      {
        path: 'smartcart',
        component: SmartcartComponent
      },
      {
        path: 'transportdeviceonsmartcart',
        component: TransportDeviceOnSmartcartComponent
      }
    ]
  },
  /**
  * START - Transport Device Routing
  */
  {
    path: 'transportdevice',
    component: TransportDeviceComponent,
    children: [
      {
        path: 'type',
        component: SmartcartComponent
      }
    ]
  },
  // {
  //   path: 'type',
  //   component: TransportTypeComponent
  // }
];

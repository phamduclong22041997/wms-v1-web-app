import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperationNetworkingRoutes } from './operation-networking.routing';
import { MaterialModule } from '../../material-module';
import { ComponentsModule } from './../../components/components.module';

import { RequestService } from './../../shared/request.service';

//Operation: Room
import { RoomComponent } from './room/room.component';
import { RoomPopupComponent } from './room/room-popup/room-popup.component';
//Operation: Room

//Operation: Floor
import { FloorComponent } from './floor/floor.component';
import { FloorItemComponent } from './floor/item/item.component';
//Operation: Floor

//Operation: Point
import { PointComponent } from './point/point.component';
import { PointItemComponent } from './point/item/item.component';
//Operation: Point

//Operation: TransportDevice
import { TransportDeviceComponent } from './transportdevice/transportdevice.component';
import { TransportDeviceItemComponent } from './transportdevice/item/item.component';
//Operation: TransportDevice

//Operation: TransportDeviceOnSmartcart
import { TransportDeviceOnSmartcartComponent } from './transportdeviceonsmartcart/transportdeviceonsmartcart.component';
import { TransportDeviceOnSmartcartItemComponent } from './transportdeviceonsmartcart/item/item.component';
//Operation: TransportDeviceOnSmartcart

import { SmartcartComponent } from './smartcart/smartcart.component';
import { SmartcartPopupComponent } from './smartcart/smartcart-popup/smartcart-popup.component';
import { SmartcartConfigComboComponent } from './combo/smartcart-configuration/smartcart-configuration.component';
import { RoomComboComponent } from './combo/room/room.component';
import { RoomTypeCompoComponent } from './combo/roomtype/roomtype.component';
import { FloorComboComponent } from './combo/floor/floor.component';
import { PointTypeComboComponent } from './combo/pointtype/pointtype.component';
import { TransportDeviceTypeComboComponent } from './combo/transportdevicetype/transportdevicetype.component';
import { UsingStatusComboComponent } from './combo/usingstatus/usingstatus.component';
import { SmartcartPurposeComboComponent } from './combo/smartcart-purposeusing/smartcart-purposeusing.component';
import {SmartcartProductSizeComboComponent} from './combo/smartcart-productsize/smartcart-productsize.component';
import { SmartcartComboComponent } from './combo/smartcart/smartcart.component';
import { TransportDeviceComboComponent } from './combo/transportdevice/transportdevice.component';
import { SmartcartConfigurationComponent } from './smartcart-configuration/smartcart-configuration.component';
import { SmartcartConfigurationPopupComponent } from './smartcart-configuration/smartcart-configuration-popup/smartcart-configuration-popup.component';
// import { TransportTypeComponent } from './../../administrator/transport/transport_type/transport_type.component';

@NgModule({
  declarations: [
    RoomComponent, RoomPopupComponent, RoomComboComponent, RoomTypeCompoComponent,

    FloorComponent, FloorItemComponent, FloorComboComponent,

    PointComponent, PointItemComponent, PointTypeComboComponent,
    
    TransportDeviceComponent, TransportDeviceItemComponent, TransportDeviceTypeComboComponent, TransportDeviceComboComponent,

    TransportDeviceOnSmartcartComponent, TransportDeviceOnSmartcartItemComponent,
    
    UsingStatusComboComponent, SmartcartPurposeComboComponent,
    // TransportTypeComponent,

    SmartcartComponent, SmartcartPopupComponent, SmartcartConfigComboComponent, SmartcartComboComponent,

    SmartcartProductSizeComboComponent, SmartcartConfigurationComponent, SmartcartConfigurationPopupComponent
  ],
  entryComponents: [
    RoomPopupComponent,
    FloorItemComponent,
    PointItemComponent,
    SmartcartPopupComponent,
    TransportDeviceItemComponent,
    TransportDeviceOnSmartcartItemComponent,
    SmartcartConfigurationPopupComponent
  ],
  providers: [RequestService],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    FlexLayoutModule,
    RouterModule.forChild(OperationNetworkingRoutes)
  ]
})
export class OperationNetworkingModule { }

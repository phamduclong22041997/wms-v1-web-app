import { Routes } from '@angular/router';
import { ListPOComponent } from './pages/po-list/component';
import { PoDetailsComponent } from './pages/po-details/component';

import { POReceiptPalletComponent } from './pages/po-receive-pallet/component';
import { POAdjustComponent } from './pages/po-adjust/component';

export const MasanPORoutes: Routes = [
  {
    path: 'list',
    data: { title: 'DANH SÁCH PO' },
    component: ListPOComponent
  },
  {
    path: 'details/:POCode',
    component: PoDetailsComponent,
    data: { title: 'CHI TIẾT' },
  },
  {
    path: 'receive-pallet',
    component: POReceiptPalletComponent,
    data: { title: 'NHẬN HÀNG PALLET' }
  },
  {
    path: 'receive-pallet/:code',
    component: POReceiptPalletComponent,
    data: { title: 'NHẬN HÀNG PALLET' }
  },
  {
    path: 'po-adjust',
    component: POAdjustComponent,
    data: { title: 'ĐIỀU CHỈNH SỐ LƯỢNG THỰC NHẬN' }
  },
  {
    path: 'po-adjust/:code',
    component: POAdjustComponent,
    data: { title: 'ĐIỀU CHỈNH SỐ LƯỢNG THỰC NHẬN' }
  }
];

import { Routes } from '@angular/router';
import { ListSORComponent } from './pages/po-list/component';
import { SORDetailsComponent } from './pages/po-details/component';

import { SORReceiptPalletComponent } from './pages/po-receive-pallet/component';
import { POAdjustComponent } from './pages/po-adjust/component';

export const MasanPORoutes: Routes = [
  {
    path: 'listsor',
    data: { title: 'DANH SÁCH SOR' },
    component: ListSORComponent
  },
  {
    path: 'details/:Code',
    component: SORDetailsComponent,
    data: { title: 'CHI TIẾT' },
  },
  {
    path: 'receive-pallet',
    component: SORReceiptPalletComponent,
    data: { title: 'NHẬN HÀNG PALLET' }
  },
  {
    path: 'receive-pallet/:code',
    component: SORReceiptPalletComponent,
    data: { title: 'NHẬN HÀNG PALLET' }
  },
  {
    path: 'sor-adjust',
    component: POAdjustComponent,
    data: { title: 'ĐIỀU CHỈNH SỐ LƯỢNG THỰC NHẬN' }
  },
  {
    path: 'sor-adjust/:code',
    component: POAdjustComponent,
    data: { title: 'ĐIỀU CHỈNH SỐ LƯỢNG THỰC NHẬN' }
  }
];

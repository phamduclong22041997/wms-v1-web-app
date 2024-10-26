/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */
import { NgModule } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import { MenuItems } from './menu-items/menu-items';

import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TranslateModule
  ],
  providers: [MenuItems]
})
export class SharedModule {}

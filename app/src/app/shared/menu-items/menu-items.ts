/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */

import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
  scid: string;
  icon: string;
  isview: boolean;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  subchildren?: SubChildren[];
  scid: string;
  icon: string;
  level: number;
  isview: boolean;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  scid: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  level: number;
  isview: boolean;
  children?: ChildrenItems[];
}
@Injectable()
export class MenuItems {
  public getMenuitem: Menu[] = [];
  public menuObject: Object = {};
}

import { Component, Type, OnInit, ChangeDetectorRef, Injector} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MediaMatcher } from '@angular/cdk/layout';
import { BasicInject, InjectObj } from './basic.inject';

export class ModalStyle {
  height: any = 'auto';
}

export class IconObject {
  view: string = 'view_headline';
  edit: string = 'edit';
  create: string = 'playlist_add';
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  injector: Injector;
  component: Type<any>;
  title:string;
  params: Object;
  action:any = "view";
  mobileQuery: MediaQueryList;
  hasInitial:boolean = false;
  modalStyle:ModalStyle = new ModalStyle();

  icons: IconObject = new IconObject();

  private _mobileQueryListener: () => void;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ModalComponent>, 
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private inj: Injector
    ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => {
      if(this.mobileQuery) {
        this.resizeView();
      }
      return changeDetectorRef.detectChanges()
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  resizeView() {
    let ele:any = document.querySelector('.model-panel');
    ele.style.padding = "0";
    ele.style.maxHeight= this.geHeight();
    ele.style.maxWidth =  '100vw';
    ele.style.width =  '100vw';
  }

  geHeight()
  {
    let _height = 0;
    let ele:any = document.getElementById('app-header');
    _height += ele.offsetHeight;
    return (window.innerHeight - _height) + 'px';
  }

  close(): void {
    this._bottomSheetRef.dismiss();
  }

  ngOnInit() {
    if(this._bottomSheetRef.containerInstance.bottomSheetConfig.data) {
      this.component = this._bottomSheetRef.containerInstance.bottomSheetConfig.data.component || null;
      this.title = this._bottomSheetRef.containerInstance.bottomSheetConfig.data.title || "";
      this.action = this._bottomSheetRef.containerInstance.bottomSheetConfig.data.action || "";
      this.params = this._bottomSheetRef.containerInstance.bottomSheetConfig.data.params || null;
      
      let _data = this._bottomSheetRef.containerInstance.bottomSheetConfig.data.data || null;
      if(_data) {
        _data['action'] = this.action;
      }
      this.injector = Injector.create([
        { provide: BasicInject, useValue: new InjectObj(this._bottomSheetRef, _data) }
      ], this.inj);
    }
  }

  ngAfterViewInit() {
    this.hasInitial = true;
    // this.resizeView();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

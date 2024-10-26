import { Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appInputForm]'
})
export class InputFormDirective {

  constructor(el: ElementRef) {
    this.registerEvents(el)
  }

  registerEvents(el:any) {
    el.nativeElement.addEventListener('keyup', (event) =>{
      if(event.code == 'Enter') {
        let nextIndex = (el.nativeElement.tabIndex || 0);
        if(el.nativeElement.form[nextIndex] !== undefined) {
          el.nativeElement.form[nextIndex].focus();
        }
      }
    })
  }
}

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective {

  constructor(private el: ElementRef) {
    
  }
  ngAfterViewInit() {
    setTimeout(() => {
    this.el.nativeElement.focus();
    }, 300);
  }
}

@Directive({
  selector: '[autoUppercase]'
})
export class AutoUppercaseDirective {

  constructor(private el: ElementRef) {
    
  }
  ngAfterViewInit() {
    this.el.nativeElement.style.textTransform = "uppercase";
    this.el.nativeElement.addEventListener('keyup', (event:any) => {
      event.target.value = event.target.value.toUpperCase();
      
    })
  }
}

@Directive({
  selector: '[autoResizeHeight]'
})
export class AutoResizeHeightDirective {
  @Input() isView: any;
  constructor(private el: ElementRef) {
    
  }
  ngAfterViewInit() {
    this.resizeView();
  }
  resizeView() {
    // let 
    let ele:any = this.el.nativeElement.querySelector('.app-tab .mat-tab-body-wrapper');
    ele.style.minHeight = this.geHeight();
  }
  geHeight()
  {
    let _height = 0;
    _height += this.el.nativeElement.offsetTop;
    //mat-tab-header
    let headerEle = this.el.nativeElement.querySelector('.mat-tab-header');
    if(headerEle != null) {
      _height += headerEle.offsetHeight;
    }
    if(this.isView) {
      _height -= 110;
    }
    let _ele:any = document.querySelector(".mat-bottom-sheet-container");
    return (_ele.offsetHeight - _height) + 'px';
  }
}

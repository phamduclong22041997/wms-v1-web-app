import { Component, OnInit , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  defaultActions:Object = [
    {icon: 'add', title: "btn_add", name: "add_new", enable: true, visible: true},
    {icon: 'refresh', title: "btn_refresh", name: 'reload', enable: true, visible: true},
    {icon: 'save_alt', title: "btn_export", name: 'export_excel', enable: true, visible: false}
  ];
  tools: Object = [];
  change:EventEmitter<any> = null;
  constructor() {
    this.change = new EventEmitter<any>();
  }
  ngOnInit() {
    this.tools = this.defaultActions;
  }
  ngAfterViewInit() {
  }
  onClick(tool: any) {
    this.change.next(tool.name);
  }
}

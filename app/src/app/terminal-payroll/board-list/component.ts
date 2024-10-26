
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Service } from '../service';

@Component({
  selector: 'terminal-board-list',
  templateUrl: './component.html',
  styleUrls: [
    './component.css']
})
export class TerminalBoardListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("sliderRef", { static: false }) sliderRef: ElementRef<HTMLElement>;

  dateTime = moment().format("HH:mm:ss DD/MM/YYYY");
  gridCol = "100%";

  style_class = "board-main";
  rootPath = window.getRootPath();
  txtNotification = '';
  dataSource = [];
  dataNotifation = [];
  display = "none";
  opacity = 0;
  limit = 5;
  isShowDiviceId = false;
  TYPE = {
    "SO_AUTOPP_PICKING": "Sản lượng lấy hàng",
    "SO_AUTOPP_PACKING": "Sản lượng đóng gói"
  }
  textType = "";
  filters = {
    Content: '',
    FromDate: "",
    ToDate: "",
    WarehouseCode: this.rootPath.toUpperCase(),
    JobType: "SO_AUTOPP_PACKING"
  };

  constructor(
    public router: Router,
    private translate: TranslateService,
    private service: Service,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngAfterViewInit(): void {
    let time = 30000;
    setInterval(() => {
      this.getDataList();
    }, time)


  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      if (param.JobType || param.jobtype) {
        this.filters["JobType"] = param.JobType || param.jobtype;
      }
      if (param.wh || param.WH) {
        this.filters["WarehouseCode"] = param.wh || param.WH;

      }
      if (param.FromDate) {
        this.filters["FromDate"] = param.FromDate;
      }
      if (param.ToDate) {
        this.filters["ToDate"] = param.ToDate;
      }
      if (param.mode) {
        this.style_class = "board-content";
      }

      this.isShowDiviceId = this.filters["JobType"] === "SO_AUTOPP_PACKING" ? true : false;
      if (this.isShowDiviceId) {
        this.style_class = `${this.style_class} style-packing`;
      }
    });
    this.getDataList();
    setInterval(() => {
      this.dateTime = moment().format("HH:mm:ss DD/MM/YYYY");
    }, 1000);
  }

  private getDataList() {
    if (!this.filters["JobType"]) return;
    this.textType = this.filters["JobType"] ? this.TYPE[this.filters["JobType"]] : "";
    this.service.getBoardList(this.filters).subscribe((resp) => {
      if (resp.Status && resp.Data) {
        this.dataSource = resp.Data;
      }
    });
  }

  getStatusCss(code: string) {
    if (code) {
      return `status-${code.toLowerCase()}`;
    }
    return 'status-default';
  }
  getClass(code: string, i: number) {
    let _class = '';
    if (code == "31") {
      _class = "active";
    }
    else if (code == "32") {
      _class = "bg-ready";
    } else if (code == "4") {
      _class = 'bg-change';
    } else if (code == "5") {
      _class = 'bg-expire';
    }
    else if (i % 2 === 0) {
      _class = 'bg-gray';
    }

    return _class;
  }
  openLink(gate) {

  }

  ngOnDestroy() {
  }
  
}

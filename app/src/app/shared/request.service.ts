/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Duy Huynh
 * Modified date: 2019/11
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { of as observableOf } from 'rxjs';
import { ExpireComponent } from './../authentication/expire/expire.component';
import * as _ from 'lodash';
import * as printJS from 'print-js';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private toast: ToastService, public dialog: MatDialog) { }

  upload(uri: string, data: any, _options: any = {}) {
    let url = uri;
    let options = this.getHttpOptions({
      "mimeType": "multipart/form-data",
      "Content-Type": false
    }, null);

    if (_options['blob'] === 1) {
      options['responseType'] = 'blob';
      options['observe'] = 'response';
    }

    return this.http.post(url, data, options)
      .pipe(
        catchError((e) => {
          let isDeny = false;
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                isDeny = true;
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Cảnh Báo");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText, deny: isDeny });
        })
      );
  }
  post(uri: string, data: any, options: any = {}, v2: any=0) {
    let url = uri;
    let _options = {}
    if (options) {
      if (options['warehouse']) {
        _options['warehouse'] = options['warehouse'];
      }
    }

    let _data = JSON.stringify({ data: data })
    if(v2 == 1) {
      _data = JSON.stringify(data);
    }

    return this.http.post(url, _data, this.getHttpOptions(_options, null))
      .pipe(
        catchError((e) => {
          let isDeny = false;
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                isDeny = true;
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Lỗi");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText, deny: isDeny });
        })
      );
  }
  put(uri: string, data: any, options: any = {}) {
    let url = uri;
    let _options = {}
    if (options) {
      if (options['warehouse']) {
        _options['warehouse'] = options['warehouse'];
      }
    }

    return this.http.put(url, JSON.stringify({ data: data }), this.getHttpOptions(_options, null))
      .pipe(
        catchError((e) => {
          let isDeny = false;
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                isDeny = true;
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Cảnh Báo");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText, deny: isDeny });
        })
      );
  }
  remove(uri: any, id: String) {
    let url = uri;
    url += "?ref=" + id;
    return this.http.delete(url, this.getHttpOptions({}, null))
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Cảnh Báo");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText });
        })
      );
  }
  get(uri: any, params: any, options: any = {}) {
    let _options = {}
    if (options) {
      if (options['warehouse']) {
        _options['warehouse'] = options['warehouse'];
      }
      if (options['Authorization']) {
        _options['Authorization'] = options['Authorization'];
      }
    }
    let _httpOptions = this.getHttpOptions(_options, params['regionCode']);
    _httpOptions['params'] = params || {};
    return this.http.get(uri, _httpOptions)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Cảnh Báo");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText });
        })
      )
  }
  getDashboard(uri: any, params: any) {
    let _httpOptions = this.getDashboardHttpOptions({});
    _httpOptions['params'] = params || {};
    return this.http.get(uri, _httpOptions)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            if (e.error && e.error['Data']) {
              if (e.error.Deny) {
                this.showExpire();
              } else {
                this.toast.warning(e.error['Data'], "Cảnh Báo");
              }
            } else {
              this.toast.error(e.statusText, "Cảnh Báo");
            }
          }
          return observableOf(e.error || { Success: false, Data: e.statusText });
        })
      )
  }
  getDashboardHttpOptions(includeOptions = {}) {
    let options = {
      'Authorization': '08b216ba27d0aca32e0e2c1d4912e143d718dcf2' || "unknown",
      'token': window.localStorage.getItem('_token') || "unknown",
      'appid': window.localStorage.getItem('appid') || "unknown",
      'sid': window.localStorage.getItem('sid') || "unknown",
      'scid': window.localStorage.getItem('SCID') || "unknown",
      'apisid': 'U2FsdGVkX19Yzn7IWXHsJn1RpzDPO6PbLaK0BJYb6bFPOuM1IRDuNy+f+JkXvxN2',
      'Content-Type': 'application/json',
    }
    options = { ...options, ...includeOptions }
    let httpOptions = {
      headers: new HttpHeaders(options)
    };
    return httpOptions;
  }
  getHttpOptions(includeOptions = {}, region) {
    let info = window.localStorage.getItem('_info');
    if (info) {
      info = JSON.parse(info);
    }
    let options = {
      'Authorization': window.localStorage.getItem('_token') || "unknown",
      'token': window.localStorage.getItem('_token') || "unknown",
      'appid': window.localStorage.getItem('appid') || "unknown",
      'sid': window.localStorage.getItem('sid') || "unknown",
      'scid': window.localStorage.getItem('SCID') || "unknown",
      'apisid': window.localStorage.getItem('APISID') || "unknown",
      'usid': info && info['Id'] ? info['Id'] : "unknown",
      // 'timeout': 60000,
      'Content-Type': 'application/json',
      'x-geo-region': region == null ? '' : region
    }
    const _region = window.localStorage.getItem("region");
    if (_region) {
      const obj = JSON.parse(_region);
      options['x-geo-region'] = obj.Code || null
    }

    if (region) {
      options['x-geo-region'] = region || null
    }

    options['warehouse'] = window.localStorage.getItem('_warehouse') || '';
    options = { ...options, ...includeOptions }
    let httpOptions = {
      headers: new HttpHeaders(options)
    };
    return httpOptions;
  }
  showExpire() {
    let config = new MatDialogConfig();
    config.disableClose = true;

    const dialogRef = this.dialog.open(ExpireComponent, config);
    setTimeout(() => {
      dialogRef.close();
      // window.location.href = configs.OVAUTHEN;
    }, 2000);
  }
  download(url: string, params: any = null) {
    let _httpOptions = this.getHttpOptions({}, null);
    _httpOptions['responseType'] = 'blob';
    _httpOptions['observe'] = 'response';
    if (params && typeof params === 'object') {
      _httpOptions['params'] = params;
    }
    this.http.get(url, _httpOptions)
      .subscribe((resp: any) => {
        if (resp.body) {
          let fileName = resp.headers.get('x-download-filename');
          if (fileName) {
            const url = window.URL.createObjectURL(resp.body);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
          else {
            this.toast.info("Không tìm thấy dữ liệu.", "Info")
          }
        } else {
          this.toast.info("Không tìm thấy dữ liệu.", "Info")
        }
      })
  }
  downloadPost(url: string, data: any = null, _options: any = {}) {
    let _httpOptions = this.getHttpOptions({
      "mimeType": "multipart/form-data",
      "Content-Type": false
    }, null);

    _httpOptions['responseType'] = 'blob';
    _httpOptions['observe'] = 'response';

    this.http.post(url, data, _httpOptions)
      .subscribe((resp: any) => {
        if (resp.body) {
          let fileName = resp.headers.get('x-download-filename');
          if (fileName) {
          const url = window.URL.createObjectURL(resp.body);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          }
          else {
            this.toast.info("Không tìm thấy dữ liệu.", "Info")
          }
        } else {
          this.toast.info("Không tìm thấy dữ liệu.", "Info")
        }
      });
  }
  exportBase64PDF(url: string, data: any = {}, IsPrint: Boolean = false) {
    let _httpOptions = this.getHttpOptions({}, null);
    _httpOptions['responseType'] = IsPrint ? 'text' : 'blob';
    _httpOptions['observe'] = 'response';
    this.http.post(url, JSON.stringify(data), _httpOptions)
      .subscribe((resp: any) => {
        if (resp.body) {
          if (IsPrint === true) {
            printJS({ printable: resp.body, type: 'pdf', base64: true })
          } else {
            let fileName = resp.headers.get('x-download-filename');
            const url = window.URL.createObjectURL(resp.body);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
        } else {
          this.toast.info("Không tìm thấy dữ liệu.", "Info");
        }
      })
  }
  exportExcel(url: string, data: any = {}) {
    let _httpOptions = this.getHttpOptions({}, null);
    _httpOptions['responseType'] = 'blob';
    _httpOptions['observe'] = 'response';

    this.http.post(url, JSON.stringify(data), _httpOptions)
      .subscribe((resp: any) => {
        if (resp.body) {
          let fileName = resp.headers.get('x-download-filename');
          const url = window.URL.createObjectURL(resp.body);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          this.toast.info("Không tìm thấy dữ liệu.", "Info")
        }
      })
  }
}

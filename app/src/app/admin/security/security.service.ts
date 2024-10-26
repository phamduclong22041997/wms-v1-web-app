import { Injectable } from '@angular/core';

import { RequestService } from './../../shared/request.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(private Request: RequestService) { }

  createAccessControl(data:Object) {
    return this.Request.post("/api/security/warrant", data);
  }

  getAccessControlList() {
    return this.Request.get("/api/authorization/getlist", {});
  }

  removeAccessControl(ref:any) {
    return this.Request.remove("/api/security/warrant", ref);
  }

  getRoleList() {
    return this.Request.get('/api/authorization/rolelist', {});
  }

  getScreenList(role) {
    return this.Request.get('/api/authorization/loadscreenlist', role||{});
  }

  grantPermission(data: Object) {
    return this.Request.post("/api/authorization/grantpermission", data);
  }
}

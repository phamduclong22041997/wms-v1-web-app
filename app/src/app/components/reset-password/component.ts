/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Huy Nghiem
 * Modified date: 2020/09/28
 */

import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Service } from "./service";
import { ToastService } from "../../shared/toast.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-login-form",
  templateUrl: "./component.html",
  styleUrls: ["./component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild("oldPassword", { static: false }) oldPassword: ElementRef;
  @ViewChild("newPassword", { static: false }) newPassword: ElementRef;
  @ViewChild("confirNewPassword", { static: false }) confirNewPassword: ElementRef;
  formInfo: Object = {
    oldPassword: "",
    newPassword: "",
    confirNewPassword: "",
  };
  checkboxColor = "accent";
  isRemember: Boolean = false;
  examplePassword: string =
    "Mật khẩu phải có ít nhất 8 kí tự.\r\nChứa ít nhất một chữ cái viết hoa và chữ cái viết thường\r\nChứa ít nhất một chữ số.\r\nChứa ít nhất một ký tự đặc biệt (ví dụ: !@#$%^&*).";
  constructor(
    private toast: ToastService,
    private service: Service,
    public dialogRef: MatDialogRef<ResetPasswordComponent>
  ) {}
  ngOnInit(): void {
    this.initData();
  }
  initData() {
    const APISID = localStorage.getItem("APISID") || "";
    const SID = localStorage.getItem("SID") || localStorage.getItem("sid") || "";
    if (APISID && SID) {
      // this.router.navigate([`/app/dashboard`]);
    }
  }
  isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
  focusNext(input: ElementRef): void {
    input.nativeElement.focus(); // Focus on the next input element
  }
  validateForm() {
    if (!this.formInfo["oldPassword"]) {
      this.toast.error(
        "ResetPassword.Msg_Error_Old_Psw_Required",
        "error_title"
      );
      return false;
    }
    if (!this.formInfo["newPassword"]) {
      this.toast.error(
        "ResetPassword.Msg_Error_New_Psw_Required",
        "error_title"
      );
      return false;
    }
    const isValidPassword = this.isValidPassword(this.formInfo["newPassword"]);
    if (!isValidPassword) {
      this.toast.error(this.examplePassword, "error_title");
      return false;
    }
    if (!this.formInfo["confirNewPassword"]) {
      this.toast.error(
        "ResetPassword.Msg_Error_Confirm_New_Psw_Required",
        "error_title"
      );
      return false;
    }
    if (
      this.formInfo["oldPassword"] &&
      this.formInfo["newPassword"] &&
      this.formInfo["oldPassword"] === this.formInfo["newPassword"]
    ) {
      this.toast.error("ResetPassword.Msg_Error_Same_Psw", "error_title");
      return false;
    }
    if (this.formInfo["confirNewPassword"] !== this.formInfo["newPassword"]) {
      this.toast.error("ResetPassword.Msg_Error_Diff_New_Psw", "error_title");
      return false;
    }
    return true;
  }
  focusEmptyInput() {
    if (this.formInfo["oldPassword"] && !this.formInfo["newPassword"]) {
      this.newPassword.nativeElement.focus();
    }
    if (this.formInfo["oldPassword"] && this.formInfo["newPassword"] && !this.formInfo["confirNewPassword"]) {
      this.confirNewPassword.nativeElement.focus();
    }
    if (this.formInfo["oldPassword"] && this.formInfo["newPassword"] && this.formInfo["confirNewPassword"]) {
      this.changePassword();
    }
  }
  changePassword() {
    if (!this.validateForm()) {
      // this.focusEmptyInput();
      return;
    }

    const APISID = localStorage.getItem("APISID") || "";
    const SID = localStorage.getItem("SID") || "";
    let info = window.localStorage.getItem("_info");
    if (info) {
      info = JSON.parse(info);
    }

    this.service
      .resetPassword({
        // '_id': info['_id'] || '',
        UserName: info["Id"] || "",
        OldPassword: this.formInfo["oldPassword"],
        NewPassword: this.formInfo["newPassword"],
        APISID,
        SID,
      })
      .subscribe((resp: any) => {
        if (resp && resp.Data) {
          if (resp.Status) {
            this.dialogRef.close(true);
            this.toast.success(resp.Data, "success_title");
          } else {
            this.toast.error(resp.Data, "error_title");
          }
        }
      });
  }

  ngAfterViewInit() {
    // this.userNameEle.nativeElement.focus();
  }
}

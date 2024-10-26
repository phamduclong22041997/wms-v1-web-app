import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-po-receive-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmPOReceiveComponent implements OnInit {

  info: any;
  constructor(public dialogRef: MatDialogRef<ConfirmPOReceiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.info = this.data['Data'];
     }

  ngOnInit() {}

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onOkClick() {
    this.dialogRef.close(true);
  }
}

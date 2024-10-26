import { Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-rocket-upload-confirm',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class ConfirmRocketUploadSTOComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmRocketUploadSTOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

      ngOnInit() {}

      onCancelClick() {
        this.dialogRef.close(false);
      }
      onOkClick() {
        this.dialogRef.close(true);
      }
}

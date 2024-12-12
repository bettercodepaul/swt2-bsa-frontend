import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'bla-tablet-admin-pop-up',
  templateUrl: './tablet-admin-pop-up.component.html',
  styleUrls: ['./tablet-admin-pop-up.component.scss']
})
export class TabletAdminPopUpComponent implements OnInit {

  QR: string;  // For QR code
  isPopUp: boolean;  // To control visibility
  scheibenNr: number;


  constructor(
    public dialogRef: MatDialogRef<TabletAdminPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the passed data
  ) {
    this.QR = data.QR; // Set the QR code from passed data
    this.scheibenNr = data.scheibenNr;
    this.isPopUp = data.isPopUp; // Set the isPopUp flag from passed data
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  // Close the modal
  onClose(): void {
    this.dialogRef.close(); // Close the modal when the user clicks "close"
  }

  // If you need to customize the modal icon, this method can be useful
  getModalDialogHeadingIconClass() {
    return 'fa-qrcode'; // Return the QR code icon or any other icon you need
  }
}

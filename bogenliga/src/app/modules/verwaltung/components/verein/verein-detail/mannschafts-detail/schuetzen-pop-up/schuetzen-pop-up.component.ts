import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
// @ts-ignore
import {NavbarComponent} from '../../../../../../../components/navbar/navbar.component';

@Component({
  selector: 'bla-schuetzen-pop-up',
  templateUrl: './schuetzen-pop-up.component.html',
  styleUrls: ['./schuetzen-pop-up.component.scss']
})
export class SchuetzenPopUpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      NavbarComponent.toggleColorAgain();
    })
    this.dialogRef.afterOpened().subscribe(() => {
      NavbarComponent.toggleColor();
    })
  }

}

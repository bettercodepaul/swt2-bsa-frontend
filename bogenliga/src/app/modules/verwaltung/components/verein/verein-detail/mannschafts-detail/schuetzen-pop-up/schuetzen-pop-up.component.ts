import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
// @ts-ignore
import {NavbarComponent} from '../../../../../../../components/navbar/navbar.component';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';

@Component({
  selector: 'bla-schuetzen-pop-up',
  templateUrl: './schuetzen-pop-up.component.html',
  styleUrls: ['./schuetzen-pop-up.component.scss']
})
export class SchuetzenPopUpComponent implements OnInit {

  public ActionButtonColors = ActionButtonColors;

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

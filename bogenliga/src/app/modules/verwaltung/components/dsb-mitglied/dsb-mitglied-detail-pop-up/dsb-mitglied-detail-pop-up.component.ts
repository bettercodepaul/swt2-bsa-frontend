import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


@Component({
  selector: 'bla-dsb-mitglied-detail-pop-up',
  templateUrl: './dsb-mitglied-detail-pop-up.component.html',
  styleUrls: ['./dsb-mitglied-detail-pop-up.component.scss']
})
export class DsbMitgliedDetailPopUpComponent implements OnInit {

  public ActionButtonColors = ActionButtonColors;

  constructor(public dialogRef: MatDialogRef<MatDialog>) { }

  ngOnInit(): void {
  }

}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'bla-schusszettel-tablet-dialog',
  template: `
    <h1 mat-dialog-title>Tablet Setup Schusszettel</h1>
    <div mat-dialog-content>
      <bla-schusszettel-tablet-admin [wettkampfId]="data.wettkampfId"></bla-schusszettel-tablet-admin>
    </div>
  `
})
export class SchusszettelTabletDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { wettkampfId: number }) {}
}

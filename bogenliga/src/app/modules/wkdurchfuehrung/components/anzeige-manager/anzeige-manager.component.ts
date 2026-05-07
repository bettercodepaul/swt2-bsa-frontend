import {Component} from '@angular/core';

export interface AnzeigeDO {
  id: number;
  physicalDisplayID: string;
  tableType: string;
}

@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent {

  public displays: AnzeigeDO[] = [
    { id: 1, physicalDisplayID: '', tableType: 'tabelle'},
  ];

  public currentMatch = 1;

  public nextMatch(): void {
      this.currentMatch++;
  }

  public previousMatch(): void {
    if (this.currentMatch > 1) {
      this.currentMatch--;
    }
  }

  public removeDisplay(id: number): void {
    const deleteIndex = id - 1;
    const currentDisplay = this.displays[deleteIndex];
    const confirmResult = confirm(
      `Möchtest du die Anzeige "${currentDisplay.physicalDisplayID}" wirklich entfernen?`
    );

    if (confirmResult) {
      this.displays.splice(deleteIndex, 1);
    }
  }

  public addDisplay(): void {
    const newDisplay: AnzeigeDO = {
      id: this.displays.length + 1,
      physicalDisplayID: '',
      tableType: 'tabelle',
    };
    this.displays.push(newDisplay);
  }
}

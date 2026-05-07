import {Component} from '@angular/core';

export interface AnzeigeDO {
  id: number;
  anzeigeId: string;
  inhaltTyp: string;
}

@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent {

  public anzeigen: AnzeigeDO[] = [
    { id: 1, anzeigeId: '', inhaltTyp: 'Tabelle'},
  ];

  public aktuellesMatch = 1;

  public naechsteAnzeige(): void {
      this.aktuellesMatch++;
  }

  public vorherigeAnzeige(): void {
    if (this.aktuellesMatch > 1) {
      this.aktuellesMatch--;
    }
  }

  public anzeigeEntfernen(id: number): void {
    const deleteIndex = id - 1;
    const aktuelleAnzeige = this.anzeigen[deleteIndex];
    const bestaetigung = confirm(
      `Möchten Sie die Anzeige "${aktuelleAnzeige.anzeigeId}" wirklich entfernen?`
    );

    if (bestaetigung) {
      this.anzeigen.splice(deleteIndex, 1);
    }
  }

  public anzeigeHinzufuegen(): void {
    const neueAnzeige: AnzeigeDO = {
      id: this.anzeigen.length + 1,
      anzeigeId: '',
      inhaltTyp: 'Tabelle',
    };
    this.anzeigen.push(neueAnzeige);
  }
}

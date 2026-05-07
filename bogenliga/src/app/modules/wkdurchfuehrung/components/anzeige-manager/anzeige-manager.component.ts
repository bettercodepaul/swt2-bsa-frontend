import { Component, OnInit } from '@angular/core';

export interface AnzeigeDO {
  id: number;
  anzeigeId: string;
  inhaltTyp: string;
  matchNr: number;
}

@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent implements OnInit {

  public anzeigen: AnzeigeDO[] = [
    { id: 1, anzeigeId: 'A9B2', inhaltTyp: 'Tabelle', matchNr: 1 },
    { id: 2, anzeigeId: 'C3D4', inhaltTyp: '(1/2)', matchNr: 2 }
  ];

  public aktuellesMatch = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

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
    const neueId = `A${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    const neueAnzeige: AnzeigeDO = {
      id: this.anzeigen.length + 1,
      anzeigeId: neueId,
      inhaltTyp: 'Tabelle',
      matchNr: this.anzeigen.length + 1
    };
    this.anzeigen.push(neueAnzeige);
  }
}

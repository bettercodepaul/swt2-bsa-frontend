import { Component, OnInit } from '@angular/core';

export interface AnzeigeDO {
  id: number;
  anzeigeId: string;
  inhalt: string;
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
    { id: 1, anzeigeId: 'A9B2', inhalt: '(1/2)', inhaltTyp: 'Tabelle', matchNr: 1 },
    { id: 2, anzeigeId: 'C3D4', inhalt: '(3/4)', inhaltTyp: '(1/2)', matchNr: 2 }
  ];

  public aktuelleAnzeigeIndex = 0;
  public inhaltOptionen = ['Tabelle', '(1/2)', '(3/4)', '(5/6)', '(7/8)'];

  constructor() {
  }

  ngOnInit(): void {
  }

  public naechsteAnzeige(): void {
    if (this.aktuelleAnzeigeIndex < this.anzeigen.length - 1) {
      this.aktuelleAnzeigeIndex++;
    }
  }

  public vorherigeAnzeige(): void {
    if (this.aktuelleAnzeigeIndex > 0) {
      this.aktuelleAnzeigeIndex--;
    }
  }

  public anzeigeEntfernen(): void {
    const aktuelleAnzeige = this.anzeigen[this.aktuelleAnzeigeIndex];
    const bestaetigung = confirm(
      `Möchten Sie die Anzeige "${aktuelleAnzeige.anzeigeId}" wirklich entfernen?`
    );

    if (bestaetigung) {
      this.anzeigen.splice(this.aktuelleAnzeigeIndex, 1);
      if (this.aktuelleAnzeigeIndex >= this.anzeigen.length && this.anzeigen.length > 0) {
        this.aktuelleAnzeigeIndex = this.anzeigen.length - 1;
      }
    }
  }

  public anzeigeHinzufuegen(): void {
    const neueId = `A${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    const neueAnzeige: AnzeigeDO = {
      id: this.anzeigen.length + 1,
      anzeigeId: neueId,
      inhalt: '(1/2)',
      inhaltTyp: 'Tabelle',
      matchNr: this.anzeigen.length + 1
    };
    this.anzeigen.push(neueAnzeige);
  }

  public get aktuelleAnzeige(): AnzeigeDO {
    return this.anzeigen[this.aktuelleAnzeigeIndex];
  }

  public hatVorherigeAnzeige(): boolean {
    return this.aktuelleAnzeigeIndex > 0;
  }

  public hatNaechsteAnzeige(): boolean {
    return this.aktuelleAnzeigeIndex < this.anzeigen.length - 1;
  }
}

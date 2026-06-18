import {Component, OnInit} from '@angular/core';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';

@Component({
  selector: 'bla-screen-registration',
  templateUrl: './anzeige_physische_ID.component.html',
  styleUrls: ['./anzeige_physische_ID.component.scss']
})
export class AnzeigePhysischeIDComponent implements OnInit {
  physischeBildschirmID = '';

  constructor(private anzeigenProvider: AnzeigenProviderService) {}

  ngOnInit(): void {
    this.showGeneratedID();
  }

  public async showGeneratedID(): Promise<void> {
    try {
      const response = await this.anzeigenProvider.getNewPhysischeBildschirmID();
      if (response && response.payload) {
        this.physischeBildschirmID = '' + response.payload;
        console.log('Physische Bildschirm ID geladen:', this.physischeBildschirmID);
      } else {
        console.error('Keine ID in der Response erhalten');
        this.physischeBildschirmID = 'Fehler: Keine ID';
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Physische Bildschirm ID:', error);
      this.physischeBildschirmID = 'Fehler beim Laden';
    }
  }
}

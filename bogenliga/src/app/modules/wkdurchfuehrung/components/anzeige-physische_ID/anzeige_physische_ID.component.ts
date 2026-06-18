import {Component, OnInit, HostListener} from '@angular/core';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';

@Component({
  selector: 'bla-screen-registration',
  templateUrl: './anzeige_physische_ID.component.html',
  styleUrls: ['./anzeige_physische_ID.component.scss']
})
export class AnzeigePhysischeIDComponent implements OnInit {
  physischeBildschirmID = '';
  isFullscreen = true;

  constructor(private anzeigenProvider: AnzeigenProviderService) {}

  ngOnInit(): void {
    this.showGeneratedID();
    this.activateFullscreen();
  }

  public async showGeneratedID(): Promise<void> {
      const response = await this.anzeigenProvider.getNewPhysischeBildschirmID();
      this.physischeBildschirmID = '' + response.payload;
  }

  private activateFullscreen(): void {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.warn('Vollbild-Anfrage fehlgeschlagen:', err);
      });
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

}

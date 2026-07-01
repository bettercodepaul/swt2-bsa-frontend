import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'bla-screen-registration',
  templateUrl: './anzeige_physische_ID.component.html',
  styleUrls: ['./anzeige_physische_ID.component.scss']
})
export class AnzeigePhysischeIDComponent implements OnInit, OnDestroy {
  physischeBildschirmID = '';
  isFullscreen = true;
  private pollingSubscription!: Subscription;

  constructor(private anzeigenProvider: AnzeigenProviderService) {}

  async ngOnInit(): Promise<void> {
    await this.showGeneratedID();
    this.activateFullscreen();
    this.pollingSubscription = interval(30000).subscribe(() => {
      // findAnzeigenMatchByPhysischeBildschirmId(physischeBildschirmID);
    });
  }

  async ngOnDestroy() {
    // Verhindert Memory Leaks, falls die Komponente jemals zerstört wird
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
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

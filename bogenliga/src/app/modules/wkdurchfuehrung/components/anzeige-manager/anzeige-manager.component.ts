import {Component, OnInit} from '@angular/core';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent implements OnInit {
  /*
  *  AnzeigenProviderService hat oben das hier:
  *   @Injectable({
  *     providedIn: 'root'
  *   })
  *  Deshalb ist es für den constructor einfach verfügbar.
  * */

  public displays: AnzeigenDO[] = [];

  public currentMatch = 1;

  public wettkampfId: number;

  constructor(private anzeigenProvider: AnzeigenProviderService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Holt den in der wkdurchfuehrung.routing.ts definierten Parameter aus der URL
    this.route.paramMap.subscribe((params) => {
      this.wettkampfId = parseInt(params.get('selectedWettkampfId'), 10);
    });
    this.loadDisplays();
  }

  public async loadDisplays(): Promise<void> {
    this.displays = (await this.anzeigenProvider.getByWettkampfId(this.wettkampfId)).payload;
  }

  public nextMatch(): void {
    this.currentMatch++;
  }

  public previousMatch(): void {
    if (this.currentMatch > 1) {
      this.currentMatch--;
    }
  }

  public removeDisplay(deleteIndex: number): void {
    const currentDisplay = this.displays[deleteIndex];
    const confirmResult = confirm(
      `Möchtest du die Anzeige "${currentDisplay.physischeBildschirmId}" wirklich entfernen?`
    );
    if (confirmResult) {
      this.anzeigenProvider.delete(currentDisplay.id)
        .then(() => {
          this.displays.splice(deleteIndex, 1);
          console.log('deleted anzeige with id ' + currentDisplay.id);
        })
        .catch((error) => {
          console.error('Fehler beim Löschen:', error);
          alert('Die Anzeige konnte nicht gelöscht werden. Bitte versuche es erneut.');
        });
    }
  }

  public addDisplay(): void {
    this.anzeigenProvider.create(this.wettkampfId) // Backend API wird im anzeigenProvider aufgerufen
      .then((response: BogenligaResponse<number>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)) {
          console.log('Saved with id: ' + response.payload);
          const newDisplay: AnzeigenDO = {
            id: response.payload,
            physischeBildschirmId: '',
            tableTyp: 'tabelle',
            aktuellesMatch: this.currentMatch,
            wettkampfId: this.wettkampfId,
          };
          this.displays.push(newDisplay);
        }
      });
  }

  public updateDisplay(): void {
    this.displays.forEach((display) => {
      if (display.aktuellesMatch !== this.currentMatch) {
        display.aktuellesMatch = this.currentMatch;
      }
      this.anzeigenProvider.update(display)
        .then((response: BogenligaResponse<AnzeigenDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)) {
            console.log('Successfully updated ' + response.payload.id);
          }
        });
    });
  }

  public navigateToScreen(): void {
    this.router.navigate(['/wkdurchfuehrung/anzeige-physische-id', this.wettkampfId]);
  }


}

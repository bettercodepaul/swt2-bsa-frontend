import {Component} from '@angular/core';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';


@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent {
  /*
  *  AnzeigenProviderService hat oben das hier:
  *   @Injectable({
  *     providedIn: 'root'
  *   })
  *  Deshalb ist es für den constructor einfach verfügbar.
  * */
  constructor(private anzeigenProvider: AnzeigenProviderService) {}

  public displays: AnzeigenDO[] = [];

  public currentMatch = 1;

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
      this.displays.splice(deleteIndex, 1);
    }
  }

  public addDisplay(): void {
    this.anzeigenProvider.create(new AnzeigenDO())
      .then((response: BogenligaResponse<number>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)) {
          console.log('Saved with id: ' + response.payload);
          const newDisplay: AnzeigenDO = {
            id: response.payload,
            physischeBildschirmId: '',
            tableTyp: 'tabelle',
            aktuellesMatch: this.currentMatch,
            veranstaltungsId: null
          };
          this.displays.push(newDisplay);
        }
      });
  }

  public updateDisplay(updateIndex: number): void {
    this.anzeigenProvider.update(this.displays[updateIndex])
      .then((response: BogenligaResponse<AnzeigenDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)) {
          console.log('Successfully updated ' + response.payload.id);
        }
      });
    }
}

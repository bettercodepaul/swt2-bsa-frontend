import {Component, OnInit, OnDestroy} from '@angular/core';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'bla-anzeige-manager',
  templateUrl: './anzeige-manager.component.html',
  styleUrls: ['./anzeige-manager.component.scss']
})

export class AnzeigeManagerComponent implements OnInit, OnDestroy {
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

  // Für das Fenster der generierten ID
  public IdGeneratePopup = false;
  public generatedId = '';
  public popupPosition = {x: 120, y: 120};

  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  // Fenster mit dem Mauszeiger ist bewegbar
  private onWindowMouseMove = (ev: MouseEvent) => {
    if (!this.isDragging) {
      return;
    }
    this.popupPosition.x = ev.clientX - this.dragOffsetX;
    this.popupPosition.y = ev.clientY - this.dragOffsetY;
    if (this.popupPosition.x < 0) {
      this.popupPosition.x = 0;
    }
    if (this.popupPosition.y < 0) {
      this.popupPosition.y = 0;
    }
  }

  private onWindowMouseUp = (_ev: MouseEvent) => {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  constructor(private anzeigenProvider: AnzeigenProviderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Holt den in der wkdurchfuehrung.routing.ts definierten Parameter aus der URL
    this.route.paramMap.subscribe((params) => {
      this.wettkampfId = parseInt(params.get('selectedWettkampfId'), 10);
    });
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
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
      this.displays.splice(deleteIndex, 1);
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

  public async showGeneratedID(): Promise<void> {
    const response = await this.anzeigenProvider.getNewPhysischeBildschirmID();
    this.generatedId = '' + response.payload;
    this.IdGeneratePopup = true;
    this.popupPosition = {x: 120, y: 120};
  }

  public closeGeneratedIdPopup(): void {
    this.IdGeneratePopup = false;
    this.isDragging = false;
  }

  public startDrag(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    this.isDragging = true;
    this.dragOffsetX = event.clientX - this.popupPosition.x;
    this.dragOffsetY = event.clientY - this.popupPosition.y;
    event.preventDefault();
  }

  public copyGeneratedId(): void {
    if (!this.generatedId) {
      alert('Es ist noch keine ID vorhanden.');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.generatedId).then(() => {
        alert('ID kopiert');
      }, () => {
        alert('Kopieren fehlgeschlagen');
      });
    } else {
      const ta = document.createElement('textarea');
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        alert('ID kopiert');
      } catch (e) {
        alert('Kopieren fehlgeschlagen');
      }
      document.body.removeChild(ta);
    }
  }
}

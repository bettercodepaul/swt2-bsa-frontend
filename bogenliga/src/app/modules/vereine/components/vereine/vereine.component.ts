import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG} from './vereine.config';
import {PlaygroundVersionedDataObject} from '../../../playground/components/playground/types/playground-versioned-data-object.class';
import {isNullOrUndefined} from '@shared/functions';
import {VereinDO} from '@vereine/types/verein-do.class';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {Router} from '@angular/router';
import {CommonComponent, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html'
})
export class VereineComponent extends CommonComponent implements OnInit {

  public config = VEREINE_CONFIG;
  public selectedDTOs: VereinDO[];
  public multipleSelections = true;

  constructor(private vereinDataProvider: VereinDataProviderService, private router: Router) {
    super();
  }

  ngOnInit() {
  }

  public onSelect($event: VereinDO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
  }

  public getSelectedDTO(): string {
    if (isNullOrUndefined(this.selectedDTOs)) {
      return '';
    } else {
      console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));
      const names: string[] = [];

      this.selectedDTOs.forEach((item) => {
        names.push(item.name);
      });

      return names.join(', ');
    }
  }

  public getVersionedDataObjects(): PlaygroundVersionedDataObject[] {
      //this.vereinDataProvider.findAll()
        //  .then((response: BogenligaResponse<VereinDTO[]>) => {console.log(response.payload); })
  //.catch((response: BogenligaResponse<VereinDTO[]>) => {console.log(response.payload); });
      return [new PlaygroundVersionedDataObject(1, "Schütze1")];
  }

}

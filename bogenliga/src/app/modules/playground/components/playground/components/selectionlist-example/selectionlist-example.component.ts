import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined} from '@shared/functions';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {PlaygroundVersionedDataObject} from '../../types/playground-versioned-data-object.class';

@Component({
  selector: 'bla-selectionlist-example',
  templateUrl: './selectionlist-example.component.html',
  styleUrls: ['./selectionlist-example.component.scss']
})
export class SelectionlistExampleComponent implements OnInit {

  public loading = true;
  public selectedDTOs: PlaygroundVersionedDataObject[];
  public multipleSelections = true;

  public selectedRightItems: PlaygroundVersionedDataObject[] = [];
  constructor() {
  }

  ngOnInit() {
    of(true).pipe(delay(5000)).subscribe((ignore) => this.loading = false);
  }


  public onSelect($event: PlaygroundVersionedDataObject[]): void {
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

  public isLoading(): boolean {
    return this.loading;
  }

  public getEmptyList(): PlaygroundVersionedDataObject[] {
    return [];
  }

  public getVersionedDataObjects(): PlaygroundVersionedDataObject[] {
    return [
      new PlaygroundVersionedDataObject(1, 'Schütze 1'),
      new PlaygroundVersionedDataObject(2, 'Schütze 2'),
      new PlaygroundVersionedDataObject(3, 'Schütze 3'),
      new PlaygroundVersionedDataObject(4, 'Schütze 4'),
      new PlaygroundVersionedDataObject(5, 'Schütze 5'),
      new PlaygroundVersionedDataObject(6, 'Schütze 6'),
      new PlaygroundVersionedDataObject(7, 'Schütze 7'),
      new PlaygroundVersionedDataObject(8, 'Schütze 8'),
      new PlaygroundVersionedDataObject(9, 'Schütze 9'),
      new PlaygroundVersionedDataObject(10, 'Schütze 10'),
    ];
  }
}

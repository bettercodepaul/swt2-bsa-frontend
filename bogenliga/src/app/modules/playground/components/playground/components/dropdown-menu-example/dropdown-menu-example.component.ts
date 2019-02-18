import {Component, OnInit} from '@angular/core';
import {PlaygroundVersionedDataObject} from '../../types/playground-versioned-data-object.class';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'bla-dropdown-menu-example',
  templateUrl: './dropdown-menu-example.component.html',
  styleUrls: ['./dropdown-menu-example.component.scss']
})
export class DropdownMenuExampleComponent implements OnInit {

  public loading = true;
  public selectedDTO: PlaygroundVersionedDataObject;

  constructor() {
  }

  ngOnInit() {

    of(true).pipe(delay(5000)).subscribe(ignore => this.loading = false);
  }


  public onSelect($event: PlaygroundVersionedDataObject): void {
    this.selectedDTO = $event;
  }

  public getSelectedDTO(): string {
    if (isNullOrUndefined(this.selectedDTO)) {
      return '';
    } else {
      console.log('Dropdown Menü: selectedDTO = ' + JSON.stringify(this.selectedDTO));
      return this.selectedDTO['name'];
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
    ];
  }
}

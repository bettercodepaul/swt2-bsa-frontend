import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'bla-selectionlist',
  templateUrl: './selectionlist.component.html',
  styleUrls: ['./selectionlist.component.scss']
})
export class SelectionlistComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() visible = true;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() multipleSelections = true;

  @Input() public emptyItemListPlaceholderTranslationKey = 'SELECTIONLIST.NO_ENTRIES_FOUND';
  @Input() public loadingPlaceholderTranslationKey = 'SELECTIONLIST.LOADING';

  /**
   *
   * @type {Array} of VersionedDataObject
   */
  @Input() items: VersionedDataObject[] = [];
  /**
   * The selector is used to access the property of an item for the select option text
   *
   * @type {string} visible field selector for each option
   */
  @Input() optionFieldSelector: string;
  /**
   * The parent component can receive the onClick event.
   * @type {EventEmitter<VersionedDataObject>} void or the defined return value
   */
  @Output() onSelect = new EventEmitter<any>();
  /**
   *
   * @type {number} id of the preselected item
   */
  @Input() selectedItemIds: number[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  public isDisabled(): boolean {
    return this.disabled || this.showEmptyItemListPlaceholder() || this.showLoadingPlaceholder();
  }

  public isMultibleSelectionAllowed(): boolean {
    return isNullOrUndefined(this.multipleSelections) || this.multipleSelections;
  }

  public onSelectionChanged($event: number[]) {

    const selectedItems: VersionedDataObject[] = [];

    $event.forEach(itemId => {
      this.items.forEach(item => {
        if (item.id === itemId) {
          selectedItems.push(item);
        }
      })
    });
    console.log('On Selection Changed: ' + JSON.stringify(selectedItems));

    this.onSelect.emit(selectedItems);
  }

  public getListSize(): number {

    if (this.showEmptyItemListPlaceholder()) {
      return 1;
    } else {
      return this.items.length;
    }
  }

  public showEmptyItemListPlaceholder(): boolean {
    return isNullOrUndefined(this.items) || this.items.length === 0;
  }

  public showLoadingPlaceholder(): boolean {
    return this.loading;
  }

}

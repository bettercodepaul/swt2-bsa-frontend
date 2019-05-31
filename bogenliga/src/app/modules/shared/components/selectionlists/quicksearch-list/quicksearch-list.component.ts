import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {TranslatePipe} from '@ngx-translate/core';
import {isNullOrUndefined} from '@shared/functions';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';

@Component({
  selector: 'bla-quicksearch-list',
  templateUrl: './quicksearch-list.component.html',
  styleUrls: ['./quicksearch-list.component.scss'],
  providers: [TranslatePipe]
})
export class QuicksearchListComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() visible = true;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() multipleSelections: boolean;


  @Input() public placeholderTranslationKey = 'SELECTIONLIST.SEARCH_PLACEHOLDER';
  @Input() public emptyItemListPlaceholderTranslationKey = 'SELECTIONLIST.NO_ENTRIES_FOUND';
  @Input() public loadingPlaceholderTranslationKey = 'SELECTIONLIST.LOADING';

  @Input() public selectionListHeight: string;

  /**
   *
   * @type {Array} of VersionedDataObject
   */
  @Input() public items: VersionedDataObject[] = [];
  /**
   * The selector is used to access the property of an item for the select option text
   *
   * @type {string} visible field selector for each option
   */
  @Input() public optionFieldSelector: string;
  /**
   * The parent component can receive the onClick event.
   * @type {EventEmitter<VersionedDataObject>} void or the defined return value
   */
  @Output() public onSelect = new EventEmitter<any>();
  /**
   *
   * @type {number} id of the preselected item
   */
  @Input() public selectedItemIds: number[] = [];

  public filteredItems: VersionedDataObject[] = [];
  public lastSearchValue: string;
  public findIcon = faSearch;

  constructor(private translate: TranslatePipe) {
  }


  ngOnInit() {
    this.filteredItems = this.items;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredItems = this.items;
  }

  public onItemSelect($event: VersionedDataObject[]) {
    this.onSelect.emit($event);
  }

  public isDisabled(): boolean {
    return this.disabled || isNullOrUndefined(this.items) || this.items.length === 0 || this.loading;
  }

  public getPlacholder(): string {
    return this.translate.transform(this.placeholderTranslationKey);
  }

  public getFilteredItems(): VersionedDataObject[] {
    return this.filteredItems;
  }

  public getSelectedItemIds(): number[] {
    return this.selectedItemIds;
  }

  public onSearch(searchValue: string) {
    // filter array on change
    if (this.lastSearchValue !== searchValue) {
      this.filteredItems = this.filterArray(searchValue).slice(0);
      this.lastSearchValue = searchValue;
      this.onItemSelect([]);
    }
  }

  private resetState() {
    this.filteredItems = this.items;
  }

  private filterArray(searchValue: string): VersionedDataObject[] {
    this.selectedItemIds = [];

    // this-context not known in filter method thus the need for an auxiliary variable
    const searchAttribute = this.optionFieldSelector;
    return this.items.filter((el) => {
      if (isNullOrUndefined(searchAttribute)) {
        const elToString = String(el);
        return elToString.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
      }
      return el[searchAttribute].toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });
  }
}

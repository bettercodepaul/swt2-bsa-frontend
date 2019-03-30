import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';

@Component({
  selector: 'bla-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  providers: [TranslatePipe]
})
export class DropdownMenuComponent implements OnInit, OnChanges {


  @Input() id: string;
  @Input() visible = true;
  @Input() disabled = false;
  @Input() loading = false;

  @Input() public pleaseSelectItemPlaceholderTranslationKey = 'DROPDOWN.PLEASE_SELECT_ITEM';
  @Input() public emptyItemListPlaceholderTranslationKey = 'DROPDOWN.NO_ENTRIES_FOUND';
  @Input() public loadingPlaceholderTranslationKey = 'DROPDOWN.LOADING';


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
  @Input() selectedItemId = 0;


  private menuVisible = false;

  constructor(private translate: TranslatePipe) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  public showMenu(): void {
    console.log('showMenu()');
    this.menuVisible = true;
  }

  public toggleMenu(): void {
    console.log('toggleMenu()');
    this.menuVisible = !this.menuVisible;
  }

  public hideMenu(): void {
    console.log('hideMenu()');
    this.menuVisible = false;
  }

  public isMenuVisible(): boolean {
    return this.menuVisible;
  }

  public selectItem(itemId: number): void {
    console.log('selectItem() with ' + JSON.stringify(itemId));
    if (itemId !== 0) {
      this.selectedItemId = itemId;
      this.sendSelectedItem();
    }

    this.hideMenu();
  }

  public getSelectedItemLabel(): string {
    if (this.showLoadingPlaceholder()) {
      return this.translate.transform(this.loadingPlaceholderTranslationKey);
    }
    if (this.showEmptyItemListPlaceholder()) {
      return this.translate.transform(this.emptyItemListPlaceholderTranslationKey);
    }
    if (this.showItemListPlaceholder()) {
      return this.translate.transform(this.pleaseSelectItemPlaceholderTranslationKey);
    }

    return this.findItemById(this.selectedItemId)[this.optionFieldSelector];
  }

  /**
   * Disable the button, if the disabled flag is true or
   * the button action (invoked by the onButtonClick event) is running
   *
   * @returns {boolean} true, if the disabled or loading flag is true. Also disabled, if no item can be selected.
   */
  public isDisabled() {
    return this.disabled || this.loading || this.showEmptyItemListPlaceholder();
  }


  private sendSelectedItem(): void {
    if (this.selectedItemId !== 0) {
      this.onSelect.emit(this.findItemById(this.selectedItemId));
    }
  }

  private showLoadingPlaceholder(): boolean {
    return this.loading;
  }

  private showItemListPlaceholder(): boolean {
    return this.selectedItemId === 0 && this.items.length > 0;
  }

  private showEmptyItemListPlaceholder(): boolean {
    return this.selectedItemId === 0 && this.items.length === 0;
  }

  private findItemById(selectedItemId: number): any {
    for (const item of this.items) {
      if (item.id === selectedItemId) {
        return item;
      }
    }

    return null;
  }
}

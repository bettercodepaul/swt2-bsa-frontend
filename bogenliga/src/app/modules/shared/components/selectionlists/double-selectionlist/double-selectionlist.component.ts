import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

@Component({
  selector: 'bla-double-selectionlist',
  templateUrl: './double-selectionlist.component.html',
  styleUrls: ['./double-selectionlist.component.scss']
})
export class DoubleSelectionlistComponent implements OnInit {


  @Input()
  public idLeftList: string;

  @Input()
  public idRightList: string;

  @Input()
  public leftItems: VersionedDataObject[] = [];

  @Output()
  public rightItemsChange = new EventEmitter();

  @Input()
  public fieldSelector = 'id';
  public multipleSelections = false;
  public leftItemList: VersionedDataObject[] = [];
  public rightSelected = false;
  public rightItemList: VersionedDataObject[] = [];
  private selectedLeftItems: VersionedDataObject[] = [];
  private leftSelected = false;
  private selectedRightItems: VersionedDataObject[] = [];

  @Input()
  get rightItems() {
    return this.rightItemList;
  }

  set rightItems(val) {
    this.rightItemList = val;
    this.rightItemsChange.emit(this.rightItemList);
  }

  constructor() {
  }

  ngOnInit() {
    this.leftItems.forEach((item) => {
      this.leftItemList.push(Object.assign(item));
    });
    this.rightItems.forEach((item) => {
      this.rightItemList.push(Object.assign(item));
    });
  }

  public onLeftToRight(): void {
    this.selectedLeftItems.forEach((item) => {
      this.rightItemList.push(item);

      const index = this.leftItemList.indexOf(item, 0);
      if (index > -1) {
        this.leftItemList.splice(index, 1);
      }
    });

    this.rightItemList.sort(this.compare);

  }

  public onRightToLeft(): void {
    this.selectedRightItems.forEach((item) => {
      this.leftItemList.push(item);

      const index = this.rightItemList.indexOf(item, 0);
      if (index > -1) {
        this.rightItemList.splice(index, 1);
      }
    });

    this.leftItemList.sort(this.compare);

    this.leftItemList.forEach((item) => this.leftItems.push(Object.assign(item)));
  }

  public onLeftItemSelect($event: VersionedDataObject[]): void {
    this.selectedLeftItems = [];
    this.selectedRightItems = [];
    this.selectedLeftItems = $event;
  }

  public onRightItemSelect($event: VersionedDataObject[]): void {
    this.selectedLeftItems = [];
    this.selectedRightItems = [];
    this.selectedRightItems = $event;
  }

  public onRightFocus(focusState: boolean): void {
    this.rightSelected = focusState;
    this.leftSelected = false;
  }

  public isLeftSelected(): boolean {
    return this.leftSelected;
  }

  public onLeftFocus(focusState: boolean): void {
    this.leftSelected = focusState;
    this.rightSelected = false;
  }

  public isRightSelected(): boolean {
    return this.rightSelected;
  }

  public getButtonId(listId: string): string {
    return `shiftLeft-${listId}`;
  }

  private compare = (a, b) => {
    if (a[this.fieldSelector] < b[this.fieldSelector]) {
      return -1;
    }
    if (a[this.fieldSelector] > b[this.fieldSelector]) {
      return 1;
    }
    return 0;
  }
}

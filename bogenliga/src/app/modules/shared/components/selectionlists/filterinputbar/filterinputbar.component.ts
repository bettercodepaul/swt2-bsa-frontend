import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {TranslatePipe} from '@ngx-translate/core';
import {MigrationComponent} from '@verwaltung/components';

@Component({
  selector: 'bla-filterinputbar',
  templateUrl: './filterinputbar.component.html',
  styleUrls: ['./filterinputbar.component.scss'],
  providers: [TranslatePipe]
})
export class FilterinputbarComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  @Input() filterlabel: string;
  @Input() id: string;
  @Input() item: string;
  @Input() items: Array<string>;

  @Output() public onFilterButtonClicked = new EventEmitter<string>();
  public timestamps = ["letzter Monat", "letzten drei Monate", "letzten sechs Monate", "im letzten Jahr", "alle"];
  public static currentItem:string;
  public static currentStatus:string;
  public static currentTimestamp:string;
  public onFilterButtonClick() {
    FilterinputbarComponent.currentItem = this.item;
    console.log("Current ITEM is: " + FilterinputbarComponent.currentItem)
    if(this.timestamps.includes(FilterinputbarComponent.currentItem)){
      FilterinputbarComponent.currentTimestamp = FilterinputbarComponent.currentItem
    }else{
      FilterinputbarComponent.currentStatus = FilterinputbarComponent.currentItem
    }
    this.onFilterButtonClicked.emit();
  }

  protected readonly MigrationComponent = MigrationComponent;
}

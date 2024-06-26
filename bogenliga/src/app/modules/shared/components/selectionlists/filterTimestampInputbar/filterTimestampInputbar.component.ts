import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {TranslatePipe} from '@ngx-translate/core';
import {MigrationComponent} from '@verwaltung/components';

@Component({
  selector: 'bla-filterTimestampInputbar',
  templateUrl: './filterTimestampInputbar.component.html',
  styleUrls: ['./filterTimestampInputbar.component.scss'],
  providers: [TranslatePipe]
})
export class FilterTimestampInputbarComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {

  }
  @Input() filterlabel: string;
  @Input() id: string;
  @Input() item: string;
  @Input() items: Array<string>;

  @Output() public onFilterButtonClicked = new EventEmitter<string>();
  public timestamps = ["letzter Monat", "letzten drei Monate", "letzten sechs Monate", "im letzten Jahr","älter als ein Monat","älter als drei Monate","älter als sechs Monate","alle"];
  public static currentItem:string;
  public static currentStatus:string;
  public static currentTimestamp:string;
  ngOnInit(): void {

  }
  public onFilterButtonClick() {
    FilterTimestampInputbarComponent.currentItem = this.item;
    console.log("Current ITEM is: " + FilterTimestampInputbarComponent.currentItem)
    if(this.timestamps.includes(FilterTimestampInputbarComponent.currentItem)){
      FilterTimestampInputbarComponent.currentTimestamp = FilterTimestampInputbarComponent.currentItem
    }else{
      FilterTimestampInputbarComponent.currentStatus = FilterTimestampInputbarComponent.currentItem
    }
    this.onFilterButtonClicked.emit();
  }

  protected readonly MigrationComponent = MigrationComponent;
}

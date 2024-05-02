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

  @Input() id: string;
  @Input() item: string;
  @Input() items: Array<string>;

  @Output() public onFilterButtonClicked = new EventEmitter<string>();

  public static currentItem:string;
  public onFilterButtonClick() {
    FilterinputbarComponent.currentItem = this.item;
    this.onFilterButtonClicked.emit();
  }

  protected readonly MigrationComponent = MigrationComponent;
}

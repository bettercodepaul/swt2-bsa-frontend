import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'bla-quicksearch',
  templateUrl: './quicksearch.component.html',
  styleUrls: ['./quicksearch.component.scss'],
  providers: [TranslatePipe]
})
export class QuicksearchComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() visible = true;
  @Input() sessionSearch = "";
  @Input() public placeholderTranslationKey = 'SELECTIONLIST.SEARCH_PLACEHOLDER';

  @Output() public onSearchEntry = new EventEmitter<string>();

  public lastSearchValue: string;
  public findIcon = faSearch;

  constructor(private translate: TranslatePipe) {
  }


  ngOnInit() {
    if (localStorage.getItem(this.sessionSearch)) {
      this.lastSearchValue = JSON.parse(localStorage.getItem(this.sessionSearch));
      this.onSearch(this.lastSearchValue);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  public getPlaceholder(): string {
    return this.translate.transform(this.placeholderTranslationKey);
  }

  public onSearch(searchValue: string) {
      this.lastSearchValue = searchValue;
      localStorage.setItem(this.sessionSearch, JSON.stringify(searchValue));
      this.onSearchEntry.emit(searchValue);
  }
}

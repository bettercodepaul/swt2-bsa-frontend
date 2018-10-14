import {BaseTableSorter} from './base-table-sorter.class';
import {TableColumnConfig} from '../types/table-column-config.interface';
import {TableConfig} from '../types/table-config.interface';
import {TableColumnType} from '../types/table-column-type.enum';

export class DefaultTableSorter extends BaseTableSorter {

  constructor(tableConfig: TableConfig) {
    super(tableConfig);
  }

  sorterImplementation(currentlySortedColumn: TableColumnConfig) {
    if (currentlySortedColumn !== undefined) {
      switch (currentlySortedColumn.type) {
        case TableColumnType.NUMBER:
          return this.sortNumber(currentlySortedColumn);
        case TableColumnType.DATE:
          return this.sortOnDate(currentlySortedColumn);
        case TableColumnType.TRANSLATION_KEY:
          return this.sortTwoFunctions(
            // attention: the translation keys are sorted, not the visible (translated) text
            this.sortAlphabetical(currentlySortedColumn),
            // use first column
            this.sortAlphabetical(this.config.columns[0], currentlySortedColumn.currentSortOrder)
          );
        default:
          return this.sortAlphabetical(currentlySortedColumn);
      }
    }
  }
}

import {TableColumnConfig} from '../types/table-column-config.interface';
import {TableColumnType} from '../types/table-column-type.enum';
import {TableConfig} from '../types/table-config.interface';
import {BaseTableSorter} from './base-table-sorter.class';

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
        // If its possible that null values appear in a collumn, use this if you want to make sure that null is
        // smaller than numbers if you use a sort algorithm.
        case TableColumnType.NULLorNUMBER:
          return this.sortByNull(currentlySortedColumn);
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

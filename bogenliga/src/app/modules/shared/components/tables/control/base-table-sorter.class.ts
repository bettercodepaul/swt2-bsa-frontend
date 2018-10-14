import {TableConfig} from '../types/table-config.interface';
import {TableColumnConfig} from '../types/table-column-config.interface';
import {isNullOrUndefined} from 'util';
import {TableColumnSortOrder} from '../types/table-column-sort-order.enum';
import {TableRow} from '../types/table-row.class';
import {CustomPropertySortOrder} from '../types/custom-sort-order.class';


export abstract class BaseTableSorter {

  config: TableConfig;
  private currentlySortedColumn: TableColumnConfig;

  constructor(tableConfig: TableConfig) {
    this.config = tableConfig;

    this.config.columns.forEach(column => {
      if (!isNullOrUndefined(column.currentSortOrder)
        && column.currentSortOrder !== TableColumnSortOrder.UNSORTED) {
        // save state to show the (ascending/ descending) sort order icons
        this.currentlySortedColumn = column;
      }
    });
  }


  /**
   * OVERRIDE to define the sort logic
   *
   * This function returns a function to sort an array of row objects.
   * Please use the prepared sorting functions:
   *
   * @see sortAlphabetical
   * @see sortOnDate
   * @see sortWithCustomPropertySortOrder
   *
   * @param currentlySortedColumn
   */
  abstract sorterImplementation(currentlySortedColumn: TableColumnConfig);


  public refreshCurrentSorting(rows: TableRow[]) {

    if (!isNullOrUndefined(rows)) {
      // the custom sorter overrides the sorterImplementation method
      rows.sort(this.sorterImplementation(this.currentlySortedColumn));
    }

    return rows;
  }

  /**
   *
   * @param rows to be sorted
   * @param sortColumn will be stored to show the ascending/ descending sort icons
   * @returns {TableRow[]} sorted rows with the sorting functions from the sorterImplementation method
   */
  public sortByColumn(rows: TableRow[], sortColumn: TableColumnConfig): TableRow[] {
    if (!this.config) {
      console.warn('No table configuration found. Abort sorting column: ', sortColumn.propertyName);
      return rows;
    }

    this.toggleSortOrder(sortColumn);

    // the custom sorter overrides the sorterImplementation method
    rows.sort(this.sorterImplementation(sortColumn));

    // save state to show the (ascending/ descending) sort order icons
    this.currentlySortedColumn = sortColumn;

    return rows;
  }

  /**
   *
   * @param column
   * @returns {any} css classes to show the ascending/ descending sort icons
   */
  public getSortingClasses(column: TableColumnConfig): string[] {
    if (column.sortable) {

      if (this.currentlySortedColumn
        && this.currentlySortedColumn === column) {
        return ['sortable', TableColumnSortOrder[column.currentSortOrder].toLowerCase()];
      } else {
        return ['sortable', 'unsorted'];
      }

    } else {
      return [''];
    }
  }

  /**
   * Default sort function to sort an array alphabetically
   *
   * @see sortTwoFunctions
   *
   * @param currentlySortedColumn
   * @param overrideSortOrder is used, if the sort order of a previous sort function should adopted.
   * Override sort order, if this function is the second one of the sortTwoFunctions method
   * @returns {(rowA:any, rowB:any)=>(number|number|number)} sort function
   */
  sortAlphabetical(currentlySortedColumn: TableColumnConfig, overrideSortOrder?: TableColumnSortOrder) {
    let turnAroundSortOrder = this.setUpSortOrder(currentlySortedColumn.currentSortOrder);

    if (overrideSortOrder) {
      turnAroundSortOrder = this.setUpSortOrder(overrideSortOrder);
    }

    return function (rowA, rowB) {

      let payloadA = rowA.getText(currentlySortedColumn);
      let payloadB = rowB.getText(currentlySortedColumn);

      if (payloadA === undefined) {
        payloadA = '';
      }
      if (payloadB === undefined) {
        payloadB = '';
      }

      if (payloadA.localeCompare(payloadB) < 0) {
        return -1 * turnAroundSortOrder;
      } else if (payloadA.localeCompare(payloadB) > 0) {
        return turnAroundSortOrder;
      }

      return 0;
    };
  }

  sortNumber(currentlySortedColumn: TableColumnConfig, overrideSortOrder?: TableColumnSortOrder) {
    let turnAroundSortOrder = this.setUpSortOrder(currentlySortedColumn.currentSortOrder);

    if (overrideSortOrder) {
      turnAroundSortOrder = this.setUpSortOrder(overrideSortOrder);
    }

    return function (rowA, rowB) {

      let payloadA = rowA.getText(currentlySortedColumn);
      let payloadB = rowB.getText(currentlySortedColumn);

      if (payloadA === undefined) {
        payloadA = '';
      }
      if (payloadB === undefined) {
        payloadB = '';
      }

      if (payloadA.localeCompare(payloadB, undefined, {numeric: true}) < 0) {
        return -1 * turnAroundSortOrder;
      } else if (payloadA.localeCompare(payloadB, undefined, {numeric: true}) > 0) {
        return turnAroundSortOrder;
      }

      return 0;
    };
  }

  /**
   * Sort date objects
   *
   * @see sortTwoFunctions
   *
   * @param currentlySortedColumn
   * @param overrideSortOrder is used, if the sort order of a previous sort function should adopted.
   * Override sort order, if this function is the second one of the sortTwoFunctions method
   * @returns {(rowA:any, rowB:any)=>(number|number|number)}
   */
  sortOnDate(currentlySortedColumn: TableColumnConfig, overrideSortOrder?: TableColumnSortOrder) {
    let turnAroundSortOrder = this.setUpSortOrder(currentlySortedColumn.currentSortOrder);

    if (overrideSortOrder) {
      turnAroundSortOrder = this.setUpSortOrder(overrideSortOrder);
    }

    return function (rowA, rowB) {
      const path = currentlySortedColumn.propertyName
                                        .replace('[', '.')
                                        .replace(']', '')
                                        .split('.');

      const resolvePropertyFunction = function (obj, property) {
        return obj[property];
      };

      // resolve property of nested objects via dot-notation, e.g. "updatevolumeTO.istepcontainerTO.name"
      const payloadA = path.reduce(resolvePropertyFunction, rowA.payload);
      const payloadB = path.reduce(resolvePropertyFunction, rowB.payload);

      // parse date and compare the timestamps
      let date1: Date = new Date(Date.parse(payloadA));
      let date2: Date = new Date(Date.parse(payloadB));


      if (date1.getTime() < date2.getTime()) {
        return -1 * turnAroundSortOrder;
      } else if (date1.getTime() > date2.getTime()) {
        return turnAroundSortOrder;
      }

      return 0;
    };
  }

  /**
   *
   * @param currentlySortedColumn
   * @param customPropertySortOrder
   * @param overrideSortOrder is used, if the sort order of a previous sort function should adopted.
   * Override sort order, if this function is the second one of the sortTwoFunctions method
   * @returns {(rowA:any, rowB:any)=>(number|number|number)}
   */
  sortWithCustomPropertySortOrder(currentlySortedColumn: TableColumnConfig,
    customPropertySortOrder?: CustomPropertySortOrder[],
    overrideSortOrder?: TableColumnSortOrder) {
    let turnAroundSortOrder = this.setUpSortOrder(currentlySortedColumn.currentSortOrder);

    if (overrideSortOrder) {
      turnAroundSortOrder = this.setUpSortOrder(overrideSortOrder);
    }

    // return equals/ do nothing, if no custom sort order defined
    if (!customPropertySortOrder) {
      return function (rowA, rowB) {
        return 0;
      };
    }

    return function (rowA, rowB) {
      const path = currentlySortedColumn.propertyName
                                        .replace('[', '.')
                                        .replace(']', '')
                                        .split('.');

      const resolvePropertyFunction = function (obj, property) {
        return obj[property];
      };

      // resolve property of nested objects via dot-notation, e.g. "updatevolumeTO.istepcontainerTO.name"
      const payloadA = path.reduce(resolvePropertyFunction, rowA.payload);
      const payloadB = path.reduce(resolvePropertyFunction, rowB.payload);

      // get the sort priority from the customPropertySortOrder array
      let priorityA = customPropertySortOrder.find(state => state.property === payloadA).sortOrderPriority;
      let priorityB = customPropertySortOrder.find(state => state.property === payloadB).sortOrderPriority;


      if (priorityA < priorityB) {
        return -1 * turnAroundSortOrder;
      } else if (priorityA > priorityB) {
        return turnAroundSortOrder;
      }

      return 0;
    };
  }


  sortTwoFunctions(compareFn1?: (a: string, b: boolean) => number,
    compareFn2?: (a: string, b: boolean) => number) {
    return function (c, d) {
      let result: number = compareFn1(c, d);
      if (result === 0) {
        return compareFn2(c, d);
      }
      return result;
    };
  }


  private setUpSortOrder(sortOrder: TableColumnSortOrder) {
    return (sortOrder === TableColumnSortOrder.DESCENDING) ? -1 : 1;
  }


  private toggleSortOrder(sortColumn: TableColumnConfig) {
    if (sortColumn.currentSortOrder === TableColumnSortOrder.ASCENDING) {
      sortColumn.currentSortOrder = TableColumnSortOrder.DESCENDING;
    } else {
      sortColumn.currentSortOrder = TableColumnSortOrder.ASCENDING;
    }
  }
}

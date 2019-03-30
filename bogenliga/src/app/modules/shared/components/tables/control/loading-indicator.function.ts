import {TableActionType} from '../types/table-action-type.enum';
import {TableRow} from '../types/table-row.class';

export function showDeleteLoadingIndicatorIcon(rows: TableRow[], id: number): TableRow[] {
  rows.forEach((row) => {
    if (row.payload.id === id) {
      // append loading action types to row
      row.disabledActions = [TableActionType.VIEW, TableActionType.EDIT, TableActionType.DELETE];
      row.loadingActions = [...row.loadingActions, ...[TableActionType.DELETE]];
    }
  });

  return rows;
}

export function hideLoadingIndicator(rows: TableRow[], id: number): TableRow[] {
  rows.forEach((row) => {
    if (row.payload.id === id) {
      // append loading action types to row
      row.disabledActions = [];
      row.loadingActions = [];
    }
  });

  return rows;
}

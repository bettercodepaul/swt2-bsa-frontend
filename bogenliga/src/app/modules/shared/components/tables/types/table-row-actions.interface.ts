import {TableActionType} from './table-action-type.enum';

export interface TableRowActions {
  payloadId: number;
  actionTypes: TableActionType[];
}

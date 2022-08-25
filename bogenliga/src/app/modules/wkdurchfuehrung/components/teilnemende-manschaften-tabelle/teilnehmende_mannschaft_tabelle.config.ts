import {CommonDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {UserPermission} from '@shared/services';


export const TEILNEHMENDE_MANNSCHAFT_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.MANNSCHAFTSNAME',
      propertyName:   'name',
      width:          20,
    },
    {
      translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.LIGA',
      propertyName:   'veranstaltungName',
      width:          20,
    },
  ],
  actions: {
    actionTypes: [TableActionType.DELETE],
    width:       6
  },
  deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN],
  editPermission: [UserPermission.CAN_MODIFY_MY_VEREIN]

};
